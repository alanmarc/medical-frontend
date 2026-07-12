export function useAuth() {
  const { user, loggedIn, clear, fetch } = useUserSession();

  function hasRole(roleName: string): boolean {
    return user.value?.role === roleName;
  }

  function hasPermission(permissionName: string): boolean {
    if (!user.value) return false;
    // Si el rol es admin, tiene todos los permisos
    if (user.value.role === 'admin') return true;
    return user.value.permissions?.includes(permissionName) || false;
  }

  async function logout() {
    try {
      await clear();
      navigateTo('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  return {
    user,
    loggedIn,
    hasRole,
    hasPermission,
    logout,
    fetchSession: fetch,
  };
}
