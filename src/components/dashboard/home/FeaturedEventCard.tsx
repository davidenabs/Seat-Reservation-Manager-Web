import { ArrowRight } from 'lucide-react';

interface FeaturedEventCardProps {
  currentEvent: any;
  timeLeft: string;
  subscription: any;
  formatEventTimeLong: (event: any) => string;
  onEnter: () => void;
}

export default function FeaturedEventCard({ 
  currentEvent, 
  timeLeft, 
  subscription, 
  formatEventTimeLong, 
  onEnter 
}: FeaturedEventCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-[24px] md:rounded-[32px] p-6 md:p-10 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
        <div className="bg-gray-900 text-white px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold tracking-[1px] md:tracking-[1.5px] inline-flex items-center gap-2 uppercase">
          <span className="w-1.5 h-1.5 bg-[#E8593C] rounded-full animate-pulse"></span>
          Next Live
        </div>
        <div className="text-right">
          <p className="text-[10px] md:text-[11px] text-gray-400 font-bold uppercase tracking-[0.5px]">Starts in</p>
          <p className="font-fraunces text-[24px] md:text-[32px] leading-tight tracking-[-1px] text-gray-900">{timeLeft || 'TBA'}</p>
        </div>
      </div>

      <div className="mb-8 md:mb-10 relative z-10">
        <h3 className="font-fraunces text-[22px] md:text-[28px] font-normal mb-2 text-gray-900 tracking-[-0.5px]">
          {currentEvent ? currentEvent.title : "Episode 47 — The art of saying no"}
        </h3>
        <p className="text-[13px] md:text-[14px] text-gray-500 font-medium">
          {formatEventTimeLong(currentEvent)} {currentEvent?.guest ? `· with ${currentEvent.guest}` : '· with Special Guest'}
        </p>
      </div>

      <div className="bg-[#F8F8F6] border border-gray-100 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 group/link transition-all hover:bg-gray-50">
        <div className="w-full flex-1 min-w-0 text-center md:text-left">
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[1.2px] mb-2">Your Personal Join Link</p>
          <p className="font-mono text-[12px] md:text-[13px] text-gray-500 truncate blur-sm hover:blur transition-all duration-300 cursor-help select-none">
            {subscription?.zoomJoinUrl || "zoom.us/w/84729164827tk=a8X......"}
          </p>
        </div>
        <div className="flex gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={onEnter}
            className={`w-full md:w-auto px-8 py-3 md:py-2.5 rounded-xl text-white text-[13px] font-bold  transition-all flex items-center justify-center gap-2 cursor-pointer ${!currentEvent ? 'bg-gray-400' : 'bg-gray-900 hover:bg-black'}`}
            disabled={!currentEvent}
          >
            Enter <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtle Decorative Circle */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#E8593C]/[0.02] rounded-full group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
    </div>
  );
}
