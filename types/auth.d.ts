declare module '#auth-utils' {
  interface User {
    email: string;
    token: string;
    role: string;
    name: string;
    permissions: string[];
  }
}

export {};
