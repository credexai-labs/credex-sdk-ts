/**
 * CredExClient — main entry point for the TypeScript SDK.
 */

import { ClientConfig } from './types/common';
import { ExchangeModule } from './exchange';
import { MarketplaceModule } from './marketplace';
import { ServicesModule } from './services';
import { DerivativesModule } from './derivatives';
import { LendingModule } from './lending';
import { StakingModule } from './staking';
import { AnalyticsModule } from './analytics';
import { GovernanceModule } from './governance';

const DEFAULT_BASE_URL = 'https://credexai.live/api';
const DEFAULT_TIMEOUT = 30_000;

export class CredExError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'CredExError';
  }
}

export class CredExClient {
  private baseUrl: string;
  private apiKey?: string;
  private token?: string;
  private timeout: number;

  public readonly exchange: ExchangeModule;
  public readonly marketplace: MarketplaceModule;
  public readonly services: ServicesModule;
  public readonly derivatives: DerivativesModule;
  public readonly lending: LendingModule;
  public readonly staking: StakingModule;
  public readonly analytics: AnalyticsModule;
  public readonly governance: GovernanceModule;

  constructor(config: ClientConfig = {}) {
    this.baseUrl = (config.baseUrl ?? process.env.CREDEX_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.apiKey = config.apiKey ?? process.env.CREDEX_API_KEY;
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;

    this.exchange = new ExchangeModule(this);
    this.marketplace = new MarketplaceModule(this);
    this.services = new ServicesModule(this);
    this.derivatives = new DerivativesModule(this);
    this.lending = new LendingModule(this);
    this.staking = new StakingModule(this);
    this.analytics = new AnalyticsModule(this);
    this.governance = new GovernanceModule(this);
  }

  /** Authenticate with email/password and store the JWT token. */
  async login(email: string, password: string): Promise<Record<string, unknown>> {
    const body = new URLSearchParams({ username: email, password });
    const data = await this.request<Record<string, unknown>>('POST', '/auth/login', {
      body: body.toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    this.token = data.access_token as string;
    return data;
  }

  /** Get the WebSocket URL for a given path. */
  getWsUrl(path: string): string {
    const url = new URL(this.baseUrl);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${url.origin}/ws${path}`;
  }

  // ── Low-level HTTP ──────────────────────────────────────────────────

  private getHeaders(extra?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = { Accept: 'application/json', ...extra };
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
    if (this.apiKey) headers['X-API-Key'] = this.apiKey;
    return headers;
  }

  async request<T = unknown>(
    method: string,
    path: string,
    options: {
      body?: string | Record<string, unknown>;
      params?: Record<string, string | number | undefined>;
      headers?: Record<string, string>;
    } = {},
  ): Promise<T> {
    let url = `${this.baseUrl}${path}`;

    // Append query params
    if (options.params) {
      const qs = new URLSearchParams();
      for (const [k, v] of Object.entries(options.params)) {
        if (v !== undefined) qs.set(k, String(v));
      }
      const qsStr = qs.toString();
      if (qsStr) url += `?${qsStr}`;
    }

    const isJson = typeof options.body === 'object' && options.body !== null;
    const fetchHeaders = this.getHeaders(options.headers);
    if (isJson) fetchHeaders['Content-Type'] = 'application/json';

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const resp = await fetch(url, {
        method,
        headers: fetchHeaders,
        body: isJson ? JSON.stringify(options.body) : (options.body as string | undefined),
        signal: controller.signal,
      });

      if (!resp.ok) {
        let detail: string;
        try {
          const errBody = await resp.json();
          detail = (errBody as Record<string, string>).detail ?? JSON.stringify(errBody);
        } catch {
          detail = await resp.text();
        }
        throw new CredExError(detail, resp.status);
      }

      if (resp.status === 204) return undefined as T;
      return (await resp.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }

  async get<T = unknown>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
    return this.request<T>('GET', path, { params });
  }

  async post<T = unknown>(path: string, body?: Record<string, unknown>): Promise<T> {
    return this.request<T>('POST', path, { body });
  }

  async put<T = unknown>(path: string, body?: Record<string, unknown>): Promise<T> {
    return this.request<T>('PUT', path, { body });
  }

  async delete<T = unknown>(path: string): Promise<T> {
    return this.request<T>('DELETE', path);
  }
}
