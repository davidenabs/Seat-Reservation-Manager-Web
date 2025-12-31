import type { ISeatsResponse } from '@/intefaces/seats';
import apiClient from '../lib/api-client';
import type { IReservationPayload } from '@/intefaces/reservation';
import type { IReservationResponse } from '@/intefaces/reservation';

// Booking service functions
export class BookingService {
  /**
   * Fetch available seats for a specific date
   */
  static async fetchAvailableSeats(date: string): Promise<ISeatsResponse> {
    if (!date) {
      throw new Error('Date is required');
    }

    try {
      const response = await apiClient.get<ISeatsResponse>(`/bookings/seats/${date}`);
      return response.data!;
    } catch (error) {
      console.error('Error fetching available seats:', error);
      throw error;
    }
  }

  /**
   * Reserve seats with user information
   */
  static async reserveSeat(payload: IReservationPayload): Promise<IReservationResponse> {
    try {
      const response = await apiClient.post<IReservationResponse>('/bookings/initiate', payload);
      return response.data!;
    } catch (error) {
      console.error('Error reserving seat:', error);
      throw error;
    }
  }

  /**
   * Get user's reservations
   */
  static async getUserReservations(userId?: string): Promise<any[]> {
    try {
      const endpoint = userId ? `/bookings/user/${userId}` : '/bookings/user';
      const response = await apiClient.get<any[]>(endpoint);
      return response.data!;
    } catch (error) {
      console.error('Error fetching user reservations:', error);
      throw error;
    }
  }

  /**
   * Cancel a reservation
   */
  static async cancelReservation(ticketId: string, reservationToken: string): Promise<{ message: string }> {
    try {
      // bookings/:ticketId/cancel/:reservationToken
      const response = await apiClient.post<{ message: string }>(`/bookings/cancel`, { ticketId, reservationToken });
      return response.data!;
    } catch (error) {
      console.error('Error canceling reservation:', error);
      throw error;
    }
  }

  /**
   * Update reservation details
   */
  static async updateReservation(reservationId: string, updates: Partial<IReservationPayload>): Promise<IReservationResponse> {
    try {
      const response = await apiClient.patch<IReservationResponse>(`/bookings/${reservationId}`, updates);
      return response.data!;
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  }

  // /**
  //  * Verify OTP for booking reservation
  //  */
  // static async verifyOTP(payload: IOTPVerificationPayload): Promise<IOTPVerificationResponse> {
  //   if (!payload.email || !payload.otp || !payload.tempId) {
  //     throw new Error('Email, OTP, and tempId are required for verification');
  //   }
  //   // console.log({ payload });  

  //   try {
  //     const response = await apiClient.post<IOTPVerificationResponse>('/bookings/verify', payload);
  //     return response.data!;
  //   } catch (error) {
  //     console.error('Error verifying OTP:', error);
  //     throw error;
  //   }
  // }

  // /**
  //  * Resend OTP for booking verification
  //  */
  // static async resendOTP(payload: IOTPResendPayload): Promise<IOTPResendResponse> {
  //   if (!payload.email) {
  //     throw new Error('Email is required to resend OTP');
  //   }

  //   try {
  //     const response = await apiClient.post<IOTPResendResponse>('/bookings/resend-otp', payload);
  //     return response.data!;
  //   } catch (error) {
  //     console.error('Error resending OTP:', error);
  //     throw error;
  //   }
  // }
}
