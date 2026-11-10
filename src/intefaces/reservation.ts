import type { IEvent } from "./event";
import type { IUser } from "./user";

export interface IReservationPayload {
  eventDate?: string;
  eventDates?: string[];
  seatNumbers?: number[];
  seatLabels?: string[];
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  ageRange: '18-25' | '26-35' | '36-45' | '46-55' | '55+';
  hallId?: string;
  packageId?: string;
  attendees?: { name: string; email?: string }[];
  agreeToTerms?: boolean;
}

export interface IReservationResponse {
  message: string;
  tempId: string;
  expiresAt: string;
  ticketId: string;
  user?: IUser;
  event?: IEvent;
  eventDate?: Date;
  seatNumbers?: number[];
  seatLabels?: string[];
  status?: string;
  qrCode?: string;
  reservationToken?: string;
  cancelledAt?: Date;
  requiresOTP?: boolean;
  requiresPayment?: boolean;
  paymentLinkNGN?: string;
  paymentLinkUSD?: string;
  priceNGN?: number;
  priceUSD?: number;
  packageDetails?: {
    packageId: string;
    packageName: string;
    seatCount: number;
    priceNGN: number;
    priceUSD?: number;
    attendees?: { name: string; email?: string }[];
  };
}
