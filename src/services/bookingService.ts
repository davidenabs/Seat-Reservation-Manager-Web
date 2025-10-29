import apiClient from '../lib/api-client';

// Types for better type safety
export interface Seat {
  number: number;
  label: string;
  isAvailable: boolean;
}

export interface SeatsResponse {
  allSeats: Seat[];
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
}

export interface ReservationPayload {
  eventDate: string;
  seatNumbers: number[];
  seatLabels: string[];
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  ageRange: '18-25' | '26-35' | '36-45' | '46-55' | '55+';
}

export interface User {
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  ageRange: '18-25' | '26-35' | '36-45' | '46-55' | '55+';
}

export interface Event {
  date: Date;
  time: string;
  totalSeats: number;
  availableSeats: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  location?: string;
  sessionName?: string;
}

export interface ReservationResponse {
  message: string;
  tempId: string;
  expiresAt: string;
  ticketId: string;
  user?: User;
  event?: Event;
  eventDate?: Date;
  seatNumbers?: number[];
  seatLabels?: string[],
  status?: string;
  qrCode?: string;
  reservationToken?: string;
  cancelledAt?: Date;
  // Add other fields as needed
}

// OTP related types
export interface OTPVerificationPayload {
  email: string;
  otp: string;
  tempId: string;
  reservationToken: string;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
  ticketId: string;
  user: {
    name: string;
    email: string;
    phone: string;
    gender: string;
    ageRange: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
  event: {
    date: string; // ISO date string
    time: string;
    totalSeats: number;
    availableSeats: number;
    isActive: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
  eventDate: string; // ISO date string
  seatNumbers: number[];
  seatLabels: string[];
  status: string;
  qrCode: string; // base64-encoded PNG
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  calendarLink?: string;
}

export interface OTPResendPayload {
  email: string;
}

export interface OTPResendResponse {
  success: boolean;
  message: string;
  tempId?: string;
}

// Booking service functions
export class BookingService {
  /**
   * Fetch available seats for a specific date
   */
  static async fetchAvailableSeats(date: string): Promise<SeatsResponse> {
    if (!date) {
      throw new Error('Date is required');
    }

    try {
      const response = await apiClient.get<SeatsResponse>(`/bookings/seats/${date}`);
      return response.data!;
    } catch (error) {
      console.error('Error fetching available seats:', error);
      throw error;
    }
  }

  /**
   * Reserve seats with user information
   */
  static async reserveSeat(payload: ReservationPayload): Promise<ReservationResponse> {
    try {
      const response = await apiClient.post<ReservationResponse>('/bookings/initiate', payload);
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
  static async updateReservation(reservationId: string, updates: Partial<ReservationPayload>): Promise<ReservationResponse> {
    try {
      const response = await apiClient.patch<ReservationResponse>(`/bookings/${reservationId}`, updates);
      return response.data!;
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  }

  static async verifyOTP(payload: OTPVerificationPayload): Promise<OTPVerificationResponse> {
    if (!payload.email || !payload.otp || !payload.tempId) {
      throw new Error('Email, OTP, and tempId are required for verification');
    }
    console.log({ payload });

    try {
      const response = await apiClient.post<OTPVerificationResponse>('/bookings/verify', payload);
      return response.data!;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  /**
   * Resend OTP for booking verification
   */
  static async resendOTP(payload: OTPResendPayload): Promise<OTPResendResponse> {
    if (!payload.email) {
      throw new Error('Email is required to resend OTP');
    }

    try {
      const response = await apiClient.post<OTPResendResponse>('/bookings/resend-otp', payload);
      return response.data!;
    } catch (error) {
      console.error('Error resending OTP:', error);
      throw error;
    }
  }
}
