/**
 * Safe fetch helper that handles HTML error pages, non-JSON responses,
 * timeouts, and network failures gracefully with clear error messages.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options: RequestInit,
  timeoutMs = 60000
): Promise<{ success: boolean; data?: T; error?: string }> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(id);

    const contentType = response.headers.get("content-type") || "";
    const rawText = await response.text();

    // If server returned HTML (e.g. 504 Gateway Timeout, 502 Bad Gateway, 500 Nginx HTML page)
    if (rawText.trim().startsWith("<") || rawText.includes("<!DOCTYPE") || rawText.includes("<!doctype") || !contentType.includes("application/json")) {
      if (response.status === 504 || response.status === 408) {
        return {
          success: false,
          error: "Waktu permintaan habis (Gateway Timeout). Server AI sedang memproses data yang cukup besar, silakan coba lagi.",
        };
      }
      if (response.status === 502 || response.status === 503) {
        return {
          success: false,
          error: "Server backend atau gateway sedang sibuk (502/503). Silakan klik 'Coba Lagi'.",
        };
      }
      return {
        success: false,
        error: `Server mengembalikan respons tak terduga (Status ${response.status}). Silakan coba klik 'Coba Lagi'.`,
      };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return {
        success: false,
        error: "Gagal memproses data JSON dari server. Silakan coba lagi.",
      };
    }

    if (!response.ok || (parsed && parsed.success === false) || parsed.error) {
      const errMsg = parsed.error || `Terjadi kesalahan (Status ${response.status}).`;
      return {
        success: false,
        error: errMsg,
      };
    }

    return {
      success: true,
      data: parsed.data !== undefined ? parsed.data : parsed,
    };
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === "AbortError") {
      return {
        success: false,
        error: "Permintaan memakan waktu terlalu lama (Timeout). Silakan coba lagi beberapa saat lagi.",
      };
    }
    return {
      success: false,
      error: err.message || "Gagal menghubungi server. Periksa koneksi internet Anda.",
    };
  }
}
