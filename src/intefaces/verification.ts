export interface IOTPVerificationPayload {
  email: string;
  otp: string;
  tempId: string;
  reservationToken: string;
}

export interface IOTPVerificationResponse {
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

export interface IOTPResendPayload {
  email: string;
}

export interface IOTPResendResponse {
  success: boolean;
  message: string;
  tempId?: string;
}