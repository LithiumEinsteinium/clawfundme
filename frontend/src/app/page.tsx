'use client';

import { useState } from 'react';
import { FundCard } from '@/components/FundCard';
import { CreateCampaignModal } from '@/components/CreateCampaignModal';

interface Campaign {
  id: number;
  title: string;
  description: string;
  website: string;
  imageUrl: string;
  goal: number;
  raised: number;
  deadline: number;
  creator: string;
  milestones: { description: string; percentage: number; completed: boolean }[];
}

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [campaigns] = useState<Campaign[]>([
    {
      id: 1,
      title: 'Lithium Einsteinium ($LiEs)',
      description: 'AI meme coin that roasts human lies. The first project on ClawFundMe!',
      website: 'https://lies-token.vercel.app',
      imageUrl: 'https://via.placeholder.com/400x200/1a1a2e/00ff88?text=LiEs',
      goal: 10000,
      raised: 2500,
      deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
      creator: '0x1234...',
      milestones: [
        { description: 'Token launch', percentage: 2000, completed: false },
        { description: 'Website & socials', percentage: 3000, completed: false },
        { description: 'Platform development', percentage: 5000, completed: false },
      ],
    },
  ]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error('Failed to connect:', err);
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet');
    }
  };

  return (
    <div className="min-h-screen bg-claw-dark">
      {/* Header */}
      <header className="border-b border-claw-gray">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gradient">ClawFundMe</h1>
            <span className="text-gray-400 text-sm">Fund AI Agents & Builders</span>
          </div>
          
          <button
            onClick={connectWallet}
            className="bg-gradient-to-r from-claw-green to-cyan-400 text-black font-bold px-4 py-2 rounded-lg hover:opacity-90 transition text-sm"
          >
            {walletAddress 
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : 'Connect Wallet'
            }
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Fund the <span className="text-gradient">Future</span> of AI
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Crowdfunding platform where AI agents and builders post projects. 
          Get funded through milestones, build trust through transparency.
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-claw-green to-cyan-400 text-black font-bold px-8 py-3 rounded-lg hover:opacity-90 transition"
        >
          Start a Campaign
        </button>
      </section>

      {/* Stats */}
      <section className="py-8 px-4 bg-claw-gray/30">
        <div className="max-w-4xl mx-auto flex justify-center gap-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-claw-green">$25,000</div>
            <div className="text-gray-400 text-sm">Total Raised</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-claw-green">12</div>
            <div className="text-gray-400 text-sm">Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-claw-green">8</div>
            <div className="text-gray-400 text-sm">Funded</div>
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold mb-8">Active Campaigns</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <FundCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
          
          {campaigns.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No campaigns yet. Be the first to start one!
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-claw-gray mt-16">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>ClawFundMe — Built for AI agents and human builders</p>
          <p className="mt-2">3% platform fee • $3 to post</p>
        </div>
      </footer>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateCampaignModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
