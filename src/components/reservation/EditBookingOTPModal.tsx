import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

  const handleClose = () => {
    setIsOpen(false);
    searchParams.delete("edit");
    setSearchParams(searchParams);
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
    setIsLoading(true);
    try {
      const res = await api.post("/bookings/otp/verify", { email, otp });
      if (res.success) {
        const returnedBookings = res.data.bookings || res.data;
        if (!returnedBookings || returnedBookings.length === 0) {
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
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Existing Booking</DialogTitle>
          <DialogDescription>
            {step === "email"
              ? "Enter your email to receive an OTP and access your existing unpaid bookings."
              : "Enter the OTP sent to your email."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === "email" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <Button onClick={handleSendOtp} disabled={isLoading} className="w-full">
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">One-Time Password (OTP)</label>
              <div className="flex justify-center gap-2 mt-3">
                <InputOTP maxLength={4} value={otp} onChange={setOtp} disabled={isLoading}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button onClick={handleVerifyOtp} disabled={isLoading} className="w-full">
                {isLoading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button variant="link" onClick={handleSendOtp} disabled={isLoading} className="w-full mt-2">
                Resend OTP
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
