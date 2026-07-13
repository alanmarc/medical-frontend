import type { UseFetchOptions } from '#app';

export function useApi() {
  /**
   * Realiza una petición imperativa mediante el proxy de Nitro de forma segura.
   * Útil para acciones del usuario (enviar formularios, botones, etc.).
   */
  function fetchApi<T>(path: string, options?: Record<string, unknown>) {
    const cleanPath = path.replace(/^\//, '');
    return $fetch<T>(`/api/proxy/${cleanPath}`, options);
  }

  /**
   * Composable reactivo que envuelve `useFetch` de Nuxt apuntando al proxy de Nitro.
   * Mantiene soporte completo de Server-Side Rendering (SSR) y deshidratación de estado.
   */
  function useFetchApi<T>(path: string, options: UseFetchOptions<T> = {}) {
    const cleanPath = path.replace(/^\//, '');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return useFetch(`/api/proxy/${cleanPath}`, options as any) as any;
  }

  return {
    fetchApi,
    useFetchApi,
  };
}
