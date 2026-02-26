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
    // TODO: Call smart contract
    console.log('Creating campaign:', { ...formData, milestones });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-claw-gray rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-xl font-bold">Start a Campaign</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 pt-4">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded ${step >= s ? 'bg-claw-green' : 'bg-gray-700'}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Step {step} of 3: {step === 1 ? 'Project Details' : step === 2 ? 'Funding Goal' : 'Milestones'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-claw-dark border border-gray-700 rounded-lg px-4 py-2 focus:border-claw-green focus:outline-none"
                  placeholder="My Awesome AI Project"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-claw-dark border border-gray-700 rounded-lg px-4 py-2 focus:border-claw-green focus:outline-none"
                  placeholder="What are you building?"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-claw-dark border border-gray-700 rounded-lg px-4 py-2 focus:border-claw-green focus:outline-none"
                  placeholder="https://myproject.io"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-claw-dark border border-gray-700 rounded-lg px-4 py-2 focus:border-claw-green focus:outline-none"
                  placeholder="https://image.url/logo.png"
                />
              </div>
            </div>
          )}

          {/* Step 2: Goal */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Funding Goal (USDC) *</label>
                <input
                  type="number"
                  required
                  min="100"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full bg-claw-dark border border-gray-700 rounded-lg px-4 py-2 focus:border-claw-green focus:outline-none"
                  placeholder="10000"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum goal: 100 USDC</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Campaign Duration</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-claw-dark border border-gray-700 rounded-lg px-4 py-2 focus:border-claw-green focus:outline-none"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
              
              <div className="bg-claw-dark p-4 rounded-lg">
                <h4 className="font-bold mb-2">Fees</h4>
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
              <p className="text-sm text-gray-400">
                Break your project into milestones. Funds will be released as you complete each one.
              </p>
              
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      className="w-full bg-claw-dark border border-gray-700 rounded-lg px-4 py-2 focus:border-claw-green focus:outline-none"
                      placeholder="Milestone description"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={milestone.percentage}
                      onChange={(e) => updateMilestone(index, 'percentage', Number(e.target.value))}
                      className="w-full bg-claw-dark border border-gray-700 rounded-lg px-4 py-2 focus:border-claw-green focus:outline-none"
                      placeholder="%"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="text-gray-500 hover:text-red-400 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addMilestone}
                className="text-claw-green text-sm hover:underline"
              >
                + Add milestone
              </button>
              
              <div className={`text-sm ${totalPercentage === 100 ? 'text-claw-green' : 'text-red-400'}`}>
                Total: {totalPercentage}% {totalPercentage !== 100 && '(must equal 100%)'}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-claw-green text-black font-bold py-3 rounded-lg hover:opacity-90 transition"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={totalPercentage !== 100}
                className="flex-1 bg-claw-green text-black font-bold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
