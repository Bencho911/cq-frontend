import { API_BASE_URL, KIOSK_API_KEY } from './env';

/** Error tipado del API con código de estado. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

/**
 * Wrapper `fetch` contra el API Gateway.
 * Añade `x-api-key` cuando hay una llave de kiosco configurada (pedidos sin JWT).
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers as Record<string, string> | undefined),
  };

  if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
  }
  if (KIOSK_API_KEY) {
    finalHeaders['x-api-key'] = KIOSK_API_KEY;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const json = (await res.json()) as { error?: string; message?: string };
      message = json.message || json.error || message;
    } catch {
      /* respuesta sin cuerpo JSON */
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
