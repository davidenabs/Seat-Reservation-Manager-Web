import apiClient from '../lib/api-client';
import type { IOTPResendPayload, IOTPResendResponse, IOTPVerificationPayload, IOTPVerificationResponse } from '@/intefaces/verification';

// Verification service functions
export class VerificationService {
  /**
   * Verify OTP for booking reservation
   */
  static async verifyOTP(payload: IOTPVerificationPayload): Promise<IOTPVerificationResponse> {
    if (!payload.email || !payload.otp || !payload.tempId) {
      throw new Error('Email, OTP, and tempId are required for verification');
    }
    // console.log({ payload });  

    try {
      const response = await apiClient.post<IOTPVerificationResponse>('/bookings/verify', payload);
      return response.data!;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  /**
   * Resend OTP for booking verification
   */
  static async resendOTP(payload: IOTPResendPayload): Promise<IOTPResendResponse> {
    if (!payload.email) {
      throw new Error('Email is required to resend OTP');
    }

    try {
      const response = await apiClient.post<IOTPResendResponse>('/bookings/resend-otp', payload);
      return response.data!;
    } catch (error) {
      console.error('Error resending OTP:', error);
      throw error;
    }
  }
}
