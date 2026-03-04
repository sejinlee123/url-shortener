const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

if (!API_BASE_URL) {
  // In production we expect this to be set via environment.
  // Leaving this as a runtime error makes configuration issues obvious.
  console.error("VITE_API_URL is not set; API calls will fail.");
}

export interface ShortenResponse {
  short_url: string;
}

export interface StatsResponse {
  visit_count: number;
  original_url: string;
}

export async function shortenUrl(longUrl: string): Promise<ShortenResponse> {
  const response = await fetch(`${API_BASE_URL}/api/shorten`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({long_url: longUrl}),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as ShortenResponse;
  if (!data.short_url) {
    throw new Error("No short_url in response");
  }
  return data;
}

export async function fetchStats(code: string): Promise<StatsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/stats/${code}`);
  if (!response.ok) {
    throw new Error("Stats not found");
  }
  return (await response.json()) as StatsResponse;
}

export function buildRedirectUrl(code: string): string {
  return `${API_BASE_URL}/api/${code}`;
}

