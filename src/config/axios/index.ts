import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-toastify';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: string[];
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshingToken = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
      timeout: 30000, 
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token to requests if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add clinic/cabinet ID to requests if available
        const clinicId = this.getClinicId();
        if (clinicId) {
          config.headers['X-Clinic-ID'] = clinicId;
        }

        // Add user role for permission validation
        const userRole = this.getUserRole();
        if (userRole) {
          config.headers['X-User-Role'] = userRole;
        }

        // Log requests in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          });
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log responses in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Only handle 401 for actual API calls, not for auth endpoints
        const isAuthEndpoint = originalRequest.url?.includes('/auth/');
        
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
          // Don't automatically logout or redirect
          // Let the AuthProvider handle authentication state
          console.log('401 error, but not logging out automatically');
        }

        // Handle different error types without automatic logout
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  // Authentication helpers - use same keys as AuthProvider
  private getAuthToken(): string | null {
    return localStorage.getItem('preclinic_token') || null;
  }

  private getClinicId(): string | null {
    const user = localStorage.getItem('preclinic_user');
    if (!user) return null;
    try {
      return JSON.parse(user).clinicId || null;
    } catch {
      return null;
    }
  }

  private getUserRole(): string | null {
    const user = localStorage.getItem('preclinic_user');
    if (!user) return null;
    try {
      return JSON.parse(user).role || null;
    } catch {
      return null;
    }
  }

  private handleApiError(error: AxiosError) {
    const apiError = error.response?.data as ApiError;
    
    if (error.response) {
      // Server responded with error
      switch (error.response.status) {
        case 400:
          toast.error(apiError?.message || 'Invalid request. Please check your input.');
          break;
        case 401:
          // Don't show error for 401, let the app handle it
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        case 404:
          // Don't show error for 404 on auth endpoints
          if (!error.config?.url?.includes('/auth/')) {
            toast.error('The requested resource was not found.');
          }
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          if (apiError?.message && error.response.status !== 401) {
            toast.error(apiError.message);
          }
      }
    } else if (error.request) {
      // Request made but no response - likely network error
      console.log('Network error, but not showing toast to avoid spam');
    } else {
      // Error in request setup
      toast.error('An unexpected error occurred.');
    }
  }

  // Public API methods
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.put(url, data, config);
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.patch(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.delete(url, config);
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export for direct axios usage if needed
export const axiosInstance = apiClient.getClient();