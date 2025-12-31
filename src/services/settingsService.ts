import apiClient from '../lib/api-client';
import type { ISettings } from '@/intefaces/settings';

// Settings service functions
export class SettingsService {
  /**
   * Get system settings
   */
  static async getSettings(): Promise<ISettings> {
    try {
      const response = await apiClient.get<ISettings>('/settings');
      return response.data!;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  }
}