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
  gender: string;
  nationality: string;
  linkedInUrl: string;
  portfolioUrl: string;
  dob: string;
  currentSalary: string;
  expectedSalary: string;
  immediateJoiner: boolean;
  noticePeriod: string;
  resumeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type Role = "user" | "admin" | "superAdmin" | "systemAdmin";

export type UserCareerData = Pick<User,"currentSalary">
