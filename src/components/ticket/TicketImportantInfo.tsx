import { Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const TicketImportantInfo = () => {
    return (
        <Card className="shadow-none border0 bg-[#F18547] border-[#FFD6BE]">
            <CardContent className="p-6">
                <div className="flex items-center mb-4">
                    <Info fill='#000000' stroke='white' className="w-4 h-4 text-[#000000] mr-2" />
                    <h3 className="font-medium text-[#000000]">Important Information</h3>
                </div>

                <ul className="space-y-3 text-sm text-[#000000]">
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-[#000000] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Arrival time 8AM
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-[#000000] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Please arrive 30 minutes before the session starts
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-[#000000] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Bring a valid ID for verification
                    </li>
                    <li className="flex items-start font-bold">
                        <span className="w-1.5 h-1.5 bg-[#000000] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                       Dress Code: Elegant
                    </li>
                    <li className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-[#000000] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>
                            Contact support at{' '}
                            <a
                                href="mailto:info@mabstudios.org"
                                className="text-[#000000] hover:underline font-medium"
                            >
                                info@mabstudios.org
                            </a>
                            {' '}or call{' '}
                            <a
                                href="tel:09048331499"
                                className="text-[#000000] hover:underline font-medium"
                            >
                                09048331499
                            </a>
                            {' '}for any queries
                        </span>
                    </li>
                </ul>
            </CardContent>
        </Card>
    );
};

export default TicketImportantInfo;
