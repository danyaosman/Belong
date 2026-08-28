const API_URL =
  "https://spectrum-resize-nerd.ngrok-free.dev";

  export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string | null,
): Promise<T> {
    const headers = new Headers(
        options.headers
    );

    headers.set(
        "Content-Type",
        "application/json",
    );

    if (token) {
        headers.set(
            "Authorization",
            `Bearer ${token}`,
        );
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers,
        },
    );

    if(!response.ok) {
        const errorText =
        await response.text();

        throw new Error(
            errorText ||
            `Request failed: ${response.status}`,
        );
    }

    return response.json()
  }