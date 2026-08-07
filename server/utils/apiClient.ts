import type { H3Event } from 'h3';
import type { UserAuth } from '~~/shared/types/models/user_auth';

/**
 * Helper centralizado para realizar peticiones autenticadas hacia la API externa de AdonisJS.
 * Extrae de forma transparente el Bearer token almacenado en la cookie encriptada de sesión.
 */
export async function apiFetch<T>(
  event: H3Event,
  path: string,
  opts: Record<string, unknown> = {},
): Promise<T> {
  // 1. Obtener la sesión del usuario desencriptada en servidor
  const session = await getUserSession(event);
  const sessionUser = session?.user as UserAuth | undefined;

  if (!sessionUser?.token) {
    throw createError({ statusCode: 401, statusMessage: 'No autenticado. Por favor, inicia sesión.' });
  }

  // 3. Formatear la URL de destino
  const runtimeConfig = useRuntimeConfig(event);
  const apiBase = (runtimeConfig.public.apiBase || 'http://localhost:3001/api').replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const targetUrl = `${apiBase}${cleanPath}`;

  // 4. Inyectar cabecera Authorization con el Bearer token
  const headers = {
    'Content-Type': 'application/json',
    ...((opts.headers as Record<string, string>) || {}),
    'Authorization': `Bearer ${sessionUser.token}`,
  };

  try {
    return await $fetch<T>(targetUrl, { ...opts, headers });
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; _data?: { message?: string } } };
    const statusCode = err.response?.status || 500;
    const statusMessage = err.response?._data?.message || 'Error en la comunicación con el servidor de base de datos.';

    throw createError({
      statusCode,
      statusMessage,
    });
  }
}
