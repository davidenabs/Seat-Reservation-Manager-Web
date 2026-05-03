import { Video, Book, MessageSquare, Heart, ChevronRight } from 'lucide-react';
import { ResourceCard, ReplayItem } from '../components/dashboard/resources/ResourceComponents';

export default function Resources() {
  const resourceCategories = [
    {
      title: 'Episode Replays',
      description: 'Catch up on every episode you missed or want to revisit.',
      icon: <Video className="w-7 h-7 text-gray-900" />,
      stats: '46 episodes',
      badge: 'Members only'
    },
    {
      title: 'Reading List',
      description: 'Books and articles recommended by Morayo and her guests.',
      icon: <Book className="w-7 h-7 text-gray-900" />,
      stats: '23 items',
      badge: 'Updated monthly'
    },
    {
      title: 'Q&A Archive',
      description: 'Member questions and answers from every live session.',
      icon: <MessageSquare className="w-7 h-7 text-gray-900" />,
      stats: '180 Q&As',
      badge: 'Searchable'
    },
    {
      title: 'Community',
      description: 'Connect with fellow audience members between episodes.',
      icon: <Heart className="w-7 h-7 text-gray-900" />,
      stats: '2,100+ members',
      badge: 'Active now'
    }
  ];

  const recentReplays = [
    {
      title: 'Ep 46 — Reinventing at 40',
      date: 'Apr 29',
      guest: 'with Dr. Ngozi A.',
      duration: '54 min'
    },
    {
      title: 'Ep 45 — The power of slow',
      date: 'Apr 22',
      guest: 'with Lemi Ghariokwu',
      duration: '48 min'
    },
    {
      title: 'Ep 44 — Raising girlbosses',
      date: 'Apr 15',
      guest: 'panel of 3',
      duration: '61 min'
    }
  ];

  return (
    <div className="p-4 md:p-8 flex-1 overflow-y-auto  blur-sm ">
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-900">Resources</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {resourceCategories.map((cat, i) => (
          <ResourceCard key={i} {...cat} />
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-gray-900">Recent replays</h3>
          <button className="text-[13px] font-bold text-gray-400 hover:text-black flex items-center gap-1 transition-colors">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 flex flex-col gap-1">
          {recentReplays.map((replay, i) => (
            <ReplayItem key={i} {...replay} />
          ))}
        </div>
      </div>
    </div>
  );
}
