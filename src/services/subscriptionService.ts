import apiClient from '../lib/api-client';

export class SubscriptionService {
    static async getStatus(email: string) {
        const response = await apiClient.get(`/subscriptions/status?email=${encodeURIComponent(email)}`);
        return response;
    }

    static async initializePaystack(email: string, userId: string, plan: string, timezone: string) {
        const response = await apiClient.post('/subscriptions/paystack/initialize', { email, userId, plan, timezone });
        return response;
    }

    static async initializeStripe(email: string, userId: string, plan: string, timezone: string) {
        const response = await apiClient.post('/subscriptions/stripe/initialize', { email, userId, plan, timezone });
        return response;
    }

    static async getNextEvent() {
        const response = await apiClient.get('/events/next-event');
        return response;
    }

    static async getZoomSignature(meetingId: number, role: 0 | 1 = 0): Promise<string> {
        const res = await apiClient.post("/subscriptions/zoom-signature", {
            meetingId,
            role, // 0 = attendee, 1 = host
        });
        return (res as any)?.signature;
    }

    static async getVideoSDKSignature(sessionName: string, role: 0 | 1 = 0): Promise<string> {
        const res = await apiClient.post("/subscriptions/zoom-video-signature", {
            sessionName,
            role,
        });
        console.log(sessionName);
        
        return (res as any)?.signature;
    }

    // New frontend method
    static async getJoinToken(meetingId: string): Promise<string> {
        const res = await apiClient.post('/subscriptions/zoom-join-token', {
            meetingId,
        });
        return (res as any)?.token;
    }

}
