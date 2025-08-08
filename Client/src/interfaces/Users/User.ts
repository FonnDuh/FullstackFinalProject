import type { UserName } from "./UserName";

export interface User {
  _id?: string;
  name: UserName;
  email: string;
  username: string;
  dateOfBirth?: string;
  password: string;
  image_url: string;
  isAdmin?: boolean;
  createdAt?: string;
  loginAttempts?: number;
  lockUntil?: Date;
}
