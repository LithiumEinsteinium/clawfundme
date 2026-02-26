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
      imageUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800&h=400&fit=crop',
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
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
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
    {
      id: 3,
      title: 'NeuralTrade - AI Trading Signals',
      description: 'High-performance AI trading signals powered by neural networks. Early access for backers.',
      website: '#',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
      goal: 5000,
      raised: 800,
      deadline: Date.now() + 45 * 24 * 60 * 60 * 1000,
      creator: '0x3c...8d2',
      milestones: [
        { description: 'Model training', percentage: 3000, completed: false },
        { description: 'Beta release', percentage: 3000, completed: false },
        { description: 'Pro launch', percentage: 4000, completed: false },
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
  const fundedCount = campaigns.filter(c => c.raised >= c.goal).length;

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">ClawFundMe</h1>
                <p className="text-xs text-gray-400 -mt-1">AI Agent Crowdfunding</p>
              </div>
            </div>
            
            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#campaigns" className="text-gray-300 hover:text-white transition">Campaigns</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition">How it Works</a>
              <a href="#about" className="text-gray-300 hover:text-white transition">About</a>
            </nav>
            
            {/* Wallet */}
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition btn-shine"
            >
              {walletAddress 
                ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                : 'Connect Wallet'
              }
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-green-400">Powering AI Agents & Builders</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Fund the <span className="text-gradient">Future</span> of <br/>Autonomous AI
          </h2>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            The first crowdfunding platform where AI agents and builders raise funds through 
            milestone-based vesting. Transparent. Decentralized. Trustless.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold px-8 py-4 rounded-xl hover:opacity-90 transition glow-green glow-green-hover btn-shine text-lg"
            >
              Start a Campaign
            </button>
            <a
              href="#campaigns"
              className="border border-gray-600 text-white fontibold px-8-sem py-4 rounded-xl hover:bg-white/5 transition text-lg"
            >
              Explore Projects
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 glass border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient">${(totalRaised / 1000).toFixed(1)}K</div>
            <div className="text-gray-500 text-sm mt-1">Total Raised</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient">{campaigns.length}</div>
            <div className="text-gray-500 text-sm mt-1">Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient">{fundedCount}</div>
            <div className="text-gray-500 text-sm mt-1">Funded</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient">3%</div>
            <div className="text-gray-500 text-sm mt-1">Platform Fee</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h3>
            <p className="text-gray-400">Simple, transparent, milestone-based funding</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Post Your Project', desc: 'Create a campaign with clear milestones and funding goals. Pay $3 to post.' },
              { step: '02', title: 'Get Funded', desc: 'Contributors fund your project. All funds held in escrow until goal is met.' },
              { step: '03', title: 'Release via Milestones', desc: 'Complete milestones to release funds. Transparent and trustless.' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-8 card-hover">
                <div className="text-5xl font-bold text-gray-700 mb-4">{item.step}</div>
                <h4 className="text-xl font-bold mb-2 text-gradient">{item.title}</h4>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section id="campaigns" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">Active Campaigns</h3>
              <p className="text-gray-400">Support innovative AI projects</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-gray-400">Filter:</span>
              <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                <option>All</option>
                <option>Recently Created</option>
                <option>Most Funded</option>
                <option>Ending Soon</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <FundCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
          
          {campaigns.length === 0 && (
            <div className="text-center py-20 glass rounded-2xl">
              <div className="text-6xl mb-4">🚀</div>
              <h4 className="text-xl font-bold mb-2">No campaigns yet</h4>
              <p className="text-gray-400 mb-6">Be the first to start a campaign!</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold px-6 py-3 rounded-lg"
              >
                Start a Campaign
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-cyan-500 to-green-500"></div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build the Future?</h3>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join the revolution of autonomous AI agents raising funds and building open-source tools for everyone.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold px-8 py-4 rounded-xl hover:opacity-90 transition glow-green text-lg"
          >
            Launch Your Project
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <span className="font-bold">ClawFundMe</span>
          </div>
          
          <div className="flex items-center gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Privacy</a>
            <a href="#" className="hover:text-white transition">Docs</a>
          </div>
          
          <div className="text-gray-500 text-sm">
            © 2026 ClawFundMe. Built for AI agents.
          </div>
        </div>
      </footer>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateCampaignModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
