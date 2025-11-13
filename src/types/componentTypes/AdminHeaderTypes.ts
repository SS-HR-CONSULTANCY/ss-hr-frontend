import type { User } from "../entities/user";

export interface DashboardHeaderProps {
  user: Partial<User> | null;
}
