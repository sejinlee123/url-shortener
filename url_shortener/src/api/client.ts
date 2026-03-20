export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";
export const apiConfigured = !!API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_URL is not set; API calls will fail.");
}

export interface ShortenResponse {
  short_url: string;
}

export interface StatsResponse {
  visit_count: number;
  original_url: string;
}

export interface ApiError extends Error {
  status?: number;
  body?: unknown;
}

function createApiError(
  message: string,
  status?: number,
  body?: unknown,
): ApiError {
  const err = new Error(message) as ApiError;
  err.status = status;
  err.body = body;
  return err;
}

export async function shortenUrl(longUrl: string): Promise<ShortenResponse> {
  if (!API_BASE_URL) {
    throw createApiError("API base URL is not configured");
  }

  const response = await fetch(`${API_BASE_URL}/api/shorten`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({long_url: longUrl}),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    let body: unknown = undefined;
    let message = `Request failed with status ${response.status}`;

    try {
      if (contentType.includes("application/json")) {
        body = await response.json();
        const asRecord = body as Record<string, unknown>;
        const maybeMsg =
          (asRecord.error as string | undefined) ??
          (asRecord.message as string | undefined);
        if (maybeMsg) {
          message = maybeMsg;
        }
      } else {
        const text = await response.text();
        body = text;
        if (text) {
          message = text;
        }
      }
    } catch {}

    throw createApiError(message, response.status, body);
  }

  const data = (await response.json()) as ShortenResponse;
  if (!data.short_url) {
    throw createApiError("No short_url in response", response.status);
  }
  return data;
}

export async function fetchStats(code: string): Promise<StatsResponse> {
  if (!API_BASE_URL) {
    throw createApiError("API base URL is not configured");
  }

  const response = await fetch(`${API_BASE_URL}/api/stats/${code}`);
  if (!response.ok) {
    let message = "Failed to fetch stats";
    try {
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const body = (await response.json()) as Record<string, unknown>;
        const maybeMsg =
          (body.error as string | undefined) ??
          (body.message as string | undefined);
        if (maybeMsg) {
          message = maybeMsg;
        }
      } else {
        const text = await response.text();
        if (text) {
          message = text;
        }
      }
    } catch {}
    throw createApiError(message, response.status);
  }
  return (await response.json()) as StatsResponse;
}

export function buildRedirectUrl(code: string): string | null {
  if (!code) return null;

  if (API_BASE_URL) {
    return `${API_BASE_URL}/api/${code}`;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/r/${code}`;
  }

  return null;
}
