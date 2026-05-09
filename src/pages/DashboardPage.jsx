import { useNavigate } from "react-router-dom";

import AcademicDashboard from "../components/AcademicManagement/AcademicDashboard";
import StudentDashboard from "../components/AcademicManagement/StudentDashboard";

import { useAuth } from "../context/useAuth";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔥 DASHBOARD SEGÚN ROL
  if (user?.role === "STUDENT") {
    return (
      <StudentDashboard
        userRole={user?.role}
        onLogout={handleLogout}
      />
    );
  }

  // 🔥 DOCENTES Y ADMIN
  return (
    <AcademicDashboard
      userRole={user?.role}
      onLogout={handleLogout}
    />
  );
}
