import type { Role } from "../entities/user";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role[];
}