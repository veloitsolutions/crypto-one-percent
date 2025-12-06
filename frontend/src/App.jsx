

//App.jsx
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { Dashboard, Signup, Home, Login, AdminDashboard } from "./components/pages";
import Footer from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from './context/AuthContext';

function App() {
  
  return (
    <AuthProvider>
      <div className="page-container">
        <div className="content-wrap">
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole="Investor">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="Admin">
                    <div className="admin-only-layout">
                      <AdminDashboard />
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;