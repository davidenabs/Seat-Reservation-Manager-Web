import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lock, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/assets/tmas-logo-black.png";
import { VerificationService } from "@/services/verificationService";
import { ROUTES } from "@/config/route";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import type { IOTPResendPayload, IOTPVerificationPayload } from "@/intefaces/verification";

const otpSchema = z.object({
    otp: z
        .string()
        .length(4, "OTP must be exactly 4 digits")
        .regex(/^\d{4}$/, "OTP must contain only digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

const VerifyEmail = () => {
    const { tempId } = useParams<{ tempId: string }>();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [reservationToken, setReservationToken] = useState("");
    const [countdown, setCountdown] = useState(0); // seconds remaining

    // eslint-disable-next-line no-empty-pattern
    const {
        // register,
        // handleSubmit,
        // setValue,
        // watch,
        // formState: { errors },
    } = useForm<OTPFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });


    // Check if tempId exists and email is stored
    useEffect(() => {
        console.log({ tempId });

        if (!tempId) {
            toast.error("Invalid verification link. Redirecting to booking page.");
            //   navigate(ROUTES.HOME);
            return;
        }

        // Get email from localStorage or sessionStorage (stored during booking process)
        const storedEmail = localStorage.getItem("bookingEmail") || sessionStorage.getItem("bookingEmail");
        const reservationToken = localStorage.getItem("reservationToken") || sessionStorage.getItem("reservationToken");
        console.log({ storedEmail });

        if (storedEmail && reservationToken) {
            setEmail(storedEmail);
            setReservationToken(reservationToken);
        } else {
            toast.error("Email not found. Please start the booking process again.");
            //   navigate(ROUTES.HOME);
        }
    }, [tempId, navigate]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    },)

    // OTP Verification Mutation
    const verifyOTPMutation = useMutation({
        mutationFn: (payload: IOTPVerificationPayload) => VerificationService.verifyOTP(payload),
        onSuccess: (response) => {
            toast.success(response.message || "Email verified successfully!");
            console.log({ response });

            // Store booking details for success page
            sessionStorage.setItem("booking_details", JSON.stringify(response));

            // Clear stored email
            localStorage.removeItem("bookingEmail");
            localStorage.removeItem("reservationToken");

            // Navigate to success page
            navigate(ROUTES.BOOKING_SUCCESS);
        },
        onError: (error: Error) => {
            toast.error(error.message || "OTP verification failed. Please try again.");
            console.log({ error });

        },
    });

    // Resend OTP Mutation
    const resendOTPMutation = useMutation({
        mutationFn: (payload: IOTPResendPayload) => VerificationService.resendOTP(payload),
        onSuccess: (response) => {
            setCountdown(60); // start 1 min countdown

            toast.success(response.message || "A new OTP has been sent to your email.");
            // Clear current OTP input
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to resend OTP. Please try again.");
        },
    });

    const onSubmit = async (data: OTPFormData) => {
        console.log({ email });
        console.log({ tempId });

        if (!tempId || !email) {
            toast.error("Missing verification details. Please start the booking process again.");
            return;
        }

        const payload: IOTPVerificationPayload = {
            email,
            otp: data.otp,
            tempId,
            reservationToken
        };

        verifyOTPMutation.mutate(payload);
    };

    const handleResendOtp = async () => {
        if (!email) {
            toast.error("Email not found. Please start the booking process again.");
            return;
        }

        const payload: IOTPResendPayload = {
            email,
        };

        resendOTPMutation.mutate(payload);
    };

    // Mask email for display
    const maskEmail = (email: string) => {
        if (!email) return "";
        const [localPart, domain] = email.split("@");
        if (localPart.length <= 2) return email;
        const maskedLocal = localPart[0] + "*".repeat(localPart.length - 2) + localPart[localPart.length - 1];
        return `${maskedLocal}@${domain}`;
    };

    const form = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
        },
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header with Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-6">
                        <img src={Logo} alt="TMAS Logo" className="w-36 sm:w-[145.131591796875px]" />
                    </div>
                </div>

                <Button
                    variant="ghost"
                    onClick={() => {
                        navigate(-1);
                    }}
                    className="mb-2"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Go back
                </Button>
                <Card className="border-0 border-t-4 border-t-green-500 shadow-none w-full">
                    <CardHeader className="text-center flex flex-col items-center w-full">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4 animate-pulse">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 mb-2">Enter OTP</h1>
                        <p className="text-gray-600 text-sm">
                            Please enter the 4-digit code sent to{" "}
                            <span className="font-medium text-gray-800">{maskEmail(email)}</span>
                        </p>
                    </CardHeader>

                    <CardContent>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="w2/3 space-y-6">
                                <div className="flex justify-center gap-2">
                                    <FormField
                                        control={form.control}
                                        name="otp"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <InputOTP maxLength={4} {...field}>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={0} />
                                                            <InputOTPSlot index={1} />
                                                            <InputOTPSlot index={2} />
                                                            <InputOTPSlot index={3} />
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    /></div>
                                {/* <Button type="submit">Submit</Button> */}
                                <div className="flex flex-col gap-4">
                                    <Button
                                        type="submit"
                                        disabled={verifyOTPMutation.isPending || form.watch("otp").length < 4}
                                        className="bg-[#FD690C] hover:bg-orange-600 text-white py-3 rounded-full font-bold disabled:opacity-50"
                                    >
                                        {verifyOTPMutation.isPending ? "Verifying..." : "Verify OTP"}
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendOTPMutation.isPending || countdown > 0}
                                        variant="outline"
                                        className="py-3 border-gray-300 rounded-full"
                                    >
                                        {resendOTPMutation.isPending
                                            ? "Resending..."
                                            : countdown > 0
                                                ? `Resend OTP in ${countdown}s`
                                                : "Resend OTP"}
                                    </Button>
                                </div>

                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-gray-500 text-sm">
                        Contact support at{" "}
                        <a href="mailto:info@mabstudios.com" className="text-blue-800 hover:underline font-medium">
                            info@mabstudios.com
                        </a>{" "}
                        for any queries
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;