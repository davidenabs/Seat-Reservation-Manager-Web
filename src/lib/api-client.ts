import config from '@/config/environment';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { toast } from 'sonner';

// API Response interface
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[]; // For validation errors array
}

// API Client class
class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 60000, // 60 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          });
        }
        
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      (error) => {
        // Handle different error scenarios
        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;
          
          // Extract error message from different response formats
          const errorMessage = this.extractErrorMessage(data);
          
          switch (status) {
            case 401:
              toast.error('Authentication required. Please login again.');
              // Redirect to login or clear auth state
              localStorage.removeItem('authToken');
              break;
            case 403:
              toast.error('Access denied. You don\'t have permission for this action.');
              break;
            case 404:
              toast.error('Resource not found.');
              break;
            case 422:
              // Validation errors - show the extracted message
              toast.error(errorMessage || 'Validation error occurred.');
              break;
            case 500:
              toast.error('Server error. Please try again later.');
              break;
            default:
              toast.error(errorMessage || 'An unexpected error occurred.');
          }

          // Log error in development
          if (process.env.NODE_ENV === 'development') {
            console.error(`❌ API Error: ${error.config.method?.toUpperCase()} ${error.config.url}`, {
              status,
              data,
              extractedMessage: errorMessage,
            });
          }

          // Create a standardized error with the extracted message
          const apiError = new Error(errorMessage || `HTTP error! status: ${status}`);
          // Attach the original response data for additional context if needed
          (apiError as any).responseData = data;
          (apiError as any).status = status;
          
          throw apiError;
        } else if (error.request) {
          // Network error
          toast.error('Network error. Please check your connection.');
          console.error('Network error:', error.request);
          throw new Error('Network error. Please check your connection.');
        } else {
          // Other error
          toast.error('An unexpected error occurred.');
          console.error('Unexpected error:', error.message);
          throw new Error(error.message);
        }
      }
    );
  }

  // Helper method to extract error message from different response formats
  private extractErrorMessage(data: any): string {
    // Handle null or undefined data
    if (!data) {
      return 'Unknown error occurred';
    }

    // If data is a string, return it directly
    if (typeof data === 'string') {
      return data;
    }

    // Handle case where data.errors is an array (validation errors)
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      // Join multiple validation errors or return the first one
      return data.errors.join(', ');
    }

    // Handle case where there's a single error field
    if (data.error && typeof data.error === 'string') {
      return data.error;
    }

    // Handle case where there's a message field
    if (data.message && typeof data.message === 'string') {
      return data.message;
    }

    // Handle case where error is an object with a message
    if (data.error && typeof data.error === 'object' && data.error.message) {
      return data.error.message;
    }

    // Fallback to a generic message
    return 'An error occurred';
  }

  // Generic method to handle API responses and extract errors
  private handleApiResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
    const { data } = response;
    
    if (!data.success) {
      const errorMessage = this.extractErrorMessage(data);
      const error = new Error(errorMessage);
      // Attach additional context
      (error as any).responseData = data;
      (error as any).status = response.status;
      throw error;
    }
    
    return data;
  }

  // Generic GET method
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return this.handleApiResponse(response);
  }

  // Generic POST method
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return this.handleApiResponse(response);
  }

  // Generic PUT method
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return this.handleApiResponse(response);
  }

  // Generic PATCH method
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return this.handleApiResponse(response);
  }

  // Generic DELETE method
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return this.handleApiResponse(response);
  }

  // Get raw axios instance for advanced usage
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }

  // Update base URL
  setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
  }

  // Set auth token
  setAuthToken(token: string): void {
    this.client.defaults.headers.Authorization = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  }

  // Clear auth token
  clearAuthToken(): void {
    delete this.client.defaults.headers.Authorization;
    localStorage.removeItem('authToken');
  }
}

// Create and export the API client instance
const baseUrl = config.app.devMode ? 'http://localhost:3003/api' : 'https://api.themorayobrownshow.com/api';
const apiClient = new ApiClient(baseUrl);

export default apiClient;