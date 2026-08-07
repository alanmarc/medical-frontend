export default defineEventHandler(async (event) => {
  // 1. Obtener la sesión del usuario
  const session = await getUserSession(event);

  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado. Por favor, inicia sesión.',
    });
  }

  // 2. Extraer ruta de destino
  const path = event.context.params?.path || '';
  const runtimeConfig = useRuntimeConfig(event);
  const apiBase = runtimeConfig.public.apiBase || 'http://localhost:3001/api';
  const targetUrl = `${apiBase}/${path}`;

  // 3. Realizar el proxying transparente (soporta JSON, multipart/form-data uploads y streaming)
  const user = session.user as { token: string };

  return proxyRequest(event, targetUrl, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
});
