import { Card } from '@/components/ui/card';
import Logo from "@/assets/tmas-logo-black.png";
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@/config/route';
import type { IOTPVerificationResponse } from '../intefaces/verification';
import TicketStatusHeader from '../components/ticket/TicketStatusHeader';
import TicketSessionSummary from '../components/ticket/TicketSessionSummary';
import TicketActionButtons from '../components/ticket/TicketActionButtons';
import TicketQRCode from '../components/ticket/TicketQRCode';
import TicketImportantInfo from '../components/ticket/TicketImportantInfo';

// For PDF generation - these would normally be imported from npm packages
declare global {
    interface Window {
        html2canvas: any;
        jsPDF: any;
    }
}

const BookingTicket = () => {
    const navigate = useNavigate();
    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const ticketRef = useRef<HTMLDivElement>(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // Check if tempId exists and email is stored
    useEffect(() => {
        const bookingDetailsString = localStorage.getItem("booking_details") || sessionStorage.getItem("booking_details");

        if (bookingDetailsString) {
            try {
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
            if (!window.html2canvas) {
                const html2canvasScript = document.createElement('script');
                html2canvasScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                document.head.appendChild(html2canvasScript);

                await new Promise((resolve) => {
                    html2canvasScript.onload = resolve;
                });
            }

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

    const details = bookingDetails?.data || bookingDetails;

    const handleDownloadPDFTicket = async () => {
        if (!ticketRef.current || !window.html2canvas || !window.jsPDF) {
            toast.error("PDF libraries are still loading. Please try again in a moment.");
            return;
        }

        setIsGeneratingPDF(true);
        toast.info("Generating your ticket PDF...");

        try {
            const ticketElement = ticketRef.current;
            const originalStyle = ticketElement.style.cssText;

            ticketElement.style.background = 'white';
            ticketElement.style.padding = '40px';
            ticketElement.style.minHeight = 'auto';

            const canvas = await window.html2canvas(ticketElement, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                backgroundColor: '#ffffff',
                width: ticketElement.scrollWidth,
                height: ticketElement.scrollHeight,
                onclone: (clonedDoc: any) => {
                    const clonedElement = clonedDoc.querySelector('[data-ticket-ref]');
                    if (clonedElement) {
                        clonedElement.style.background = 'white';
                        clonedElement.style.padding = '40px';
                    }
                }
            });

            ticketElement.style.cssText = originalStyle;

            const { jsPDF } = window.jsPDF;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            const maxWidth = pageWidth - 20;
            const maxHeight = pageHeight - 20;

            const widthRatio = maxWidth / (canvasWidth * 0.264583);
            const heightRatio = maxHeight / (canvasHeight * 0.264583);
            const ratio = Math.min(widthRatio, heightRatio);

            const imgWidth = (canvasWidth * 0.264583) * ratio;
            const imgHeight = (canvasHeight * 0.264583) * ratio;

            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;

            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');
            
            const filename = `booking-ticket-${details?.ticketId?.replace('#', '') || 'ticket'}.pdf`;
            pdf.save(filename);

            toast.success("Ticket PDF downloaded successfully!");
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 flex items-center justify-center p-4">
            <div ref={ticketRef} data-ticket-ref className="w-full max-w-7xl">
                <Card className={`w-full max-w-7xl border-0 border-t-3 shadow-none ${details?.status === 'waitlisted' || details?.paymentStatus === 'pending' ? 'border-t-amber-500' : 'border-t-green-500'}`}>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center mb-6">
                            <Link to={'https://themorayoshow.com'}>
                                <img src={Logo} alt="TMAS Logo" className="w-36 sm:w-[145.131591796875px]" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl self-center">
                        <div className="lg:col-span-2">
                            <Card className={`border-0 border-t-3 shadow-none ${details?.status === 'waitlisted' || details?.paymentStatus === 'pending' ? 'border-t-amber-500' : 'border-t-green-500'}`}>
                                <TicketStatusHeader status={details?.status} paymentStatus={details?.paymentStatus} />
                                
                                <div className="p-6">
                                    <TicketSessionSummary details={details} />
                                    <TicketActionButtons 
                                        details={details} 
                                        isGeneratingPDF={isGeneratingPDF} 
                                        onDownloadPDF={handleDownloadPDFTicket} 
                                    />
                                </div>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <TicketQRCode qrCodeUrl={details?.qrCode} />
                            <TicketImportantInfo />
                        </div>
                    </div>

                    <div className="text-center mt-8 pb-8">
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