// types.ts
export interface RegisterData {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string; // Make sure this matches
}

export interface LoginData {
  email: string;
  password: string;
}
