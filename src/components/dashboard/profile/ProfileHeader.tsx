import { Sparkles } from 'lucide-react';
import { getGravatarUrl } from '../../../utils/user';

interface ProfileHeaderProps {
  user: any;
  subscription: any;
}

export default function ProfileHeader({ user, subscription }: ProfileHeaderProps) {
  const gravatarUrl = getGravatarUrl(user?.email);

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-10 mb-8 flex flex-col md:flex-row items-center gap-8">
      <div className="relative group">
        <div className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
          <img src={gravatarUrl} alt={user?.name} className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="text-center md:text-left">
        <h2 className="font-fraunces text-base md:text-xl font-normal text-gray-900 mb-1 leading-tight tracking-[-1px]">
          {user?.name || 'Member Name'}
        </h2>
        <p className="text-gray-400 font-medium text-[14px] mb-4">{user?.email}</p>

        <div className="inline-flex items-center gap-2 bg-[#F8F8F6] border border-gray-100 px-4 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-[#E8593C]" />
          <span className="text-[11px] font-bold text-gray-600 uppercase tracking-[1px]">
            {subscription?.tier?.split('_')[0] || 'Free'} member · Season 4
          </span>
        </div>
      </div>
    </div>
  );
}
