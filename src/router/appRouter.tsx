import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";
import { applicationRoutes, services } from "@/utils/constants";

const Otp = lazy(() => import("@/pages/auth/Otp"));
const Home = lazy(() => import("@/pages/user/Home"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Landing = lazy(() => import("@/pages/user/Landing"));
const Register = lazy(() => import("@/pages/auth/Register"));
const UserJobs = lazy(() => import("@/pages/user/UserJobs"));
const Error404 = lazy(() => import("@/pages/common/Error404"));
const AdminJobs = lazy(() => import("@/pages/admin/AdminJobs"));
const AdminChat = lazy(() => import("@/pages/admin/AdminChat"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const ContactPage = lazy(() => import("@/pages/user/ContactPage"));
const UserProfile = lazy(() => import("@/pages/user/UserProfile"));
const AdminReviews = lazy(() => import("@/pages/admin/AdminReviews"));
const AdminReports = lazy(() => import("@/pages/admin/AdminReports"));
const AdminOverview = lazy(() => import("@/pages/admin/AdminOverview"));
const AdminPackages = lazy(() => import("@/pages/admin/AdminPackages"));
const AdminPayments = lazy(() => import("@/pages/admin/AdminPayments"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const AdminCompanies = lazy(() => import("@/pages/admin/AdminCompanies"));
const ToursAndTravels = lazy(() => import("@/pages/user/ToursAndTravels"));
const DashboardLayout = lazy(() => import("@/pages/common/DashboardLayout"));
const AdminApplications = lazy(() => import("@/pages/admin/AdminApplications"));
const ServiceDetailedContent = lazy(() => import("@/components/sections/ServiceDetailedContent"));

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
            { path: "/visaservice", element: <ServiceDetailedContent {...services.find((s) => s.id === "visaservice")!} /> },
            { path: "/ticketservice", element: <ServiceDetailedContent {...services.find((s) => s.id === "ticketservice")!} /> },
            { path: "/certificationservice", element: <ServiceDetailedContent {...services.find((s) => s.id === "certificationservice")!} /> },
            { path: "/medicalrecruit", element: <ServiceDetailedContent {...services.find((s) => s.id === "medicalrecruitservice")!} /> },
            { path: "/cvwriting", element: <ServiceDetailedContent {...services.find((s) => s.id === "cvwritingservice")!} /> },
            { path: "/webservice", element: <ServiceDetailedContent {...services.find((s) => s.id === "webservice")!} /> },
            { path: "/labourservices", element: <ServiceDetailedContent {...services.find((s) => s.id === "laboursupplyservice")!} /> },
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
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <AdminOverview />
                    </ProtectedRoute>
                )
            },
            {
                path: "overview",
                element: (
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <AdminOverview />
                    </ProtectedRoute>
                ),
            },
            {
                path: "users",
                element: (
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <AdminUsers />
                    </ProtectedRoute>
                ),
            },
            {
                path: "companies",
                element: (
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <AdminCompanies />
                    </ProtectedRoute>
                ),
            },
            {
                path: "jobs",
                element: (
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <AdminJobs showButton />
                    </ProtectedRoute>
                ),
            },
            {
                path: "packages",
                element: (
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <AdminPackages showButton />
                    </ProtectedRoute>
                ),
            },
            {
                path: "applications",
                element: (
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <AdminApplications />
                    </ProtectedRoute>
                ),
            },
            {
                path: "payments",
                element: (
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <AdminPayments />
                    </ProtectedRoute>
                ),
            },
            {
                path: "chat",
                element: (
                    // need to remove superAdmin for making chat with _id
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <AdminChat />
                    </ProtectedRoute>
                ),
            },
            {
                path: "reviews",
                element: (
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <AdminReviews />
                    </ProtectedRoute>
                ),
            },
            {
                path: "reports",
                element: (
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <AdminReports />
                    </ProtectedRoute>
                ),
            },
            {
                path: "settings",
                element: (
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
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