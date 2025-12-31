export interface IEvent {
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