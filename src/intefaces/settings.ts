export interface ISettings {
  name: string;
  featureImage?: string;
  reservationOpenDate: string;
  reservationCloseDate: string;
  defaultTotalSeats: number;
  eventTimes: string[];
  workingDays: string[];
  maxSeatsPerUser: number;
  blockedDates: string[];
}
