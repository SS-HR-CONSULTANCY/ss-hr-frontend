import type { Route } from "../commonTypes";

export interface DashboardLayoutProps {
  showMobileScreenWarning: boolean;
  routes: Route[];
  showHeader?: boolean;
}
