export type Gender = "male" | "female" | "other";
export type Role = "user" | "admin" | "superAdmin" | "systemAdmin";

export interface User {
  _id: string;
  serialNumber: string;
  fullName: string;
  email: string;
  role: Role;
  isVerified: boolean;
  isBlocked: boolean;
  profileImage: string;
  verificationToken: string;
  otp: string;
  phone: string;
  phoneTwo: string;
  googleId: string;
  gender: Gender;
  nationality: string;
  linkedInUsername?: string;
  portfolioUrl?: string;
  dob: string;
  professionalStatus: string;
  createdAt: string;
  updatedAt: string;
}