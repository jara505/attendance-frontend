import React, { useState } from 'react';
import AuthLayout from './features/auth/components/AuthLayout';
import LoginForm from './features/auth/components/LoginForm';
// IMPORTA EL NUEVO DASHBOARD
import AcademicDashboard from './components/AcademicManagement/AcademicDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  // Simulación de login exitoso
  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    // NOTA: Aquí iría la lógica de 'must_change_password' si ya la tienes implementada.
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
  };

  // Muestra el módulo de Gestión Académica si está logueado
  if (isLoggedIn) {
    return (
      <AcademicDashboard 
        userRole={userRole} 
        onLogout={handleLogout} 
      />
    );
  }

  // Muestra el Login por defecto
  return (
    <AuthLayout title="CatsiVard" subtitle="Gestión Académica">
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </AuthLayout>
  );
}

export default App;