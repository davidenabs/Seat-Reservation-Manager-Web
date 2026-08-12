import { Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/route';

interface TicketActionButtonsProps {
    details: any;
    isGeneratingPDF: boolean;
    onDownloadPDF: () => void;
}

const TicketActionButtons = ({ details, isGeneratingPDF, onDownloadPDF }: TicketActionButtonsProps) => {
    return (
        <div className="flex flex-col gap-4 mt-8">
            {details?.paymentStatus === 'pending' && (details?.paymentLinkNGN || details?.paymentLinkUSD) && (
                <Button
                    onClick={() => window.location.href = ROUTES.PAYMENT_OPTIONS}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-full mb-2"
                >
                    Complete Payment Now
                </Button>
            )}
            <Button
                onClick={onDownloadPDF}
                disabled={isGeneratingPDF}
                className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-full"
            >
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingPDF ? 'Generating PDF...' : 'Download Summary'}
            </Button>

            {details?.bookings && details.bookings.length > 0 ? (
                details.bookings.map((b: any, idx: number) => (
                    <Button
                        key={idx}
                        onClick={() => window.open(b.calendarLink || "#", '_blank')}
                        variant="outline"
                        className="flex-1 py-3 border-gray-300 rounded-full"
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        Add {new Date(b.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} to Calendar
                    </Button>
                ))
            ) : (
                <Button
                    onClick={() => window.open(details?.calendarLink ?? "#", '_blank')}
                    variant="outline"
                    className="flex-1 py-3 border-gray-300 rounded-full"
                >
                    <Calendar className="w-4 h-4 mr-2" />
                    Add to Calendar
                </Button>
            )}
        </div>
    );
};

export default TicketActionButtons;
