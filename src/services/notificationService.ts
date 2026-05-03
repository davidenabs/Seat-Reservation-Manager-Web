import apiClient from '../lib/api-client';

export class NotificationService {
    static async getPreferences() {
        const response = await apiClient.get('/notifications/preferences');
        return response;
    }

    static async updatePreferences(preferences: any) {
        const response = await apiClient.patch('/notifications/preferences', preferences);
        return response.data;
    }

    static async getNotifications(params?: { page?: number; limit?: number; type?: string; isRead?: boolean }) {
        const response = await apiClient.get('/notifications', { params });
        return response.data;
    }

    static async markAsRead(id: string) {
        const response = await apiClient.patch(`/notifications/${id}/read`);
        return response.data;
    }

    static async markAllAsRead() {
        const response = await apiClient.patch('/notifications/read-all');
        return response.data;
    }

    static async clearAll() {
        const response = await apiClient.delete('/notifications/clear-all');
        return response.data;
    }

    static async deleteNotification(id: string) {
        const response = await apiClient.delete(`/notifications/${id}`);
        return response.data;
    }
}
