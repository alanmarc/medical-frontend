interface LoginResponse {
  status: string;
  message?: string;
  data: {
    token: string;
  };
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El correo y la contraseña son obligatorios.',
    });
  }

  const runtimeConfig = useRuntimeConfig(event);
  const apiBase = runtimeConfig.public.apiBase || 'http://localhost:3001/api';

  try {
    // 1. Llamar al backend de AdonisJS con tipado explícito
    const response = await $fetch<LoginResponse>(`${apiBase}/login`, {
      method: 'POST',
      body: {
        email: body.email,
        password: body.password,
      },
    });

    // 2. Verificar la respuesta del API
    if (response && response.status === 'success') {
      const tokenData = response.data; // Contiene { token: 'oat_...' }

      // 3. Guardar la sesión encriptada en Nuxt
      await setUserSession(event, {
        user: {
          email: body.email,
          token: tokenData.token, // Guardamos el token para peticiones futuras
          role: 'admin', // De momento mockeamos el rol. Puedes expandirlo al retornar datos de usuario desde tu API.
          name: body.email.split('@')[0], // Nombre temporal derivado del correo
        },
        loggedInAt: new Date(),
      });

      return { success: true, message: 'Sesión iniciada correctamente' };
    } else {
      throw createError({
        statusCode: 401,
        statusMessage: response?.message || 'Credenciales inválidas',
      });
    }
  } catch (error: unknown) {
    console.error('Error en login.post.ts:', error);

    const err = error as { response?: { status?: number; _data?: { message?: string } } };
    // Si la llamada al backend falló con respuesta HTTP error (ej: 401)
    const statusCode = err.response?.status || 500;
    const statusMessage = err.response?._data?.message || 'Error de conexión con el servidor de base de datos.';

    throw createError({
      statusCode,
      statusMessage,
    });
  }
});
