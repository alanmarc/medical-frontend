export interface UserAuth {
  id?: number | string;
  email: string;
  name: string;
  role: string;
  permissions?: string[];
  token?: string;
  created_at?: string;
  updated_at?: string;
}
