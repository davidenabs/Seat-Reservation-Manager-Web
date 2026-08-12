import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatDate';

const capitalizeFirstWord = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const defaultData = {
    audienceBreakfast: "9AM",
    briefing: "10AM",
    liveShow: "11AM",
};

interface TicketSessionSummaryProps {
    details: any;
}

const TicketSessionSummary = ({ details }: TicketSessionSummaryProps) => {
    return (
        <div className="px-6 py-8 border rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Session Summary</h2>

            <div className="space-y-4">
                {/* For multiple bookings, show a summary of dates and seats */}
                {(() => {
                    return details?.bookings ? (
                        <>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-4">
                                <h3 className="font-semibold text-gray-800 mb-2 border-b pb-2">Multi-Day Reservations</h3>
                                {details.bookings.map((b: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <div className="text-sm font-medium text-gray-800">{b.eventDate ? formatDate(b.eventDate) : '—'}</div>
                                            <div className="text-xs text-gray-500">Ticket: {b.ticketId}</div>
                                        </div>
                                        <Badge variant="secondary" className="bg-transparent text-[#FD690C] font-bold border border-[#FD690C]/30">
                                            Seat: {b.seatLabels?.join(', ')}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-between items-center py-1 border-gray-100">
                                <span className="text-gray-600 font-medium">Date</span>
                                <span className="text-gray-600">{details?.eventDate ? formatDate(details.eventDate) : '—'}</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-gray-100">
                                <span className="text-gray-600 font-medium">Seat</span>
                                <Badge variant="secondary" className="bg-transparent text-gray-600 font-bold">
                                    {details?.seatLabels?.join(', ')}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-gray-600 font-medium">Booking ID</span>
                                <code className="text-gray-600 rounded">
                                    {details?.ticketId}
                                </code>
                            </div>
                        </>
                    )
                })()}

                <div className="flex justify-between items-center py-1 border-gray-100 border-t pt-4">
                    <span className="text-gray-600 font-medium">Audience Breakfast</span>
                    <span className="text-gray-600">{defaultData.audienceBreakfast}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-gray-100">
                    <span className="text-gray-600 font-medium">Briefing</span>
                    <span className="text-gray-600">{defaultData.briefing}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-gray-100">
                    <span className="text-gray-600 font-medium">Live Show</span>
                    <span className="text-gray-600">{defaultData.liveShow}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-gray-100">
                    <span className="text-gray-600 font-medium">Status</span>
                    <Badge variant="secondary" className={`font-bold ${details?.status === 'waitlisted' || details?.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                        {details?.paymentStatus === 'pending' ? 'Pending Payment' : capitalizeFirstWord(details?.status || 'confirmed')}
                    </Badge>
                </div>
            </div>
        </div>
    );
};

export default TicketSessionSummary;
