// import apiClient from '../lib/api-client';
// import type { IHall } from '@/services/hallService';

// // Settings service functions
// export class SettingsService {
//   /**
//    * Get system settings
//    */
//   static async getSettings(): Promise<IHall> {
//     try {
//       const response = await apiClient.get<IHall>('/settings');
//       return response.data!;
//     } catch (error) {
//       console.error('Error fetching settings:', error);
//       throw error;
//     }
//   }
// }