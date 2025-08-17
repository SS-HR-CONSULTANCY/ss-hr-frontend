import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Register } from "./pages";
import Home from "./pages/user/Home";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./router/ProtectedRoute";
import ThemeWrapper from "./utils/ThemeWrapper";
// import ProtectedRoute from "./components/common/ProtectedRoute";

const App = () => {
  return (
    <ThemeWrapper>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* <Route path='/admin/dashboard' element={<AdminDashboard />} /> */}
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