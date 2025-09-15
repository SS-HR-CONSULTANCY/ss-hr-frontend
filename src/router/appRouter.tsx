import { lazy } from "react";
import AboutUs from "@/pages/user/AboutUs";
import ProtectedRoute from "./ProtectedRoute";
import { createBrowserRouter } from "react-router-dom";
import { adminApplicationRoutes, services, userApplicationRoutes } from "@/utils/constants";

const Otp = lazy(() => import("@/pages/auth/Otp"));
const Home = lazy(() => import("@/pages/user/Home"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Landing = lazy(() => import("@/pages/user/Landing"));
const Register = lazy(() => import("@/pages/auth/Register"));
const UserJobs = lazy(() => import("@/pages/user/UserJobs"));
const ChatPage = lazy(() => import("@/pages/common/ChatPage"));
const Error404 = lazy(() => import("@/pages/common/Error404"));
const AdminLogin = lazy(() => import("@/pages/auth/AdminLogin"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const ContactPage = lazy(() => import("@/pages/user/ContactPage"));
const UserProfile = lazy(() => import("@/pages/user/UserProfile"));
const AdminReports = lazy(() => import("@/pages/admin/AdminReports"));
const AdminOverview = lazy(() => import("@/pages/admin/AdminOverview"));
const AdminJobsPage = lazy(() => import("@/pages/admin/AdminJobsPage"));
const AdminPackages = lazy(() => import("@/pages/admin/AdminPackages"));
const AdminPayments = lazy(() => import("@/pages/admin/AdminPayments"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const ToursAndTravels = lazy(() => import("@/pages/user/ToursAndTravels"));
const DashboardLayout = lazy(() => import("@/pages/common/DashboardLayout"));
const AdminApplications = lazy(() => import("@/pages/admin/AdminApplications"));
const AdminTestimonials = lazy(() => import("@/pages/admin/AdminTestimonials"));
const ServiceDetailedContent = lazy(() => import("@/components/sections/ServiceDetailedContent"));

const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        children: [
            { path: '/', element: <Landing /> },
            { path: '/toursandtravels', element: <ToursAndTravels /> },
            { path: '/contact', element: <ContactPage /> },
            { path: '/aboutUs', element: <AboutUs /> },
            { path: "/visaservice", element: <ServiceDetailedContent {...services.find((s) => s.id === "visaservice")!} /> },
            { path: "/ticketservice", element: <ServiceDetailedContent {...services.find((s) => s.id === "ticketservice")!} /> },
            { path: "/certificationservice", element: <ServiceDetailedContent {...services.find((s) => s.id === "certificationservice")!} /> },
            { path: "/medicalrecruit", element: <ServiceDetailedContent {...services.find((s) => s.id === "medicalrecruitservice")!} /> },
            { path: "/cvwriting", element: <ServiceDetailedContent {...services.find((s) => s.id === "cvwritingservice")!} /> },
            { path: "/webdevelopment", element: <ServiceDetailedContent {...services.find((s) => s.id === "webdevelopment")!} /> },
            { path: "/labourservices", element: <ServiceDetailedContent {...services.find((s) => s.id === "laboursupplyservice")!} /> },
            { path: '*', element: <Error404 /> },
        ]
    },
    { path: 'register', element: <Register /> },
    { path: 'login', element: <Login /> },
    { path: 'verifyOtp', element: <Otp /> },
    { path: 'admin/login', element: <AdminLogin /> },
    {
        path: '/user',
        element: <DashboardLayout showMobileScreenWarning={false} routes={userApplicationRoutes} />,
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
                path: "applications",
                element: (
                    <ProtectedRoute requiredRole={["user"]}>
                        <AdminApplications />
                    </ProtectedRoute>
                ),
            },
            {
                path: "chat",
                element: (
                    <ProtectedRoute requiredRole={["user"]}>
                        <ChatPage />
                    </ProtectedRoute>
                ),
            },
            { path: "*", element: <Error404 /> }
        ]
    },
    {
        path: "/admin",
        element: <DashboardLayout showMobileScreenWarning={true} routes={adminApplicationRoutes} />,
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
                path: "jobs",
                element: (
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <AdminJobsPage />
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
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <ChatPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "testimonials",
                element: (
                    <ProtectedRoute requiredRole={["admin", "superAdmin"]}>
                        <AdminTestimonials />
                    </ProtectedRoute>
                ),
            },
            {
                path: "reports",
                element: (
                    <ProtectedRoute requiredRole={["superAdmin"]}>
                        <AdminReports />
                    </ProtectedRoute>
                ),
            },
            {
                path: "settings",
                element: (
                    <ProtectedRoute requiredRole={["superAdmin"]}>
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