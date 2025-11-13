import {
  services,
  userApplicationRoutes,
  adminApplicationRoutes,
} from "@/utils/constants";
import { lazy } from "react";
import AboutUs from "@/pages/user/AboutUs";
import ProtectedRoute from "./ProtectedRoute";
import EmailVerify from "@/pages/auth/EmailVerify";
import { createBrowserRouter } from "react-router-dom";

const Otp = lazy(() => import("@/pages/auth/Otp"));
const Home = lazy(() => import("@/pages/user/Home"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Landing = lazy(() => import("@/pages/user/Landing"));
const Register = lazy(() => import("@/pages/auth/Register"));
const UserJobs = lazy(() => import("@/pages/user/UserJobs"));
const ChatPage = lazy(() => import("@/pages/common/ChatPage"));
const Error404 = lazy(() => import("@/pages/common/Error404"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const ContactPage = lazy(() => import("@/pages/user/ContactPage"));
const UserProfile = lazy(() => import("@/pages/user/UserProfile"));
const AdminReports = lazy(() => import("@/pages/admin/AdminReports"));
const AdminOverview = lazy(() => import("@/pages/admin/AdminOverview"));
const AdminJobsPage = lazy(() => import("@/pages/admin/AdminJobsPage"));
const AdminPackages = lazy(() => import("@/pages/admin/AdminPackages"));
const AdminPayments = lazy(() => import("@/pages/admin/AdminPayments"));
const UpdatePassword = lazy(() => import("@/pages/auth/UpdatePassword"));
// const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const ToursAndTravels = lazy(() => import("@/pages/user/ToursAndTravels"));
const JobDetailsPage = lazy(() => import("@/pages/common/JobDetailsPage"));
const UserApplications = lazy(() => import("@/pages/user/UserApplications"));
const DashboardLayout = lazy(() => import("@/pages/common/DashboardLayout"));
const AdminUserDetails = lazy(() => import("@/pages/admin/AdminUserDetails"));
const AdminApplications = lazy(() => import("@/pages/admin/AdminApplications"));
const AdminTestimonials = lazy(() => import("@/pages/admin/AdminTestimonials"));
const ApplicationDetails = lazy(() => import("@/pages/common/ApplicationDetails"));
const ServiceDetailedContent = lazy(() => import("@/components/sections/ServiceDetailedContent"));

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/toursandtravels", element: <ToursAndTravels /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/aboutUs", element: <AboutUs /> },
      {
        path: "/visaservice",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "visaservice")!}
          />
        ),
      },
      {
        path: "/ticketservice",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "ticketservice")!}
          />
        ),
      },
      {
        path: "/certificationservice",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "certificationservice")!}
          />
        ),
      },
      {
        path: "/medicalrecruit",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "medicalrecruitservice")!}
          />
        ),
      },
      {
        path: "/cvwriting",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "cvwritingservice")!}
          />
        ),
      },
      {
        path: "/webdevelopment",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "webdevelopment")!}
          />
        ),
      },
      {
        path: "/labourservices",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "laboursupplyservice")!}
          />
        ),
      },
      { path: "*", element: <Error404 /> },
    ],
  },
  { path: "register", element: <Register /> },
  { path: "verify-otp", element: <Otp /> },
  { path: "verify-email", element: <EmailVerify /> },
  { path: "update-password", element: <UpdatePassword /> },
  { path: "ss-hr-admin/login", element: <Login role="admin" /> },
  { path: "ss-hr-system-admin/login", element: <Login role="systemAdmin" /> },
  { path: "login", element: <Login role="user" /> },
  {
    path: "/user",
    element: (
      <DashboardLayout
        showMobileScreenWarning={false}
        routes={userApplicationRoutes}
      />
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredRole={["user"]}>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute requiredRole={["user"]}>
            <UserProfile />
          </ProtectedRoute>
        ),
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
        path: "jobs/:id",
        element: (
          <ProtectedRoute requiredRole={["user"]}>
            <JobDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "applications",
        element: (
          <ProtectedRoute requiredRole={["user"]}>
            <UserApplications />
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
      { path: "*", element: <Error404 /> },
    ],
  },
  {
    path: "/ss-hr-admin",
    element: (
      <DashboardLayout
        showMobileScreenWarning={true}
        routes={adminApplicationRoutes}
      />
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
            <AdminOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: "overview",
        element: (
          <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
            <AdminOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
            <AdminUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id",
        element: (
          <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
            <AdminUserDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "jobs",
        element: (
          <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
            <AdminJobsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "jobs/:id",
        element: (
          <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
            <JobDetailsPage isAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "packages",
        element: (
          <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
            <AdminPackages showButton />
          </ProtectedRoute>
        ),
      },
      {
        path: "applications",
        element: (
          <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
            <AdminApplications />
          </ProtectedRoute>
        ),
      },
      {
        path: "applications/:id",
        element: (
          <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
            <ApplicationDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "payments",
        element: (
          <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
            <AdminPayments />
          </ProtectedRoute>
        ),
      },
      {
        path: "chat",
        element: (
          <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "testimonials",
        element: (
          <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
            <AdminTestimonials />
          </ProtectedRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
            <AdminReports />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "settings",
      //   element: (
      //     <ProtectedRoute requiredRole={["admin", "systemAdmin"]}>
      //       <AdminSettings />
      //     </ProtectedRoute>
      //   ),
      // },
      { path: "*", element: <Error404 /> },
    ],
  },
  { path: "*", element: <Error404 /> },
]);

export default appRouter;
