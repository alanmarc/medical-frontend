export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();

  // 1. Proteger rutas privadas (cualquiera que empiece con /app)
  if (to.path.startsWith('/app') && !loggedIn.value) {
    return navigateTo('/login');
  }

  // 2. Proteger rutas de invitado (login o registro) si ya está autenticado
  if ((to.path === '/login' || to.path === '/register') && loggedIn.value) {
    return navigateTo('/app/dashboard');
  }
});
