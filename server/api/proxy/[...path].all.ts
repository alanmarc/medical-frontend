export default defineEventHandler(async (event) => {
  // 1. Obtener la sesión del usuario
  const session = await getUserSession(event);

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado. Por favor, inicia sesión.',
    });
  }

  // 2. Extraer parámetros y ruta de destino
  const path = event.context.params?.path || '';
  const runtimeConfig = useRuntimeConfig(event);
  const apiBase = runtimeConfig.public.apiBase || 'http://localhost:3001/api';
  const targetUrl = `${apiBase}/${path}`;

  // 3. Obtener metadatos de la petición original
  const method = getMethod(event);
  const query = getQuery(event);

  let body = null;
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    try {
      body = await readBody(event);
    } catch {
      // Ignorar si la petición no tiene cuerpo
    }
  }

  // 4. Realizar la petición forwarding al backend de AdonisJS
  const user = session.user as { token: string };
  const safeFetch = $fetch as (url: string, options?: Record<string, unknown>) => Promise<unknown>;

  try {
    return await safeFetch(targetUrl, {
      method,
      query,
      body,
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; _data?: { message?: string } } };
    const statusCode = err.response?.status || 500;
    const statusMessage = err.response?._data?.message || 'Error en la comunicación con el servidor de base de datos.';

    throw createError({
      statusCode,
      statusMessage,
    });
  }
});
