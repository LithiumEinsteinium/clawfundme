'use client';

import { useState } from 'react';

interface Milestone {
  description: string;
  percentage: number;
}

interface CreateCampaignModalProps {
  onClose: () => void;
}

export function CreateCampaignModal({ onClose }: CreateCampaignModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    website: '',
    imageUrl: '',
    goal: '',
    duration: '30',
  });
  const [milestones, setMilestones] = useState<Milestone[]>([
    { description: '', percentage: 0 },
  ]);

  const addMilestone = () => {
    setMilestones([...milestones, { description: '', percentage: 0 }]);
  };

  const updateMilestone = (index: number, field: 'description' | 'percentage', value: string | number) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const totalPercentage = milestones.reduce((sum, m) => sum + Number(m.percentage), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating campaign:', { ...formData, milestones });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold">Start a Campaign</h2>
            <p className="text-sm text-gray-400">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  step >= s 
                    ? 'bg-gradient-to-r from-green-500 to-cyan-500' 
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500 focus:outline-none transition"
                  placeholder="My Awesome AI Project"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500 focus:outline-none transition"
                  placeholder="What are you building? What's the problem you're solving?"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500 focus:outline-none transition"
                    placeholder="https://myproject.io"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-green-500 focus:outline-none transition"
                    placeholder="https://image.url/logo.png"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Funding Goal (USDC) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    required
                    min="100"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 focus:border-green-500 focus:outline-none transition"
                    placeholder="10000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Minimum goal: 100 USDC</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Campaign Duration</label>
                <div className="grid grid-cols-3 gap-2">
                  {['7', '14', '30', '60', '90'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFormData({ ...formData, duration: d })}
                      className={`py-2 rounded-lg border transition ${
                        formData.duration === d
                          ? 'border-green-500 bg-green-500/10 text-green-400'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      {d} days
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="glass rounded-xl p-4 border border-white/10">
                <h4 className="font-semibold mb-3">Platform Fees</h4>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Posting fee</span>
                  <span>$3 USDC</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Platform fee</span>
                  <span>3% of raised amount</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Milestones */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Milestones</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Break your project into milestones. Funds release as you complete each one.
                </p>
              </div>
              
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none transition"
                      placeholder="Milestone description"
                    />
                  </div>
                  <div className="w-20 relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={milestone.percentage}
                      onChange={(e) => updateMilestone(index, 'percentage', Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:border-green-500 focus:outline-none transition text-center"
                      placeholder="%"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
                  </div>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-gray-500 hover:text-red-400 p-2 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addMilestone}
                className="text-green-400 text-sm hover:underline"
              >
                + Add milestone
              </button>
              
              <div className={`text-sm font-semibold ${totalPercentage === 100 ? 'text-green-400' : 'text-red-400'}`}>
                Total: {totalPercentage}% {totalPercentage !== 100 && '(must equal 100%)'}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 border border-white/20 text-white py-3 rounded-xl hover:bg-white/5 transition"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold py-3 rounded-xl hover:opacity-90 transition"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={totalPercentage !== 100}
                className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Campaign
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
