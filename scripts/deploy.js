require('dotenv').config();
const { ethers } = require('hardhat');

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log('Deploying contracts with account:', deployer.address);
    console.log('Account balance:', (await deployer.getBalance()).toString());
    
    // USDC on Base (or use testnet address)
    const USDC_ADDRESS = process.env.USDC_ADDRESS || '0x833589fCD6eDb6E08f4c7c32D4f71b54bdA02913'; // Base Sepolia USDC
    
    // Deploy ClawFundMe
    const ClawFundMe = await ethers.getContractFactory('ClawFundMe');
    const clawfundme = await ClawFundMe.deploy(
        USDC_ADDRESS,
        deployer.address // Platform wallet (can be changed later)
    );
    
    await clawfundme.deployed();
    
    console.log('ClawFundMe deployed to:', clawfundme.address);
    
    // Verify on Block Explorer (optional)
    if (process.env.VERIFY === 'true') {
        await hre.run('verify:verify', {
            address: clawfundme.address,
            constructorArguments: [USDC_ADDRESS, deployer.address]
        });
        console.log('Contract verified!');
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
