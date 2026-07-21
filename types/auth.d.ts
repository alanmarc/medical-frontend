declare module '#auth-utils' {
  interface User {
    email: string;
    token: string;
    role: string;
    name: string;
    permissions: string[];
  }
}

declare module '#app' {
  interface PageMeta {
    auth?: 'public' | 'guest' | 'protected';
    permissions?: string[];
  }
}

export {};
