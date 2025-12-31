import type { ISettings } from "./settings";

// Types for better type safety
export interface ISeat {
  number: number;
  label: string;
  isAvailable: boolean;
}

export interface ISeatsResponse {
  allSeats: ISeat[];
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
}

export interface ISeatGridProps {
  seats: ISeat[];
  selectedSeats: ISeat[];
  onSeatClick: (seat: ISeat) => void;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  seatsData: ISeatsResponse |undefined;
  settings: ISettings | undefined;
}
