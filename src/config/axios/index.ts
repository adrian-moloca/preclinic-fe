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
      withCredentials: true, // Important for medical data security
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token to requests
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

        // Handle token refresh for 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            originalRequest._retry = true;

            try {
              const newToken = await this.refreshAuthToken();
              this.isRefreshingToken = false;
              
              // Retry original request with new token
              if (newToken && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return this.client(originalRequest);
              }
            } catch (refreshError) {
              this.isRefreshingToken = false;
              this.handleAuthError();
              return Promise.reject(refreshError);
            }
          } else {
            // Wait for token refresh to complete
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }
        }

        // Handle different error types
        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  // Authentication helpers
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  private getClinicId(): string | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user).clinicId : null;
  }

  private getUserRole(): string | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user).role : null;
  }

  private async refreshAuthToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/refresh`,
        { refreshToken }
      );

      const { accessToken } = response.data;
      localStorage.setItem('authToken', accessToken);
      
      // Notify all waiting requests
      this.refreshSubscribers.forEach(callback => callback(accessToken));
      this.refreshSubscribers = [];
      
      return accessToken;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      throw error;
    }
  }

  private handleAuthError() {
    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    
    // Redirect to login
    window.location.href = '/login';
    
    toast.error('Your session has expired. Please login again.');
  }

  private handleApiError(error: AxiosError) {
    const status = error.response?.status;
    const message = (error.response?.data as { message?: string })?.message || error.message;

    switch (status) {
      case 400:
        toast.error(`Bad Request: ${message}`);
        break;
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
      case 404:
        toast.error('The requested resource was not found');
        break;
      case 422:
        // Validation errors - these are usually handled in forms
        const responseData = error.response?.data as { errors?: string[] };
        if (responseData?.errors) {
          const errors = responseData.errors;
          if (Array.isArray(errors)) {
            errors.forEach(err => toast.error(err));
          }
        }
        break;
      case 429:
        toast.error('Too many requests. Please wait a moment and try again');
        break;
      case 500:
        toast.error('Internal server error. Please try again later');
        break;
      case 503:
        toast.error('Service temporarily unavailable');
        break;
      default:
        if (status && status >= 400) {
          toast.error(`Error ${status}: ${message}`);
        } else if (error.code === 'NETWORK_ERROR') {
          toast.error('Network error. Please check your connection');
        } else if (error.code === 'ECONNABORTED') {
          toast.error('Request timeout. Please try again');
        } else {
          toast.error('An unexpected error occurred');
        }
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

  // File upload with progress
  public uploadFile<T = any>(
    url: string, 
    file: File | FormData, 
    onProgress?: (progress: number) => void
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Medical document specific upload (with HIPAA compliance headers)
  public uploadMedicalDocument<T = any>(
    url: string,
    file: File,
    patientId: string,
    documentType: string,
    onProgress?: (progress: number) => void
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);
    formData.append('documentType', documentType);

    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Document-Type': 'medical',
        'X-Patient-ID': patientId,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  // Bulk operations for clinic data
  public bulkOperation<T = any>(
    url: string,
    operations: any[],
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.client.post(url, { operations }, {
      ...config,
      headers: {
        ...config?.headers,
        'X-Bulk-Operation': 'true',
      },
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;