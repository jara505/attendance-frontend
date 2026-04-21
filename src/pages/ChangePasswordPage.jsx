import { useNavigate } from 'react-router-dom';
import AuthLayout from '../features/auth/components/AuthLayout';
import ForceChangePassword from '../features/auth/components/ForceChangePassword';
import { useAuth } from '../context/AuthContext';

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleComplete = () => {
    login(user.role, false);
    localStorage.setItem('must_change_password', 'false');
    navigate('/dashboard', { replace: true });
  };

  return (
    <AuthLayout title="CatsiVard" subtitle="Cambio de Contraseña">
      <ForceChangePassword onComplete={handleComplete} />
    </AuthLayout>
  );
}
