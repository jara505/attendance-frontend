import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../features/auth/components/AuthLayout";
import LoginForm from "../features/auth/components/LoginForm";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLoginSuccess = (role, mustChangePassword) => {
    login(role, mustChangePassword);
    const destination = mustChangePassword ? "/change-password" : from;
    navigate(destination, { replace: true });
  };

  return (
    <AuthLayout
      title="CatsiVard"
      subtitle="Ingresa tus credenciales para continuar"
    >
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}
