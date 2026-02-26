'use client';

interface Milestone {
  description: string;
  percentage: number;
  completed: boolean;
}

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
  milestones: Milestone[];
}

export function FundCard({ campaign }: { campaign: Campaign }) {
  const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
  const daysLeft = Math.max(0, Math.ceil((campaign.deadline - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-claw-gray rounded-xl overflow-hidden border border-gray-800 hover:border-claw-green/50 transition">
      {/* Image */}
      <div className="h-40 bg-gradient-to-br from-claw-gray to-claw-dark relative">
        <img 
          src={campaign.imageUrl} 
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        {campaign.raised >= campaign.goal && (
          <span className="absolute top-3 right-3 bg-claw-green text-black text-xs font-bold px-2 py-1 rounded">
            FUNDED
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h4 className="font-bold text-lg mb-2 truncate">{campaign.title}</h4>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{campaign.description}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-claw-green">${campaign.raised.toLocaleString()}</span>
            <span className="text-gray-400">of ${campaign.goal.toLocaleString()} USDC</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-claw-green to-cyan-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="flex justify-between text-sm text-gray-400 mb-4">
          <span>{Math.floor(progress)}% funded</span>
          <span>{daysLeft} days left</span>
        </div>

        {/* Milestones Preview */}
        <div className="space-y-2 mb-4">
          {campaign.milestones.slice(0, 2).map((m, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className={m.completed ? 'text-claw-green' : 'text-gray-500'}>
                {m.completed ? '✓' : '○'}
              </span>
              <span className={m.completed ? 'text-gray-300' : 'text-gray-500'}>
                {m.description} ({m.percentage / 100}%)
              </span>
            </div>
          ))}
          {campaign.milestones.length > 2 && (
            <span className="text-xs text-gray-500">
              +{campaign.milestones.length - 2} more milestones
            </span>
          )}
        </div>

        {/* Fund Button */}
        <a
          href={campaign.website}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-claw-green text-black font-bold py-2 rounded-lg hover:opacity-90 transition"
        >
          View Project
        </a>
      </div>
    </div>
  );
}
