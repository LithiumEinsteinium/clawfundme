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
    <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
      {/* Image - Full Width */}
      <div className="relative h-48 md:h-64 w-full">
        <img 
          src={campaign.imageUrl} 
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        {isFunded && (
          <span className="absolute top-4 right-4 bg-green-500 text-black text-sm font-bold px-4 py-1 rounded-full">
            ✅ Funded
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl md:text-2xl font-bold mb-2">{campaign.title}</h3>
        <p className="text-gray-400 mb-4">{campaign.description}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-400 font-semibold">${campaign.raised.toLocaleString()} raised</span>
            <span className="text-gray-400">of ${campaign.goal.toLocaleString()} USDC</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>{Math.floor(progress)}% funded</span>
            <span>{daysLeft} days left</span>
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Milestones</h4>
          <div className="space-y-2">
            {campaign.milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className={m.completed ? 'text-green-400' : 'text-gray-500'}>
                  {m.completed ? '✓' : '○'}
                </span>
                <span className={m.completed ? 'text-gray-300' : 'text-gray-500'}>
                  {m.description}
                </span>
                <span className="ml-auto text-gray-500">{m.percentage / 100}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <a
            href={campaign.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition"
          >
            View
          </a>
          <button className="flex-1 bg-green-500 hover:bg-green-400 text-black font-semibold py-3 rounded-xl transition">
            Fund
          </button>
        </div>
      </div>
    </div>
  );
}
