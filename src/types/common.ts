/** Common types shared across SDK modules. */

export interface ClientConfig {
  /** API key for authentication. Falls back to CREDEX_API_KEY env var. */
  apiKey?: string;
  /** Base URL for the CredEx API. Defaults to https://credexai.live/api */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 30000. */
  timeout?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
}
