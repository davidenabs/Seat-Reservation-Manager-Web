import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/route";
import VirtualNavbar from "@/components/VirtualNavbar";
import { toast } from "sonner";

export default function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setMessage("No payment reference found.");
      return;
    }

    const verify = async () => {
      try {
        // I will use fetch directly if I don't have a dedicated API service method
        const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
        const headers: any = {
          "Content-Type": "application/json",
        };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:3103/api";
        const response = await fetch(`${API_URL}/payments/verify`, {
          method: "POST",
          headers,
          body: JSON.stringify({ reference })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setStatus("success");
          setMessage("Payment verified successfully! Your booking is now complete, and your ticket has been sent to your email.");
          toast.success("Payment successful!");
        } else {
          setStatus("error");
          setMessage(data.message || "Payment verification failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred while verifying your payment.");
      }
    };

    verify();
  }, [reference]);

  return (
    <div className="min-h-screen bg-morayo-bg pt-[60px] flex items-center justify-center p-4">
      <VirtualNavbar />
      <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden">
        <CardContent className="p-8 text-center flex flex-col items-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <Button onClick={() => navigate(ROUTES.HOME)} className="w-full h-12 rounded-full">
                Return to Home
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-8">{message}</p>
              <Button variant="outline" onClick={() => navigate(ROUTES.HOME)} className="w-full h-12 rounded-full border-gray-300">
                Return to Home
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
