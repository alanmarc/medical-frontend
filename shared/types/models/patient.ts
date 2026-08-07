export interface Patient {
  id?: number | string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  blood_type?: string;
  allergies?: string[];
  medical_history?: string;
  created_at?: string;
  updated_at?: string;
}
