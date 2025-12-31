import type { IEvent } from "./event";
import type { IUser } from "./user";

export interface IReservationPayload {
  eventDate: string;
  seatNumbers: number[];
  seatLabels: string[];
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  ageRange: '18-25' | '26-35' | '36-45' | '46-55' | '55+';
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
  seatLabels?: string[],
  status?: string;
  qrCode?: string;
  reservationToken?: string;
  cancelledAt?: Date;
  // Add other fields as needed
}
