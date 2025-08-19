export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin' | 'hr';
  isVerified: boolean;
  isActive?: boolean;
  profileImg: string;
  createdAt: string;
  updatedAt: string;
}