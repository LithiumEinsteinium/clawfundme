// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ClawFundMe - Crowdfunding with Milestones and Vesting
/// @notice Platform for posting projects and receiving milestone-based funding
contract ClawFundMe is ReentrancyGuard, Ownable {
    
    // ============ Constants ============
    uint256 public constant PLATFORM_FEE_BPS = 300; // 3%
    uint256 public constant POSTING_FEE = 3e6; // $3 in USDC (6 decimals)
    uint256 public constant TIMEOUT_DURATION = 30 days;
    
    // ============ State ============
    IERC20 public usdc;
    address public platformWallet;
    
    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions; // campaignId => funder => amount
    mapping(uint256 => Milestone[]) public milestones; // campaignId => milestones
    mapping(uint256 => uint256) public releasedFunds; // campaignId => amount released
    
    // ============ Enums ============
    enum CampaignStatus {
        Pending,      // Posted but not yet funded
        Active,       // Funded and in progress
        Funded,       // Goal reached, vesting starts
        Completed,    // All milestones done
        Refunded,     // Goal not reached, refunded
        Cancelled     // Creator cancelled
    }
    
    // ============ Structs ============
    struct Campaign {
        address creator;
        string title;
        string description;
        string website;
        string imageUrl;
        uint256 goal;
        uint256 deadline;
        uint256 totalRaised;
        CampaignStatus status;
        uint256 createdAt;
        bool isVerified; // ERC-8004 verified agent
    }
    
    struct Milestone {
        string description;
        uint256 percentage; // Out of 10000 (basis points)
        bool completed;
        uint256 releasedAmount;
    }
    
    // ============ Events ============
    event CampaignCreated(uint256 indexed campaignId, address indexed creator, uint256 goal);
    event Funded(uint256 indexed campaignId, address indexed funder, uint256 amount);
    event GoalReached(uint256 indexed campaignId, uint256 totalRaised);
    event MilestoneCompleted(uint256 indexed campaignId, uint256 milestoneIndex, uint256 amount);
    event FundsReleased(uint256 indexed campaignId, address indexed creator, uint256 amount);
    event RefundClaimed(uint256 indexed campaignId, address indexed funder, uint256 amount);
    event CampaignCancelled(uint256 indexed campaignId);
    
    // ============ Constructor ============
    constructor(address _usdc, address _platformWallet) {
        usdc = IERC20(_usdc);
        platformWallet = _platformWallet;
    }
    
    // ============ Create Campaign ============
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _website,
        string memory _imageUrl,
        uint256 _goal,
        uint256 _durationDays,
        Milestone[] memory _milestones
    ) external nonReentrant returns (uint256) {
        // Charge posting fee
        require(usdc.transferFrom(msg.sender, platformWallet, POSTING_FEE), "Posting fee required");
        
        uint256 campaignId = ++campaignCount;
        uint256 deadline = block.timestamp + (_durationDays * 1 days);
        
        campaigns[campaignId] = Campaign({
            creator: msg.sender,
            title: _title,
            description: _description,
            website: _website,
            imageUrl: _imageUrl,
            goal: _goal,
            deadline: deadline,
            totalRaised: 0,
            status: CampaignStatus.Pending,
            createdAt: block.timestamp,
            isVerified: false
        });
        
        // Store milestones
        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < _milestones.length; i++) {
            milestones[campaignId].push(_milestones[i]);
            totalPercentage += _milestones[i].percentage;
        }
        require(totalPercentage == 10000, "Milestones must equal 100%");
        
        emit CampaignCreated(campaignId, msg.sender, _goal);
        return campaignId;
    }
    
    // ============ Fund Campaign ============
    function fund(uint256 _campaignId, uint256 _amount) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == CampaignStatus.Pending || campaign.status == CampaignStatus.Active, "Campaign not accepting funds");
        require(block.timestamp < campaign.deadline, "Campaign ended");
        
        // Transfer USDC from funder
        require(usdc.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        contributions[_campaignId][msg.sender] += _amount;
        campaign.totalRaised += _amount;
        
        // Check if goal reached
        if (campaign.totalRaised >= campaign.goal) {
            campaign.status = CampaignStatus.Funded;
            emit GoalReached(_campaignId, campaign.totalRaised);
        } else if (campaign.status == CampaignStatus.Pending) {
            campaign.status = CampaignStatus.Active;
        }
        
        emit Funded(_campaignId, msg.sender, _amount);
    }
    
    // ============ Complete Milestone ============
    function completeMilestone(uint256 _campaignId, uint256 _milestoneIndex) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only creator");
        require(campaign.status == CampaignStatus.Funded, "Not in funding stage");
        
        Milestone storage milestone = milestones[_campaignId][_milestoneIndex];
        require(!milestone.completed, "Already completed");
        
        milestone.completed = true;
        
        // Calculate and release funds
        uint256 amountToRelease = (campaign.totalRaised * milestone.percentage) / 10000 - milestone.releasedAmount;
        milestone.releasedAmount += amountToRelease;
        releasedFunds[_campaignId] += amountToRelease;
        
        require(usdc.transfer(campaign.creator, amountToRelease), "Release failed");
        
        emit MilestoneCompleted(_campaignId, _milestoneIndex, amountToRelease);
        
        // Check if all milestones done
        if (_isAllMilestonesCompleted(_campaignId)) {
            // Pay platform fee
            uint256 remaining = campaign.totalRaised - releasedFunds[_campaignId];
            if (remaining > 0) {
                uint256 platformFee = (campaign.totalRaised * PLATFORM_FEE_BPS) / 10000;
                uint256 creatorRemaining = remaining - platformFee;
                if (creatorRemaining > 0) {
                    usdc.transfer(campaign.creator, creatorRemaining);
                }
                if (platformFee > 0) {
                    usdc.transfer(platformWallet, platformFee);
                }
            }
            campaign.status = CampaignStatus.Completed;
        }
    }
    
    // ============ Claim Refund ============
    function claimRefund(uint256 _campaignId) external nonReentrant {
        Campaign storage campaign = campaigns[_campaignId];
        
        // Can only claim after deadline AND goal not met
        require(block.timestamp >= campaign.deadline, "Campaign still active");
        require(campaign.totalRaised < campaign.goal, "Goal was reached");
        require(campaign.status != CampaignStatus.Refunded, "Already refunded");
        
        uint256 contributed = contributions[_campaignId][msg.sender];
        require(contributed > 0, "No contributions");
        
        contributions[_campaignId][msg.sender] = 0;
        campaign.status = CampaignStatus.Refunded;
        
        require(usdc.transfer(msg.sender, contributed), "Refund failed");
        
        emit RefundClaimed(_campaignId, msg.sender, contributed);
    }
    
    // ============ Cancel Campaign ============
    function cancelCampaign(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only creator");
        require(campaign.status == CampaignStatus.Pending || campaign.status == CampaignStatus.Active, "Cannot cancel");
        
        campaign.status = CampaignStatus.Cancelled;
        emit CampaignCancelled(_campaignId);
    }
    
    // ============ Verify Agent ============
    function verifyAgent(uint256 _campaignId) external onlyOwner {
        campaigns[_campaignId].isVerified = true;
    }
    
    // ============ View Functions ============
    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        return campaigns[_campaignId];
    }
    
    function getMilestones(uint256 _campaignId) external view returns (Milestone[] memory) {
        return milestones[_campaignId];
    }
    
    function getContribution(uint256 _campaignId, address _funder) external view returns (uint256) {
        return contributions[_campaignId][_funder];
    }
    
    function _isAllMilestonesCompleted(uint256 _campaignId) internal view returns (bool) {
        Milestone[] storage campaignMilestones = milestones[_campaignId];
        for (uint256 i = 0; i < campaignMilestones.length; i++) {
            if (!campaignMilestones[i].completed) {
                return false;
            }
        }
        return true;
    }
    
    // ============ Admin ============
    function setPlatformWallet(address _wallet) external onlyOwner {
        platformWallet = _wallet;
    }
    
    function withdrawAccidentalFunds(address _token, uint256 _amount) external onlyOwner {
        if (_token == address(0)) {
            payable(owner()).transfer(_amount);
        } else {
            IERC20(_token).transfer(owner(), _amount);
        }
    }
}
