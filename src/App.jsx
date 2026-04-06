import React, { useState } from 'react';
import AuthLayout from './features/auth/components/AuthLayout';
import LoginForm from './features/auth/components/LoginForm';
import ForceChangePassword from './features/auth/components/ForceChangePassword';
import RegisterForm from './features/auth/components/RegisterForm';

function App() {
  const [view, setView] = useState('login');
  const [userRole, setUserRole] = useState(''); 

  return (
    <AuthLayout 
      title={view === 'register' ? "Crear Cuenta" : (view === 'change-password' ? "Seguridad" : "Attendance System")} 
      subtitle={view === 'register' ? "Únete al sistema de asistencia" : (view === 'change-password' ? "Actualiza tu acceso" : "Ingresa tus credenciales")}
    >
      
      {view === 'login' && (
        <LoginForm 
          onLoginSuccess={(role, mustChange) => {
            setUserRole(role); 
            if (mustChange) setView('change-password');
            else setView('dashboard');
          }} 
          onGoToRegister={() => setView('register')}
        />
      )}

      {view === 'register' && (
        <RegisterForm onBackToLogin={() => setView('login')} />
      )}

      {view === 'change-password' && (
        <ForceChangePassword onComplete={() => setView('dashboard')} />
      )}

      {view === 'dashboard' && (
        <div className="flex flex-col items-center gap-4 py-8 animate-fade-in text-center">
          <h2 className="text-2xl font-bold text-white">¡Bienvenido!</h2>
          
          <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-blue-400 font-medium">
              Estás en el Panel de {userRole.toUpperCase()}
            </p>
          </div>

          <p className="text-slate-400 text-sm max-w-[250px]">
            Has superado todas las reglas de negocio y validaciones de seguridad.
          </p>

          <button 
            onClick={() => setView('login')} 
            className="text-sm text-blue-400 mt-6 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>
      )}
      
    </AuthLayout>
  );
}

export default App;