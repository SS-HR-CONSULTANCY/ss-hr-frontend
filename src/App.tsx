import Home from "./pages/user/Home";
import { Login, Register } from "./pages";
import Error404 from "./pages/common/Error404";
import ThemeWrapper from "./utils/ThemeWrapper";
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./router/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <ThemeWrapper>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path='*' element={<Error404 />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeWrapper>
  );
};

export default App;