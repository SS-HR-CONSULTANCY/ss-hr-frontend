import {
  services,
  SEO_DATA,
  userApplicationRoutes,
  adminApplicationRoutes,
} from "@/utils/constants";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import { createBrowserRouter, Navigate } from "react-router-dom";

const OtpPage = lazy(() => import("@/pages/auth/OtpPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const UserJobs = lazy(() => import("@/pages/user/UserJobs"));
const VisaStatus = lazy(() => import("@/pages/user/VisaStatus"));
const TicketStatus = lazy(() => import("@/pages/user/TicketStatus"));
const TourPackageStatus = lazy(() => import("@/pages/user/TourPackageStatus"));
const JobHuntingPackageStatus = lazy(() => import("@/pages/user/JobHuntingPackageStatus"));
const HomePage = lazy(() => import("@/pages/common/HomePage"));
const ChatPage = lazy(() => import("@/pages/common/ChatPage"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));

const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const AboutUsPage = lazy(() => import("@/pages/common/AboutUsPage"));
const ContactPage = lazy(() => import("@/pages/common/ContactPage"));
const AdminOverview = lazy(() => import("@/pages/admin/AdminOverview"));
const AdminJobsPage = lazy(() => import("@/pages/admin/AdminJobsPage"));
const AdminPackages = lazy(() => import("@/pages/admin/AdminPackages"));
const AdminPayments = lazy(() => import("@/pages/admin/AdminPayments"));
const LandingLayout = lazy(() => import("@/pages/common/LandingLayout"));
const EmailVerifyPage = lazy(() => import("@/pages/auth/EmailVerifyPage"));
const JobDetailsPage = lazy(() => import("@/pages/common/JobDetailsPage"));
const UserApplications = lazy(() => import("@/pages/user/UserApplications"));
const DashboardLayout = lazy(() => import("@/pages/common/DashboardLayout"));
const AdminUserDetails = lazy(() => import("@/pages/admin/AdminUserDetails"));
const AdminApplications = lazy(() => import("@/pages/admin/AdminApplications"));
const AdminEnquiries = lazy(() => import("@/pages/admin/AdminEnquiries"));
const AdminWhatsappEnquiries = lazy(() => import("@/pages/admin/AdminWhatsappEnquiries"));
const AdminAccounts = lazy(() => import("@/pages/admin/AdminAccounts"));
const AdminTestimonials = lazy(() => import("@/pages/admin/AdminTestimonials"));
const UpdatePasswordPage = lazy(
  () => import("@/pages/auth/UpdatePasswordPage"),
);
const ToursAndTravelsPage = lazy(
  () => import("@/pages/common/ToursAndTravelsPage"),
);
const ServicesPage = lazy(() => import("@/pages/common/ServicesPage"));
const RouteErrorBoundary = lazy(
  () => import("@/components/common/RouteErrorBoundary"),
);
const ApplicationDetailsPage = lazy(
  () => import("@/pages/common/ApplicationDetailsPage"),
);
const ServiceDetailedContent = lazy(
  () => import("@/components/sections/ServiceDetailedContent"),
);

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/toursandtravels", element: <ToursAndTravelsPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/aboutUs", element: <AboutUsPage /> },
      { path: "/services", element: <ServicesPage /> },
      {
        path: "/visaservice",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "visaservice")!}
            seoData={SEO_DATA.VISA_SERVICE}
          />
        ),
      },
      {
        path: "/ticketservice",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "ticketservice")!}
            seoData={SEO_DATA.TICKET_SERVICE}
          />
        ),
      },
      {
        path: "/certificationservice",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "certificationservice")!}
            seoData={SEO_DATA.CERTIFICATION_SERVICE}
          />
        ),
      },
      {
        path: "/medicalrecruit",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "medicalrecruitservice")!}
            seoData={SEO_DATA.MEDICAL_RECRUIT}
          />
        ),
      },
      {
        path: "/cvwriting",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "cvwritingservice")!}
            seoData={SEO_DATA.CV_WRITING}
          />
        ),
      },
      {
        path: "/webdevelopment",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "webdevelopment")!}
            seoData={SEO_DATA.WEB_DEVELOPMENT}
          />
        ),
      },
      {
        path: "/labourservices",
        element: (
          <ServiceDetailedContent
            {...services.find((s) => s.id === "laboursupplyservice")!}
            seoData={SEO_DATA.LABOUR_SERVICES}
          />
        ),
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },

  { path: "verify-otp", element: <OtpPage /> },
  { path: "verify-email", element: <EmailVerifyPage /> },
  { path: "update-password", element: <UpdatePasswordPage /> },
  { path: "admin/login", element: <LoginPage role="admin" /> },
  { path: "login", element: <LoginPage role="user" /> },
  {
    path: "/user",
    element: (
      <DashboardLayout
        showMobileScreenWarning={false}
        routes={userApplicationRoutes}
      />
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredRole={["user"]}>
            <VisaStatus />
          </ProtectedRoute>
        ),
      },
      {
        path: "visa-status",
        element: (
          <ProtectedRoute requiredRole={["user"]}>
            <VisaStatus />
          </ProtectedRoute>
        ),
      },
      {
        path: "ticket-status",
        element: (
          <ProtectedRoute requiredRole={["user"]}>
            <TicketStatus />
          </ProtectedRoute>
        ),
      },
      {
        path: "tour-package-status",
        element: (
          <ProtectedRoute requiredRole={["user"]}>
            <TourPackageStatus />
          </ProtectedRoute>
        ),
      },
      {
        path: "job-hunting-package-status",
        element: (
          <ProtectedRoute requiredRole={["user"]}>
            <JobHuntingPackageStatus />
          </ProtectedRoute>
        ),
      },
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
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="overview" replace />,
      },
      {
        path: "overview",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <AdminOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/:id",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <AdminUserDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "jobs",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <AdminJobsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "jobs/:id",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <JobDetailsPage isAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "packages",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <AdminPackages showButton />
          </ProtectedRoute>
        ),
      },
      {
        path: "applications",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <AdminApplications />
          </ProtectedRoute>
        ),
      },
      {
        path: "enquiries",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <AdminEnquiries />
          </ProtectedRoute>
        ),
      },
      {
        path: "whatsapp-enquiries",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <AdminWhatsappEnquiries />
          </ProtectedRoute>
        ),
      },
      {
        path: "accounts",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <AdminAccounts />
          </ProtectedRoute>
        ),
      },

      {
        path: "applications/:id",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <ApplicationDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "payments",
        element: (
          <ProtectedRoute requiredRole={["admin"]}>
            <AdminPayments />
          </ProtectedRoute>
        ),
      },

    ],
  },
]);

export default appRouter;
