import { User } from "./User";

export interface AdminLoginResponse {
    token: string;
    user: User;
  }