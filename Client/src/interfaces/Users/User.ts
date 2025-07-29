import type { UserImage } from "./UserImage";
import type { UserName } from "./UserName";

export interface User {
  _id?: string;
  name: UserName;
  email: string;
  username: string;
  dateOfBirth?: string;
  password: string;
  image: UserImage;
  isAdmin?: boolean;
  createdAt?: string;
  loginAttempts?: number;
  lockUntil?: Date;
}
