import apiClient from '../lib/api-client';

export interface IHall {
  _id: string;
  name: string;
  state: string;
  city: string;
  address: string;
  featureImage?: string;
  isActive: boolean;
  reservationOpenDate: string;
  reservationCloseDate: string;
  defaultTotalSeats: number;
  eventTimes: string[];
  workingDays: number[];
  maxSeatsPerUser: number;
  blockedDates?: string[];
  minCancellationHours: number;
  prioritySystemEnabled: boolean;
}

export class HallService {
  static async getHalls(): Promise<IHall[]> {
    try {
      const response = await apiClient.get<IHall[]>('/halls?public=true');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching halls:', error);
      throw error;
    }
  }
}
