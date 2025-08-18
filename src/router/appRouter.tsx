import Home from "@/pages/user/Home";
import Login from "@/pages/auth/Login";
import Landing from "@/pages/user/Landing";
import Register from "@/pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Error404 from "@/pages/common/Error404";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/dminLayout";
import { createBrowserRouter } from "react-router-dom";
import AdminDashboard from "@/pages/admin/AdminDashboard";

const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        children: [
            { path: '/', element: <Landing /> },
            { path: 'register', element: <Register /> },
            { path: '/login', element: <Login /> },
            { path: '/admin/login', element: <AdminLogin /> },
            { path: '*', element: <Error404 /> },
        ]
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { path: "login", element: <AdminLogin /> },
            {
                path: "dashboard",
                element: (
                    // <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                    // </ProtectedRoute>
                ),
            },
        ],
    },
])

export default appRouter