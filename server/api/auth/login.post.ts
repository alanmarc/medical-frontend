interface LoginUser {
  email?: string;
  name?: string;
  role?: string;
  permissions?: string[];
}

interface LoginResponse {
  status: string;
  message?: string;
  data: {
    token: string;
    user?: LoginUser;
    role?: string;
    permissions?: string[];
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
      const tokenData = response.data;
      const apiUser = response.data.user;

      // Extraer rol, nombre y permisos dinámicamente desde el backend
      const userRole = apiUser?.role || response.data.role || 'user';
      const userName = apiUser?.name || body.email.split('@')[0];
      const userPermissions = apiUser?.permissions || response.data.permissions || [];

      // 3. Guardar la sesión encriptada en Nuxt
      await setUserSession(event, {
        user: {
          email: apiUser?.email || body.email,
          token: tokenData.token,
          role: userRole,
          name: userName,
          permissions: userPermissions,
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
