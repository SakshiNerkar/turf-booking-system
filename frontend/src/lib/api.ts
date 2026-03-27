// Used by client-side apiFetch — goes through Next.js rewrite proxy
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

// Used by server components for direct backend calls (bypasses proxy)
export const SERVER_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export type ApiResponse<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: { message: string; code?: string; details?: unknown }; status: number };

export async function apiFetch<T>(
  path: string,
  opts?: { method?: string; body?: unknown; token?: string },
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: opts?.method ?? "GET",
      headers: {
        "content-type": "application/json",
        ...(opts?.token ? { authorization: `Bearer ${opts.token}` } : {}),
      },
      body: opts?.body ? JSON.stringify(opts.body) : undefined,
      cache: "no-store",
    });

    const status = res.status;
    // Try to parse JSON; if the server crashed it may return HTML
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      return { ...json, status } as ApiResponse<T>;
    } catch {
      // Non-JSON response (e.g. server 502/504 proxy error)
      return {
        ok: false,
        status,
        error: {
          message: `Server returned non-JSON response (HTTP ${res.status}).`,
          code: "BAD_GATEWAY",
        },
      };
    }
  } catch (err: any) {
    // Network error — backend not running
    if (
      err?.name === "TypeError" ||
      err?.message?.includes("fetch") ||
      err?.message?.includes("ECONNREFUSED") ||
      err?.message?.includes("Failed to fetch") ||
      err?.message?.includes("network")
    ) {
      return {
        ok: false,
        status: 0,
        error: {
          message: `Cannot connect to backend (${API_BASE_URL}).`,
          code: "NETWORK_ERROR",
        },
      };
    }
    return {
      ok: false,
      status: 0,
      error: {
        message: err?.message ?? "Unknown network error",
        code: "NETWORK_ERROR",
      },
    };
  }
}
