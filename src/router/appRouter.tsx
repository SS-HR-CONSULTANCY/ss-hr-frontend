import Otp from "@/pages/auth/Otp";
import Home from "@/pages/user/Home";
import Login from "@/pages/auth/Login";
import Landing from "@/pages/user/Landing";
import Register from "@/pages/auth/Register";
import Error404 from "@/pages/common/Error404";
import AdminJobs from "@/pages/admin/AdminJobs";
import AdminChat from "@/pages/admin/AdminChat";
import ProtectedRoute from "./ProtectedRoute";
import AdminUsers from "@/pages/admin/AdminUsers";
import ContactPage from "@/pages/user/ContactPage";
import UserProfile from "@/pages/user/UserProfile";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminReports from "@/pages/admin/AdminReports";
import { applicationRoutes } from "@/utils/constants";
import { createBrowserRouter } from "react-router-dom";
import AdminOverview from "@/pages/admin/AdminOverview";
import AdminPackages from "@/pages/admin/AdminPackages";
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminCompanies from "@/pages/admin/AdminCompanies";
import ToursAndTravels from "@/pages/user/ToursAndTravels";
import DashboardLayout from "@/pages/common/DashboardLayout";
import AdminApplications from "@/pages/admin/AdminApplications";
import UserJobs from "@/pages/user/UserJobs";

const adminRoutes = applicationRoutes.filter((route) =>
    route.roles.some(role => ["admin", "superAdmin"].includes(role))
);

const userRoutes = applicationRoutes.filter((route) =>
    route.roles.includes("user")
);

const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        children: [
            { path: '/', element: <Landing /> },
            { path: '/toursandtravels', element: <ToursAndTravels /> },
            { path: '/contact', element: <ContactPage /> },
            { path: '*', element: <Error404 /> },
        ]
    },
    { path: 'register', element: <Register /> },
    { path: 'login', element: <Login role="user" title="User Sign In" /> },
    { path: 'verifyOtp', element: <Otp /> },
    { path: 'admin/login', element: <Login role="admin" title="Admin Sign In" /> },
    { path: 'superAdmin/login', element: <Login role="superAdmin" title="Super Admin Sign In" /> },
    {
        path: '/user',
        element: <DashboardLayout showMobileScreenWarning={false} routes={userRoutes} />,
        children: [
            {
                index: true, element: (
                    <ProtectedRoute requiredRole={["user"]}>
                    <UserProfile />
                    </ProtectedRoute>
                )
            },
            {
                path: 'profile',
                element: (
                    <ProtectedRoute requiredRole={["user"]}>
                    <UserProfile />
                    </ProtectedRoute>
                )
            },
            {
                path: "jobs",
                element: (
                    <ProtectedRoute requiredRole={["user"]}>
                    <UserJobs />
                    </ProtectedRoute>
                ),
            },
            {
                path: "packages",
                element: (
                    <ProtectedRoute requiredRole={["user"]}>
                    <AdminPackages />
                    </ProtectedRoute>
                ),
            },
            {
                path: "applications",
                element: (
                    <ProtectedRoute requiredRole={["user"]}>
                    <AdminApplications />
                    </ProtectedRoute>
                ),
            },
            {
                path: "payments",
                element: (
                    <ProtectedRoute requiredRole={["user"]}>
                    <AdminPayments />
                    </ProtectedRoute>
                ),
            },
            {
                path: "chat",
                element: (
                    <ProtectedRoute requiredRole={["user"]}>
                    <AdminChat />
                    </ProtectedRoute>
                ),
            },
            { path: "*", element: <Error404 /> }
        ]
    },
    {
        path: "/admin",
        element: <DashboardLayout showMobileScreenWarning={true} routes={adminRoutes} />,
        children: [
            {
                index: true, element: (
                    <ProtectedRoute requiredRole={["admin","superAdmin"]}>
                    <AdminOverview />
                    </ProtectedRoute>
                )
            },
            {
                path: "overview",
                element: (
                    <ProtectedRoute requiredRole={["admin","superAdmin"]}>
                    <AdminOverview />
                    </ProtectedRoute>
                ),
            },
            {
                path: "users",
                element: (
                    <ProtectedRoute requiredRole={["admin","superAdmin"]}>
                    <AdminUsers />
                    </ProtectedRoute>
                ),
            },
            {
                path: "companies",
                element: (
                    <ProtectedRoute requiredRole={["admin","superAdmin"]}>
                    <AdminCompanies />
                    </ProtectedRoute>
                ),
            },
            {
                path: "jobs",
                element: (
                    <ProtectedRoute requiredRole={["admin","superAdmin"]}>
                    <AdminJobs showButton />
                    </ProtectedRoute>
                ),
            },
            {
                path: "packages",
                element: (
                    <ProtectedRoute requiredRole={["admin","superAdmin"]}>
                    <AdminPackages showButton />
                    </ProtectedRoute>
                ),
            },
            {
                path: "applications",
                element: (
                    <ProtectedRoute requiredRole={["admin","superAdmin"]}>
                    <AdminApplications />
                    </ProtectedRoute>
                ),
            },
            {
                path: "payments",
                element: (
                    <ProtectedRoute requiredRole={["admin","superAdmin"]}>
                    <AdminPayments />
                    </ProtectedRoute>
                ),
            },
            {
                path: "chat",
                element: (
                    // need to remove superAdmin for making chat with _id
                    <ProtectedRoute requiredRole={["admin","superAdmin"]}>
                    <AdminChat />
                    </ProtectedRoute>
                ),
            },
            {
                path: "reviews",
                element: (
                    <ProtectedRoute requiredRole={["admin","superAdmin"]}>
                    <AdminReviews />
                    </ProtectedRoute>
                ),
            },
            {
                path: "reports",
                element: (
                    <ProtectedRoute requiredRole={["admin","superAdmin"]}>
                    <AdminReports />
                    </ProtectedRoute>
                ),
            },
            {
                path: "settings",
                element: (
                    <ProtectedRoute requiredRole={["admin","superAdmin"]}>
                    <AdminSettings />
                    </ProtectedRoute>
                ),
            },
            { path: '*', element: <Error404 /> },
        ],
    },
    { path: '*', element: <Error404 /> },
])

export default appRouter