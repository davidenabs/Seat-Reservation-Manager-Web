import { Clock, Check } from 'lucide-react';
import { CardHeader } from '@/components/ui/card';

interface TicketStatusHeaderProps {
    status?: string;
    paymentStatus?: string;
}

const TicketStatusHeader = ({ status, paymentStatus }: TicketStatusHeaderProps) => {
    const isPending = status === 'waitlisted' || paymentStatus === 'pending';
    
    return (
        <CardHeader className="text-center">
            {/* Success/Waitlist Animation */}
            <div className="mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 animate-pulse ${isPending ? 'bg-amber-500' : 'bg-green-500'}`}>
                    {isPending ? <Clock className="w-8 h-8 text-white" /> : <Check className="w-8 h-8 text-white" />}
                </div>
                <h1 className="text-xl font-bold text-gray-800 mb-">
                    {status === 'waitlisted' ? "You're on the Waiting List!" : paymentStatus === 'pending' ? "Payment Required!" : "Booking Successful!"}
                </h1>
                <p className="text-gray-600 text-sm">
                    {status === 'waitlisted' 
                        ? "The general allocation is currently full. We'll notify you if a seat becomes available."
                        : paymentStatus === 'pending' ? "Your seat has been reserved but payment is required. Please complete your payment." : "Your seat has been reserved successfully"}
                </p>
            </div>
        </CardHeader>
    );
};

export default TicketStatusHeader;
