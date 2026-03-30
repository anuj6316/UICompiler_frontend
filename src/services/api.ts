import { env } from '../config/env';

/**
 * Core API Service
 * 
 * This service provides a centralized way to make HTTP requests to your backend.
 * It automatically uses the `apiUrl` defined in your environment configuration.
 */

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

async function fetchWithConfig(endpoint: string, options: FetchOptions = {}) {
  const { requireAuth = true, ...fetchOptions } = options;
  
  // Ensure the apiUrl has a protocol
  let baseUrl = env.apiUrl;
  if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    // If it looks like localhost or a domain, prepend http://
    if (baseUrl.includes(':') || baseUrl.includes('.')) {
      baseUrl = `http://${baseUrl}`;
    }
  }

  // Ensure the endpoint starts with a slash if it doesn't already
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;

  // Set up default headers (e.g., Content-Type, Authorization)
  const headers = new Headers(fetchOptions.headers);
  
  headers.set('Accept', 'application/json');
  
  // Add ngrok skip warning header for ngrok URLs
  if (env.apiUrl.includes('ngrok-free.dev')) {
    headers.set('ngrok-skip-browser-warning', 'true');
  }

  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Add an auth token if required and available
  if (requireAuth) {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
    mode: 'cors',
    credentials: 'include',
    referrerPolicy: 'no-referrer',
  };

  try {
    const response = await fetch(url, config);

    // Handle HTTP errors
    if (!response.ok) {
      // Try to parse error message from backend if it exists
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.msg) errorMessage = errorData.msg;
        else if (errorData.message) errorMessage = errorData.message;
      } catch (e) {
        // Ignore JSON parse errors for error responses
      }
      throw new Error(errorMessage);
    }

    // Return JSON or null if no content
    if (response.status === 204) return null;
    return await response.json();
    
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error(`[Network Error] ${fetchOptions.method || 'GET'} ${url}: The request was blocked or the server is unreachable. This is often caused by CORS issues, an inactive ngrok tunnel, or a missing browser warning bypass.`);
      throw new Error('Network error: Unable to reach the server. Please check your connection or the backend status.');
    }
    console.error(`[API Error] ${fetchOptions.method || 'GET'} ${url}:`, error);
    throw error;
  }
}

// Export convenient methods for common HTTP verbs
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions): Promise<T> => 
    fetchWithConfig(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data: any, options?: FetchOptions): Promise<T> => 
    fetchWithConfig(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),

  postFormData: <T>(endpoint: string, data: FormData, options?: FetchOptions): Promise<T> => 
    fetchWithConfig(endpoint, { ...options, method: 'POST', body: data }),

  put: <T>(endpoint: string, data: any, options?: FetchOptions): Promise<T> => 
    fetchWithConfig(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),

  patch: <T>(endpoint: string, data: any, options?: FetchOptions): Promise<T> => 
    fetchWithConfig(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),

  delete: <T>(endpoint: string, options?: FetchOptions): Promise<T> => 
    fetchWithConfig(endpoint, { ...options, method: 'DELETE' }),
};
