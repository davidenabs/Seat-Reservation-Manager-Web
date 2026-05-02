import apiClient from '../lib/api-client';

export interface RegisterPayload {
    name: string;
    email: string;
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

    static async verifyEmail(token: string) {
        const response = await apiClient.post('/auth/user/verify-email', { token });
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
}
