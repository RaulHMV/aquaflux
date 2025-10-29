// ==========================================
// USER TYPES AND INTERFACES
// ==========================================

export interface User extends UserPayload {
  id_user: number;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface UserPayload {
  username: string;
  first_name: string; // Solo primer nombre, no apellido
  password: string;
}

export interface UserLoginPayload {
  username: string;
  password: string;
}

export interface UserWithToken {
  user: Omit<User, 'password'>;
  token: string;
}

export interface UserAttributes {
  id_user: number;
  username: string;
  first_name: string;
  password_hash: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}
