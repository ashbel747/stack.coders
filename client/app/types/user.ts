export interface User {
  _id: string;
  name: string;
  description: string;
  email: string;
  phone?: string;       
  skills: string[];     
  avatar?: string;
  role: string; 
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
