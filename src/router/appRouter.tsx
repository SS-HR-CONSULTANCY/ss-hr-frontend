import Home from "@/pages/user/Home";
import Login from "@/pages/auth/Login";
import Landing from "@/pages/user/Landing";
import Register from "@/pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Error404 from "@/pages/common/Error404";
import AdminJobs from "@/pages/admin/AdminJobs";
import AdminChat from "@/pages/admin/AdminChat";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminReviews from "@/pages/admin/AdminReviews";
import { createBrowserRouter } from "react-router-dom";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminPackages from "@/pages/admin/AdminPackages";
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminCompanies from "@/pages/admin/AdminCompanies";
import AdminApplications from "@/pages/admin/AdminApplications";
import AdminReports from "@/pages/admin/AdminReports";

const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        children: [
            { path: '/', element: <Landing /> },
            { path: 'register', element: <Register /> },
            { path: 'login', element: <Login /> },
            { path: '/admin/login', element: <AdminLogin /> },
            { path: '*', element: <Error404 /> },
        ]
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { index: true,  element: (
                    // <ProtectedRoute requiredRole="admin">
                        <AdminOverview />
                    // </ProtectedRoute>
                ) },
            {
                path: "overview",
                element: (
                    // <ProtectedRoute requiredRole="admin">
                        <AdminOverview />
                    // </ProtectedRoute>
                ),
            },
            {
                path: "users",
                element: (
                    // <ProtectedRoute requiredRole="admin">
                        <AdminUsers />
                    // </ProtectedRoute>
                ),
            },
            {
                path: "companies",
                element: (
                    // <ProtectedRoute requiredRole="admin">
                        <AdminCompanies />
                    // </ProtectedRoute>
                ),
            },
            {
                path: "jobs",
                element: (
                    // <ProtectedRoute requiredRole="admin">
                        <AdminJobs />
                    // </ProtectedRoute>
                ),
            },
            {
                path: "packages",
                element: (
                    // <ProtectedRoute requiredRole="admin">
                        <AdminPackages />
                    // </ProtectedRoute>
                ),
            },
            {
                path: "applications",
                element: (
                    // <ProtectedRoute requiredRole="admin">
                        <AdminApplications />
                    // </ProtectedRoute>
                ),
            },
            {
                path: "payments",
                element: (
                    // <ProtectedRoute requiredRole="admin">
                        <AdminPayments />
                    // </ProtectedRoute>
                ),
            },
            {
                path: "chat",
                element: (
                    // <ProtectedRoute requiredRole="admin">
                        <AdminChat />
                    // </ProtectedRoute>
                ),
            },
            {
                path: "reviews",
                element: (
                    // <ProtectedRoute requiredRole="admin">
                        <AdminReviews />
                    // </ProtectedRoute>
                ),
            },
            {
                path: "reports",
                element: (
                    // <ProtectedRoute requiredRole="admin">
                        <AdminReports />
                    // </ProtectedRoute>
                ),
            },
            { path: '*', element: <Error404 /> },
        ],
    },
    { path: '*', element: <Error404 /> },
])

export default appRouter