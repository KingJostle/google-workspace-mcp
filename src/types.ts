// Account Types
export interface Account {
  email: string;
  category: string;
  description: string;
  auth_status?: {
    has_token: boolean;
    scopes?: string[];
    expires?: number;
  };
}

export interface AccountsConfig {
  accounts: Account[];
}

// Token Types
export interface TokenData {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
  last_refresh: number;
}

// OAuth Config Types
export interface OAuthConfig {
  client_id: string;
  client_secret: string;
  auth_uri: string;
  token_uri: string;
}

// Authentication Types
export interface GoogleAuthParams {
  email: string;
  category?: string;
  description?: string;
  required_scopes: string[];
  auth_code?: string;
}

// API Request Types
export interface GoogleApiRequestParams extends GoogleAuthParams {
  api_endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
}

// API Response Types
export type GoogleApiResponse = 
  | {
      status: 'success';
      data?: any;
      message?: string;
    }
  | {
      status: 'auth_required';
      auth_url: string;
      message?: string;
      instructions: string;
    }
  | {
      status: 'refreshing';
      message: string;
    }
  | {
      status: 'error';
      error: string;
      message?: string;
      resolution?: string;
    };

// Error Types
export class GoogleApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly resolution?: string
  ) {
    super(message);
    this.name = 'GoogleApiError';
  }
}

// Utility Types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ApiRequestParams {
  endpoint: string;
  method: HttpMethod;
  params?: Record<string, any>;
  token: string;
}
// Add this to the end of your tools/types.ts file

// Contact Types
/**
 * Parameters for searching contacts
 * @property email - Google account email
 * @property personFields - Comma-separated fields to include in response
 * @property query - Optional search query string
 * @property pageSize - Optional maximum number of contacts to return
 * @property pageToken - Optional token for pagination
 * @property readMask - Optional read mask to limit returned fields
 */
export interface SearchContactsParams extends BaseToolArguments {
  personFields: string;
  query?: string;  // Optional - this fixes the type error
  pageSize?: number;
  pageToken?: string;
  readMask?: string;
}
