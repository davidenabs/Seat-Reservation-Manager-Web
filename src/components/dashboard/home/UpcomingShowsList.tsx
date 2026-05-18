// import { ArrowRight } from 'lucide-react';
import { DateTime } from 'luxon';

interface UpcomingShowsListProps {
  nextEvents: any[];
}

export default function UpcomingShowsList({ nextEvents }: UpcomingShowsListProps) {
  return (
    <div className="space-y-3 pt-4">
      <div className="flex justify-between items-center">
        <h4 className="text-[15px] font-bold text-gray-900">Upcoming shows</h4>
        {/* <button className="text-[13px] font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1">
          View all <ArrowRight className="w-4 h-4" />
        </button> */}
      </div>

      <div className="space-y- bg-white border border-gray-100 rounded-2xl divide-y divide-gray-100">
        {nextEvents.length > 0 ? nextEvents.map((event, idx) => (
          <div key={event.id || idx} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-gray-200 transition-all group">
            <div className="flex items-center gap-4 md:gap-5 w-full sm:w-auto">
              <div className="flex flex-col items-center justify-center text-gray-400 font-bold shrink-0 rounded-lg border border-gray-100 py-2 px-3 bg-gray-100">
                <span className="text-[10px] uppercase tracking-[1px]">{DateTime.fromISO(event.date).toFormat('LLL')}</span>
                <span className="text-[20px] text-gray-900 font-fraunces leading-none">{DateTime.fromISO(event.date).toFormat('dd')}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] md:text-[15px] font-bold text-gray-900 mb-0.5 group-hover:text-[#E8593C] transition-colors truncate">{event.title}</p>
                <p className="text-[11px] md:text-[12px] text-gray-500 font-medium truncate">
                  {DateTime.fromISO(`${event.date.split('T')[0]}T${event.time}:00`).toFormat('ccc · h:mm a')} WAT · {event.availableSeats || 0} seats
                </p>
              </div>
            </div>
            <span className="bg-green-50 text-[#5DCAA5] text-[10px] md:text-[11px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2 shrink-0">
              <span className="w-1.5 h-1.5 bg-[#5DCAA5] rounded-full"></span>
              Registered
            </span>
          </div>
        )) : (
          <>
            <div className="bg-white border border-gray-50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-50">
              <div className="flex items-center gap-4 md:gap-5 w-full sm:w-auto">
                <div className="flex flex-col items-center justify-center text-gray-300 font-bold shrink-0">
                  <span className="text-[10px] uppercase tracking-[1px]">MAY</span>
                  <span className="text-[20px] font-fraunces leading-none">13</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] md:text-[15px] font-bold text-gray-900 mb-0.5 truncate">Money & the modern woman</p>
                  <p className="text-[11px] md:text-[12px] text-gray-400 font-medium truncate">Wed · 8:00 PM WAT · Tara Fela-D.</p>
                </div>
              </div>
              <span className="bg-gray-50 text-gray-400 text-[10px] md:text-[11px] font-bold px-4 py-1.5 rounded-full shrink-0">
                Auto-register
              </span>
            </div>
            <div className="bg-white border border-gray-50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-50">
              <div className="flex items-center gap-4 md:gap-5 w-full sm:w-auto">
                <div className="flex flex-col items-center justify-center text-gray-300 font-bold shrink-0">
                  <span className="text-[10px] uppercase tracking-[1px]">MAY</span>
                  <span className="text-[20px] font-fraunces leading-none">20</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] md:text-[15px] font-bold text-gray-900 mb-0.5 truncate">When ambition meets motherhood</p>
                  <p className="text-[11px] md:text-[12px] text-gray-400 font-medium truncate">Wed · 8:00 PM WAT · panel of 4</p>
                </div>
              </div>
              <span className="bg-gray-50 text-gray-400 text-[10px] md:text-[11px] font-bold px-4 py-1.5 rounded-full shrink-0">
                Auto-register
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
