import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../features/auth/components/AuthLayout';
import LoginForm from '../features/auth/components/LoginForm';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLoginSuccess = (role, mustChangePassword) => {
    login(role, mustChangePassword);
    const destination = mustChangePassword ? '/change-password' : from;
    navigate(destination, { replace: true });
  };

  return (
    <AuthLayout title="CatsiVard" subtitle="Gestión Académica">
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}