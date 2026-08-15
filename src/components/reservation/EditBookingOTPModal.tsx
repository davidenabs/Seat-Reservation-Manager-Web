import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api-client";
import { toast } from "sonner";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface EditBookingOTPModalProps {
  onVerified: (email: string, bookings: any[]) => void;
}

export default function EditBookingOTPModal({ onVerified }: EditBookingOTPModalProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      const savedData = sessionStorage.getItem("edit_booking_data");
      if (savedData) {
        try {
          const { email: savedEmail, bookings } = JSON.parse(savedData);
          if (savedEmail && bookings) {
            onVerified(savedEmail, bookings);
            return;
          }
        } catch (e) {
          sessionStorage.removeItem("edit_booking_data");
        }
      }
      setIsOpen(true);
    } else {
      setIsOpen(false);
      sessionStorage.removeItem("edit_booking_data");
    }
  }, [searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleClose = () => {
    setIsOpen(false);
    searchParams.delete("edit");
    setSearchParams(searchParams);
  };

  const maskEmail = (email: string) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    const maskedName = name.length > 2 ? `${name.slice(0, 2)}${"*".repeat(name.length - 2)}` : name;
    return `${maskedName}@${domain}`;
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post("/bookings/otp/send", { email });
      if (res.success) {
        setStep("otp");
        setCountdown(120);
        toast.success("OTP sent to your email");
      } else {
        toast.error(res.message || "Failed to send OTP");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("OTP is required");
      return;
    }
    if (otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post("/bookings/otp/verify", { email, otp });
      if (res.success) {
        const returnedBookings = res.data?.bookings || res.data;
        if (!returnedBookings || (Array.isArray(returnedBookings) && returnedBookings.length === 0)) {
          toast.error("No active unpaid bookings found for this email. They may have expired.");
          setIsLoading(false);
          return;
        }
        toast.success("OTP verified");
        sessionStorage.setItem("edit_booking_data", JSON.stringify({ email, bookings: returnedBookings }));
        onVerified(email, returnedBookings);
        handleClose();
      } else {
        toast.error(res.message || "Invalid OTP");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="p-0 border-0 bg-transparent shadow-none" onInteractOutside={(e) => e.preventDefault()}>
        <Card className="border-0 border-t-4 border-t-green-500 w-full rounded-xl overflow-hidden shadow-lg">
          <CardHeader className="text-center flex flex-col items-center w-full bg-white pb-2 pt-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 animate-pulse shadow-sm">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              {step === "email" ? "Edit Booking" : "Enter OTP"}
            </h1>
            <p className="text-gray-600 text-sm px-4">
              {step === "email"
                ? "Enter your email to receive an OTP and access your existing unpaid bookings."
                : (
                  <>
                    Please enter the 6-digit code sent to{" "}
                    <span className="font-medium text-gray-800">{maskEmail(email)}</span>
                  </>
                )}
            </p>
          </CardHeader>

          <CardContent className="bg-white pb-8 pt-4 px-6 sm:px-8">
            <div className="space-y-6">
              {step === "email" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="h-12 rounded-full border-gray-300 focus-visible:ring-green-500 px-6"
                    />
                  </div>
                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading || !email || countdown > 0}
                    className="w-full bg-[#FD690C] hover:bg-orange-600 text-white h-12 rounded-full font-bold shadow-md transition-all"
                  >
                    {isLoading
                      ? "Sending..."
                      : countdown > 0
                        ? `Wait ${countdown}s to Resend`
                        : "Send OTP"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-center gap-2">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isLoading}>
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className="w-12 h-14 sm:w-14 sm:h-16 text-lg sm:text-2xl font-bold border-2 rounded-xl border-gray-200 focus-visible:border-green-500 focus-visible:ring-green-500/20"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="flex flex-col gap-3 pt-2">
                    <Button
                      onClick={handleVerifyOtp}
                      disabled={isLoading || otp.length < 6}
                      className="w-full bg-[#FD690C] hover:bg-orange-600 text-white h-12 rounded-full font-bold shadow-md transition-all disabled:opacity-50"
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSendOtp}
                      disabled={isLoading || countdown > 0}
                      className="w-full h-12 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all font-medium"
                    >
                      {isLoading
                        ? "Resending..."
                        : countdown > 0
                          ? `Resend OTP in ${countdown}s`
                          : "Resend OTP"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
