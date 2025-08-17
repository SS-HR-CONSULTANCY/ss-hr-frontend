import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login, Register } from "./pages";
import Home from "./pages/user/Home";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
// import ProtectedRoute from "./components/common/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        {/* <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        /> */}
        
        {/* Redirect old admin routes */}
        <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;