export interface User {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  avatar?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
