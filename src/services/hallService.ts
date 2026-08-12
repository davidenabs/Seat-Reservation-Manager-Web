import apiClient from '../lib/api-client';

// export interface IHall {
//   _id: string;
//   name: string;
//   state: string;
//   city: string;
//   address: string;
//   featureImage?: string;
//   isActive: boolean;
//   reservationOpenDate: string;
//   reservationCloseDate: string;
//   defaultTotalSeats: number;
//   eventTimes: string[];
//   workingDays: number[];
//   maxSeatsPerUser: number;
//   blockedDates?: string[];
//   minCancellationHours: number;
//   prioritySystemEnabled: boolean;
// }
export interface IHall {
    _id?: string;
    name: string;
    state: string;
    city: string;
    address: string;
    isActive: boolean;
    featureImage?: string;
    
    // Hall-specific settings
    reservationOpenDate: Date;
    reservationCloseDate: Date;
    defaultTotalSeats: number;
    seatCapacityOverrides?: {
        date: Date;
        totalSeats: number;
    }[];
    eventTimes: string[];
    workingDays: number[]; // 1-5 for Monday to Friday
    maxSeatsPerUser: number;
    blockedDates?: Date[];
    minCancellationHours?: number;
    prioritySystemEnabled: boolean;
    prioritySeatAllocation: number;
    waitingListCapacity: number;
    autoAllocationHoursBeforeEvent: number;
    priorityRules: {
        newUser: boolean;
        lowFrequency: boolean;
        inactivity: boolean;
        neverBooked: boolean;
    };
    lowFrequencyThreshold: number;
    lowFrequencyPeriodDays: number;
    inactivityPeriodDays: number;
    
    isPaymentEnabled?: boolean;
    paymentPriceNGN?: number;
    paymentPriceUSD?: number;
    
    isMultipleDaysBookingEnabled?: boolean;
    discountConfig?: {
        minDays: number;
        discountAmountNGN: number;
        discountAmountUSD: number;
        existingUserPriceNGN: number;
        existingUserPriceUSD: number;
    };
    
    createdAt?: Date;
    updatedAt?: Date;
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
