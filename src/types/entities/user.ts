export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: Role
  isVerified: boolean;
  isBlocked?: boolean;
  profileImg: string;
  verificationToken: string;
  otp: string;
  createdAt: string;
  updatedAt: string;
}

export type Role = 'user' | 'admin' | "superAdmin";