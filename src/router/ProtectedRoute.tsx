import React from "react";
import Loading from "@/pages/common/LoadingPage";
import { useAppSelector } from "../hooks/redux";
import { Navigate, useLocation } from "react-router-dom";
import type { ProtectedRouteProps } from "@/types/componentTypes/routerTypes";
import LoginPrompt from "@/components/common/LoginPrompt";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    if (location.pathname.startsWith("/ss-hr-admin")) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (location.pathname.includes("/jobs") || location.pathname.includes("/user")) {
        return <LoginPrompt />;
    }

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let isAllowed = true;
  if (requiredRole && user?.role) {
    isAllowed = requiredRole.includes(user.role);
    
    if (location.pathname.startsWith("/ss-hr-admin") && (user.role === "admin" || user.role === "staff")) {
      const pathParts = location.pathname.split('/');
      // Get the last part of the path, or handle nested paths if needed
      const routePath = pathParts[pathParts.length - 1] === "ss-hr-admin" ? "overview" : pathParts[2]; // assuming /ss-hr-admin/route
      
      const isSuperAdmin = user.role === "admin" && user.email === "tony";
      const hasPermission = user.permissions?.includes("all") || (user.permissions && user.permissions.includes(routePath));
      
      isAllowed = isSuperAdmin || !!hasPermission;
    }
  }

  if (requiredRole && user?.role && !isAllowed) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.598 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this route.
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
