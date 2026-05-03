import React from 'react';

interface ResourceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  stats: string;
  badge?: string;
}

export function ResourceCard({ title, description, icon, stats, badge }: ResourceCardProps) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 hover:shadow-xl hover:shadow-black/5 transition-all group cursor-pointer">
      <div className="w-14 h-14 bg-[#F8F8F6] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-[20px] font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-[15px] font-medium leading-relaxed mb-6">{description}</p>
      
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
          {stats}
        </span>
        {badge && (
          <span className="text-[12px] font-bold text-gray-400 border border-gray-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

interface ReplayItemProps {
  title: string;
  date: string;
  duration: string;
  guest?: string;
}

export function ReplayItem({ title, date, duration, guest }: ReplayItemProps) {
  return (
    <div className="flex items-center justify-between py-4 px-6 hover:bg-[#F8F8F6] transition-colors group cursor-pointer rounded-2xl">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div>
          <h4 className="text-[16px] font-bold text-gray-900 mb-1">{title}</h4>
          <p className="text-[13px] text-gray-400 font-medium">
            {date} {guest && <span className="mx-1.5">•</span>} {guest}
          </p>
        </div>
      </div>
      <span className="text-[13px] font-bold text-gray-400">{duration}</span>
    </div>
  );
}
