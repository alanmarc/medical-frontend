export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, hasPermission } = useAuth();

  // Obtener la estrategia de autenticación definida en definePageMeta (por defecto: 'protected')
  const authStrategy = (to.meta.auth as 'public' | 'guest' | 'protected' | undefined) ?? 'protected';

  // 1. Rutas reservadas para invitados (ej: /login, /register)
  if (authStrategy === 'guest') {
    if (loggedIn.value) {
      return navigateTo('/app/dashboard');
    }
    return;
  }

  // 2. Rutas totalmente públicas (ej: landing page /, /terms)
  if (authStrategy === 'public') {
    return;
  }

  // 3. Rutas protegidas (por defecto todas las demás)
  if (!loggedIn.value) {
    const redirectQuery = to.fullPath !== '/' ? { redirect: to.fullPath } : undefined;
    return navigateTo({
      path: '/login',
      query: redirectQuery,
    });
  }

  // 4. Control de acceso basado en permisos (RBAC)
  const requiredPermissions = to.meta.permissions as string[] | undefined;

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAccess = requiredPermissions.every(p => hasPermission(p));

    if (!hasAccess) {
      console.warn(`[Auth] Acceso denegado a la ruta ${to.path} por falta de permisos.`);

      // Prevenir bucle de redirección infinito si la ruta destino desautorizada ya es el dashboard
      if (to.path === '/app/dashboard') {
        return createError({ statusCode: 403, statusMessage: 'Acceso No Autorizado' });
      }

      return navigateTo('/app/dashboard');
    }
  }
});
