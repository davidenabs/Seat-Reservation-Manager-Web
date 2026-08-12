import { Card, CardContent } from '@/components/ui/card';

interface TicketQRCodeProps {
    qrCodeUrl?: string;
}

const TicketQRCode = ({ qrCodeUrl }: TicketQRCodeProps) => {
    return (
        <Card className="shadow-none border-">
            <CardContent className="p-6 rounded-lg text-center flex justify-center">
                <div className="rounded-xl flex items-center justify-center">
                    <img src={qrCodeUrl} className="w-[212px] h-[212px]" alt="Ticket QR Code" />
                </div>
            </CardContent>
        </Card>
    );
};

export default TicketQRCode;
