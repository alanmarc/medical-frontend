import type { UserAuth } from './models/user_auth';

/**
 * Tipos para la respuesta del backend de AdonisJS en el endpoint de login.
 */
export interface BackendLoginResponse {
  status: string;
  message?: string;
  data: {
    token: string;
    user?: Partial<UserAuth>;
    role?: string;
    permissions?: string[];
  };
}

/**
 * Tipado del usuario almacenado en la sesión encriptada de nuxt-auth-utils.
 * Debe alinearse con la interface User declarada en types/auth.d.ts.
 */
export type SessionUser = UserAuth & { token: string };
