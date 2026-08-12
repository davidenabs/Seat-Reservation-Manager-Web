import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/route";
import VirtualNavbar from "@/components/VirtualNavbar";

export default function PaymentOptions() {
  const navigate = useNavigate();

  const [paymentLinkNGN, setPaymentLinkNGN] = useState<string | null>(null);
  const [paymentLinkUSD, setPaymentLinkUSD] = useState<string | null>(null);
  const [priceNGN, setPriceNGN] = useState<number | null>(null);
  const [priceUSD, setPriceUSD] = useState<number | null>(null);

  useEffect(() => {
    // Read booking details from storage
    const bookingDetailsStr = localStorage.getItem("booking_details") || sessionStorage.getItem("booking_details");

    if (bookingDetailsStr) {
      try {
        const details = JSON.parse(bookingDetailsStr);
        // console.log({
        //   details, paymentLinkNGN,
        //   paymentLinkUSD
        // });

        const ngnLink = details?.data?.paymentLinkNGN || details?.paymentLinkNGN;
        const usdLink = details?.data?.paymentLinkUSD || details?.paymentLinkUSD;
        const pNGN = details?.priceNGN;
        const pUSD = details?.priceUSD;

        if (ngnLink) setPaymentLinkNGN(ngnLink);
        if (usdLink) setPaymentLinkUSD(usdLink);
        if (pNGN) setPriceNGN(pNGN);
        if (pUSD) setPriceUSD(pUSD);

        // If neither exists, go to success page
        if (!ngnLink && !usdLink) {
          navigate(ROUTES.BOOKING_SUCCESS);
        }
      } catch (e) {
        navigate(ROUTES.HOME);
      }
    } else {
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  // If no links at all, render nothing while redirecting
  if (!paymentLinkNGN && !paymentLinkUSD) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-morayo-bg pt-[60px] flex items-center justify-center p-4">
      <VirtualNavbar />
      <Card className="w-full max-w-2xl border border-gray-200 rounded-2xl shadow-none overflow-hidden">
        <CardContent className="p-8 text-center flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2  font-serif">Choose Payment Currency</h2>
          <p className="text-gray-600 mb-4">
            Your reservation has been saved! Please select your preferred currency to complete your payment now.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 w-full">
            <p className="text-red-600 text-sm font-medium">
              Action Required: If payment is not completed within 30 minutes, your reservation will expire and the seats will be released.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {paymentLinkNGN && (
              <Button
                onClick={() => window.location.href = paymentLinkNGN}
                className="w-full h-[48px] rounded-full bg-[#E8593C] hover:bg-[#e05a0b]"
                size="lg"
              >
                <Wallet className="w-5 h-5" />
                Pay in NGN {priceNGN ? priceNGN.toLocaleString() : ''}
              </Button>
            )}

            {paymentLinkUSD && (
              <Button
                onClick={() => window.location.href = paymentLinkUSD}
                className="w-full h-[48px] rounded-full bg-[#2B4B8C] hover:bg-[#1d3566]"
                size="lg"
              >
                <Wallet className="w-5 h-5" />
                Pay in USD {priceUSD ? priceUSD.toLocaleString() : ''}
              </Button>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-6">
            A copy of these links has also been sent to your email. You can pay later if you prefer.
          </p>
          <Button variant="ghost" onClick={() => navigate(ROUTES.BOOKING_SUCCESS)} className="mt-2 w-full text-gray-500">
            Skip for now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
