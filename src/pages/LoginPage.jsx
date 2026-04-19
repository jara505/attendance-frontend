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
    navigate(from, { replace: true });
  };

  return (
    <AuthLayout title="CatsiVard" subtitle="Gestión Académica">
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}