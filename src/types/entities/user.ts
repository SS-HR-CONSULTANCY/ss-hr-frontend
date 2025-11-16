import type { GenderType, RoleType } from "@/utils/zod/commonZod";

export interface User {
  _id: string;
  serialNumber: string;
  fullName: string;
  email: string;
  role: RoleType;
  isVerified: boolean;
  isBlocked: boolean;
  profileImage: string;
  verificationToken: string;
  otp: string;
  phone: string;
  phoneTwo: string;
  googleId: string;
  gender: GenderType;
  nationality: string;
  linkedInUsername?: string;
  portfolioUrl?: string;
  dob: string;
  professionalStatus: string;
  resume?: File | string;
  createdAt: string;
  updatedAt: string;
}