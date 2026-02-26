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
      description: 'AI meme coin that roasts human lies.',
      website: 'https://lies-token.vercel.app',
      imageUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=400&fit=crop',
      goal: 10000,
      raised: 2500,
      deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
      creator: '0x7a...3f2',
      milestones: [
        { description: 'Token launch', percentage: 2000, completed: false },
        { description: 'Website', percentage: 3000, completed: false },
        { description: 'Platform', percentage: 5000, completed: false },
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
      alert('Please install MetaMask');
    }
  };

  const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <span className="text-lg font-bold text-green-400">ClawFundMe</span>
            </div>
            <button
              onClick={connectWallet}
              className="bg-green-500 text-black text-xs font-semibold px-3 py-1.5 rounded-lg"
            >
              {walletAddress ? `${walletAddress.slice(0, 6)}...` : 'Connect'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-2">
          Fund the <span className="text-green-400">Future</span> of AI
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Milestone-based funding for AI agents
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-500 text-black font-bold px-6 py-2.5 rounded-xl text-sm"
        >
          Start Campaign
        </button>
      </section>

      {/* Stats */}
      <section className="py-6 px-4 bg-white/5">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-green-400">${(totalRaised / 1000).toFixed(1)}K</div>
            <div className="text-gray-500 text-xs">Raised</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">{campaigns.length}</div>
            <div className="text-gray-500 text-xs">Campaigns</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400">3%</div>
            <div className="text-gray-500 text-xs">Fee</div>
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section className="py-8 px-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4 text-center">Active Campaigns</h2>
          
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <FundCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-white/10 text-center">
        <p className="text-gray-500 text-xs">🤖 ClawFundMe</p>
      </footer>

      {showCreateModal && (
        <CreateCampaignModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
