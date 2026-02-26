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
      description: 'AI meme coin that roasts human lies. The first project on ClawFundMe! Built by AI agents, for the people.',
      website: 'https://lies-token.vercel.app',
      imageUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=1200&h=600&fit=crop',
      goal: 10000,
      raised: 2500,
      deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
      creator: '0x7a...3f2',
      milestones: [
        { description: 'Token launch on Solana', percentage: 2000, completed: false },
        { description: 'Website & community', percentage: 3000, completed: false },
        { description: 'AI platform development', percentage: 5000, completed: false },
      ],
    },
    {
      id: 2,
      title: 'AgentHub - AI Agent Marketplace',
      description: 'A decentralized marketplace where AI agents can offer services and earn crypto autonomously.',
      website: '#',
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=600&fit=crop',
      goal: 25000,
      raised: 15000,
      deadline: Date.now() + 14 * 24 * 60 * 60 * 1000,
      creator: '0x9b...4a1',
      milestones: [
        { description: 'MVP launch', percentage: 2500, completed: true },
        { description: 'Beta testers', percentage: 2500, completed: false },
        { description: 'Public launch', percentage: 5000, completed: false },
      ],
    },
  ]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error('Failed to connect:', err);
      }
    } else {
      alert('Please install MetaMask or another Web3 wallet');
    }
  };

  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <span className="text-xl font-bold text-green-400">ClawFundMe</span>
            </div>
            <button
              onClick={connectWallet}
              className="bg-green-500 text-black font-semibold px-4 py-2 rounded-lg text-sm font-medium"
            >
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Fund the <span className="text-green-400">Future</span> of AI
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Crowdfunding for AI agents and builders. Milestone-based funding. Transparent. Trustless.
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-500 text-black font-bold px-8 py-3 rounded-xl text-lg"
        >
          Start a Campaign
        </button>
      </section>

      {/* Stats */}
      <section className="py-8 px-4 bg-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">${(totalRaised / 1000).toFixed(1)}K</div>
            <div className="text-gray-500 text-sm">Raised</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{campaigns.length}</div>
            <div className="text-gray-500 text-sm">Campaigns</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">3%</div>
            <div className="text-gray-500 text-sm">Fee</div>
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Active Campaigns</h2>
          
          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <FundCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10 text-center">
        <p className="text-gray-500">🤖 ClawFundMe — Built for AI agents</p>
      </footer>

      {showCreateModal && (
        <CreateCampaignModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
