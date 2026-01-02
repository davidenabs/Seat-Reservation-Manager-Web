import { Check, Download, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Logo from "@/assets/tmas-logo-black.png";
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@/config/route';
import { formatDate } from '@/utils/formatDate';
import type { IOTPVerificationResponse } from '@/intefaces/verification';

const defaultData = {
    // session: "The Nigerian Family Space",
    // time: "4:00 PM - 6:00 PM",
    // location: "Conference Hall A",
    audienceBreakfast: "9AM",
    briefing: "10AM",
    liveShow: "11AM",
}

// For PDF generation - these would normally be imported from npm packages
declare global {
    interface Window {
        html2canvas: any;
        jsPDF: any;
    }
}

const BookingTicket = () => {

    const navigate = useNavigate();
    const [bookingDetails, setBookingDetails] = useState<IOTPVerificationResponse | null>(null);
    const ticketRef = useRef<HTMLDivElement>(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // Check if tempId exists and email is stored
    useEffect(() => {
        // Get booking details from localStorage or sessionStorage
        const bookingDetailsString = localStorage.getItem("booking_details") || sessionStorage.getItem("booking_details");

        if (bookingDetailsString) {
            try {
                // Parse the JSON string into an OTPVerificationResponse object
                const parsedDetails = JSON.parse(bookingDetailsString) as IOTPVerificationResponse;
                setBookingDetails(parsedDetails);
            } catch (error) {
                console.error("Failed to parse booking details:", error);
                toast.error("Invalid booking data found.");
                navigate(ROUTES.HOME);
            }
        } else {
            toast.error("No booking found to process.");
            navigate(ROUTES.HOME);
        }
    }, [navigate]);

    // Load external libraries for PDF generation
    useEffect(() => {
        const loadLibraries = async () => {
            // Load html2canvas
            if (!window.html2canvas) {
                const html2canvasScript = document.createElement('script');
                html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                document.head.appendChild(html2canvasScript);

                await new Promise((resolve) => {
                    html2canvasScript.onload = resolve;
                });
            }

            // Load jsPDF
            if (!window.jsPDF) {
                const jsPDFScript = document.createElement('script');
                jsPDFScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                document.head.appendChild(jsPDFScript);

                await new Promise((resolve) => {
                    jsPDFScript.onload = resolve;
                });
            }
        };

        loadLibraries();
    }, []);

    const handleDownloadPDFTicket = async () => {
        if (!ticketRef.current || !window.html2canvas || !window.jsPDF) {
            toast.error("PDF libraries are still loading. Please try again in a moment.");
            return;
        }

        setIsGeneratingPDF(true);
        toast.info("Generating your ticket PDF...");

        try {
            // Create a clone of the ticket element for PDF generation
            const ticketElement = ticketRef.current;
            const originalStyle = ticketElement.style.cssText;

            // Temporarily modify styles for better PDF output
            ticketElement.style.background = 'white';
            ticketElement.style.padding = '40px';
            ticketElement.style.minHeight = 'auto';

            // Generate canvas from the ticket element
            const canvas = await window.html2canvas(ticketElement, {
                scale: 2, // Higher resolution
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#ffffff',
                width: ticketElement.scrollWidth,
                height: ticketElement.scrollHeight,
                onclone: (clonedDoc: any) => {
                    // Ensure all images are loaded in the cloned document
                    const clonedElement = clonedDoc.querySelector('[data-ticket-ref]');
                    if (clonedElement) {
                        clonedElement.style.background = 'white';
                        clonedElement.style.padding = '40px';
                    }
                }
            });

            // Restore original styles
            ticketElement.style.cssText = originalStyle;

            // Create PDF
            const { jsPDF } = window.jsPDF;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Calculate dimensions to fit A4
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            // Calculate scaling to fit A4 with margins
            const maxWidth = pageWidth - 20; // 10mm margin on each side
            const maxHeight = pageHeight - 20; // 10mm margin on top and bottom

            const widthRatio = maxWidth / (canvasWidth * 0.264583); // Convert pixels to mm
            const heightRatio = maxHeight / (canvasHeight * 0.264583);
            const ratio = Math.min(widthRatio, heightRatio);

            const imgWidth = (canvasWidth * 0.264583) * ratio;
            const imgHeight = (canvasHeight * 0.264583) * ratio;

            // Center the image on the page
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            // Add image to PDF
            pdf.addImage(
                canvas.toDataURL('image/png'),
                'PNG',
                x,
                y,
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
            );

            // Generate filename
            const filename = `booking-ticket-${bookingDetails?.ticketId?.replace('#', '') || 'ticket'}.pdf`;

            // Download PDF
            pdf.save(filename);

            toast.success("Ticket PDF downloaded successfully!");
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleAddToCalendar = () => {
        window.open(bookingDetails?.calendarLink ?? "#", '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 flex items-center justify-center p-4">
            <div ref={ticketRef} data-ticket-ref className="w-full max-w-7xl">
                <Card className="w-full max-w-7xl border-0 border-t-3 border-t-green-500 shadow-none">
                    {/* Header with Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center mb-6">
                            <Link to={'https://themorayoshow.com'}><img src={Logo} alt="TMAS Logo" className="w-36 sm:w-[145.131591796875px]" /></Link>
                        </div>


                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl  self-center">
                        {/* Left Column - Session Summary */}
                        <div className="lg:col-span-2">

                            <Card className=" border-0 border-t-3 border-t-green-500 shadow-none 0">
                                <CardHeader className='text-center'>
                                    {/* Success Animation */}
                                    <div className="mb-6">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 animate-pulse">
                                            <Check className="w-8 h-8 text-white" />
                                        </div>
                                        <h1 className="text-xl font-bold text-gray-800 mb-">Booking Successful!</h1>
                                        <p className="text-gray-600 text-sm">Your seat has been reserved successfully</p>
                                    </div>
                                </CardHeader>
                                <CardContent >
                                    <div className="px-6 py-8 border rounded-xl">
                                        <h2 className="text-xl font-bold text-gray-800 mb-6">Session Summary</h2>

                                        <div className="space-y-2">
                                            {/* <div className="flex justify-between items-center py-1 border-gray-100">
                                                <span className="text-gray-600 font-medium">Session</span>
                                                <span className="text-gray-600">{defaultData.session}</span>
                                            </div> */}

                                            <div className="flex justify-between items-center py-1 border-gray-100">
                                                <span className="text-gray-600 font-medium">Date</span>
                                                <span className="text-gray-600">{bookingDetails?.eventDate ? formatDate(bookingDetails.eventDate) : '—'}</span>
                                            </div>

                                            <div className="flex justify-between items-center py-1 border-gray-100">
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

                                            {/* <div className="flex justify-between items-center py-1 border-gray-100">
                                                <span className="text-gray-600 font-medium">Status</span>
                                                <span className="text-gray-600">{bookingDetails?.status ? capitalizeFirstWord(bookingDetails.status) : '—'}</span>
                                            </div> */}

                                            <div className="flex justify-between items-center py-1 border-gray-100">
                                                <span className="text-gray-600 font-medium">Seat</span>
                                                <Badge variant="secondary" className="bg-transparent text-gray-600 font-bold">
                                                    {bookingDetails?.seatLabels.map(s => s).join(', ')}
                                                </Badge>
                                            </div>

                                            {/* <div className="flex justify-between items-center py-1 border-gray-100">
                                                <span className="text-gray-600 font-medium">Location</span>
                                                <span className="text-gray-600">{defaultData.location}</span>
                                            </div> */}

                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-gray-600 font-medium">Booking ID</span>
                                                <code className="text-gray-600 rounded">
                                                    {bookingDetails?.ticketId}
                                                </code>
                                            </div>
                                        </div>

                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-4 mt-8">
                                        <Button
                                            onClick={handleDownloadPDFTicket}
                                            disabled={isGeneratingPDF}
                                            className="flex-1 bg-black hover:bg-gray-800 text-white py-3 rounded-full"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            {isGeneratingPDF ? 'Generating PDF...' : 'Download Summary'}
                                        </Button>

                                        <Button
                                            onClick={handleAddToCalendar}
                                            variant="outline"
                                            className="flex-1 py-3 border-gray-300 rounded-full"
                                        >
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Add to Calendar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - QR Code and Information */}
                        <div className="space-y-6">
                            {/* QR Code */}
                            <Card className="shadow-none  border-">
                                <CardContent className="p-6 rounded-lg  text-center flex justify-center">
                                    <div className=" rounded-xl flex items-center justify-center">
                                        <img src={bookingDetails?.qrCode} className='w-[212px] h-[212px]' alt="" />
                                    </div>

                                </CardContent>
                            </Card>

                            {/* Important Information */}
                            <Card className="shadow-none border0 bg-[#F18547] border-[#FFD6BE]">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <Info fill='#000000' stroke='white' className="w-4 h-4 text-[#000000] mr-2" />
                                        <h3 className="font-medium text-[#000000]">Important Information</h3>
                                    </div>

                                    <ul className="space-y-3 text-sm text-[#1D4ED8]">
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#1D4ED8] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            Please arrive 30 minutes before the session starts
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#1D4ED8] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            Bring a valid ID for verification
                                        </li>
                                        <li className="flex items-start font-bold">
                                            <span className="w-1.5 h-1.5 bg-[#1D4ED8] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                           Dress Code: Elegant
                                        </li>
                                        <li className="flex items-start">
                                            <span className="w-1.5 h-1.5 bg-[#1D4ED8] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <span>
                                                Contact support at{' '}
                                                <a
                                                    href="mailto:info@mabstudios.org"
                                                    className="text-blue-800 hover:underline font-medium"
                                                >
                                                    info@mabstudios.org
                                                </a>
                                                {' '}or call{' '}
                                                <a
                                                    href="tel:09048331499"
                                                    className="text-blue-800 hover:underline font-medium"
                                                >
                                                    09048331499
                                                </a>
                                                {' '}for any queries
                                            </span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8">
                        <p className="text-gray-500 text-sm">
                            Thank you for booking with us! We look forward to seeing you at the event.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default BookingTicket;