import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

/**
 * Tracks page views on every route change.
 * Place this hook inside a component that is rendered within RouterProvider context.
 */
const usePageTracking = (): void => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
};

export default usePageTracking;
