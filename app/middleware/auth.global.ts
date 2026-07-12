export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn, hasPermission } = useAuth();

  // 1. Proteger rutas privadas (cualquiera que empiece con /app)
  if (to.path.startsWith('/app') && !loggedIn.value) {
    return navigateTo('/login');
  }

  // 2. Proteger rutas de invitado (login o registro) si ya está autenticado
  if ((to.path === '/login' || to.path === '/register') && loggedIn.value) {
    return navigateTo('/app/dashboard');
  }

  // 3. Control de acceso basado en permisos (RBAC)
  if (loggedIn.value) {
    const requiredPermissions = to.meta.permissions as string[] | undefined;

    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAccess = requiredPermissions.every(p => hasPermission(p));

      // Si no tiene los permisos requeridos, redirigir al dashboard principal
      if (!hasAccess) {
        console.warn(`Acceso denegado a la ruta ${to.path} por falta de permisos.`);
        return navigateTo('/app/dashboard');
      }
    }
  }
});
