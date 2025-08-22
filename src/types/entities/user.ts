export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: Roles
  isVerified: boolean;
  isActive?: boolean;
  profileImg: string;
  verificationToken: string;
  otp: string;
  createdAt: string;
  updatedAt: string;
}

export type Roles = 'user' | 'admin' | 'subadmin' | "superAdmin";