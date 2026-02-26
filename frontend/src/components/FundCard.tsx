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
  const isFunded = campaign.raised >= campaign.goal;

  return (
    <div className="glass rounded-2xl overflow-hidden card-hover border border-white/5">
      {/* Image */}
      <div className="h-48 relative overflow-hidden">
        <img 
          src={campaign.imageUrl} 
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {isFunded && (
          <span className="absolute top-3 right-3 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
            ✅ Funded
          </span>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
            {campaign.milestones.length} milestones
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-bold text-lg leading-tight">{campaign.title}</h4>
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{campaign.description}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-400 font-semibold">${campaign.raised.toLocaleString()}</span>
            <span className="text-gray-500">of ${campaign.goal.toLocaleString()} USDC</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="flex justify-between text-sm text-gray-400 mb-4">
          <span>{Math.floor(progress)}% funded</span>
          <span className={daysLeft < 7 ? 'text-orange-400' : ''}>{daysLeft} days left</span>
        </div>

        {/* Creator */}
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
          <span>by</span>
          <span className="font-mono bg-white/5 px-2 py-0.5 rounded">{campaign.creator}</span>
        </div>

        {/* Action */}
        <div className="flex gap-2">
          <a
            href={campaign.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 rounded-lg transition"
          >
            View Project
          </a>
          <button
            className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Fund Now
          </button>
        </div>
      </div>
    </div>
  );
}
