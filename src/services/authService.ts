import apiClient from '../lib/api-client';

export interface RegisterPayload {
    name: string;
    email: string;
    phone?: string;
    country?: string;
    password?: string;
}

export interface LoginPayload {
    email: string;
    password?: string;
}

export class AuthService {
    static async register(payload: RegisterPayload) {
        const response = await apiClient.post('/auth/user/register', payload);

        return response;
    }

    static async verifyEmail(email: string, otp: string) {
        const response = await apiClient.post('/auth/user/verify-email', { email, otp });
        return response;
    }

    static async resendOtp(email: string) {
        const response = await apiClient.post('/auth/user/resend-otp', { email });
        return response;
    }

    static async login(payload: LoginPayload) {
        const response: any = await apiClient.post('/auth/user/login', payload);
        if (response && response.success && response.token) {
            apiClient.setAuthToken(response.token);
            localStorage.setItem('user_profile', JSON.stringify(response.user));
        }
        return response;
    }

    static async googleLogin(idToken: string) {
        const response: any = await apiClient.post('/auth/user/google-login', { idToken });
        if (response && response.success && response.token) {
            apiClient.setAuthToken(response.token);
            localStorage.setItem('user_profile', JSON.stringify(response.user));
        }
        return response;
    }

    static async forgotPassword(email: string) {
        const response = await apiClient.post('/auth/user/forgot-password', { email });
        return response;
    }

    static async resetPassword(token: string, newPassword: string) {
        const response = await apiClient.post('/auth/user/reset-password', { token, newPassword });
        return response;
    }

    static logout() {
        apiClient.clearAuthToken();
        localStorage.removeItem('user_profile');
    }

    static isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }

    static getUserProfile() {
        const profile = localStorage.getItem('user_profile');
        return profile ? JSON.parse(profile) : null;
    }

    static async getProfile() {
        const response: any = await apiClient.get('/auth/user/profile');
        if (response && response.success && response.data) {
            localStorage.setItem('user_profile', JSON.stringify(response.data));
        }
        return response;
    }

    static async updateProfile(payload: any) {
        const response: any = await apiClient.patch('/auth/user/profile', payload);
        if (response && response.success && response.data) {
            localStorage.setItem('user_profile', JSON.stringify(response.data));
        }
        return response;
    }

    static async changePassword(payload: any) {
        const response = await apiClient.post('/auth/user/change-password', payload);
        return response;
    }

    static async deleteAccount() {
        const response = await apiClient.delete('/auth/user/account');
        if (response && response.success) {
            this.logout();
        }
        return response;
    }
}
