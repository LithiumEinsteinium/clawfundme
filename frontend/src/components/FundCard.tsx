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
    <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 w-full max-w-md mx-auto">
      {/* Image - Smaller */}
      <div className="relative h-40 w-full">
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
      </div>

      {/* Content - Centered */}
      <div className="p-5 text-center">
        <h3 className="text-lg font-bold mb-2">{campaign.title}</h3>
        <p className="text-gray-400 text-sm mb-4">{campaign.description}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-400 font-semibold">${campaign.raised.toLocaleString()}</span>
            <span className="text-gray-400">of ${campaign.goal.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{Math.floor(progress)}%</span>
            <span>{daysLeft} days</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={campaign.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg text-sm transition"
          >
            View
          </a>
          <button className="flex-1 bg-green-500 hover:bg-green-400 text-black font-medium py-2 rounded-lg text-sm">
            Fund
          </button>
        </div>
      </div>
    </div>
  );
}
