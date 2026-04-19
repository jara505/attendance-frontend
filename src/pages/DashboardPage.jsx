import { useNavigate } from 'react-router-dom';
import AcademicDashboard from '../components/AcademicManagement/AcademicDashboard';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AcademicDashboard
      userRole={user?.role}
      onLogout={handleLogout}
    />
  );
}