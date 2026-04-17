import React, { useState } from 'react';
import AuthLayout from './features/auth/components/AuthLayout';
import LoginForm from './features/auth/components/LoginForm';
import ForceChangePassword from './features/auth/components/ForceChangePassword';
import RegisterForm from './features/auth/components/RegisterForm';

// CORRECCIÓN CRÍTICA DE RUTA: 
// Según tu explorador es: src -> components -> AcademicManagement (Carpeta) -> AcademicDashboard.jsx
import AcademicDashboard from './components/AcademicManagement/AcademicDashboard.jsx';

function App() {
    const [view, setView] = useState('login');
    const [userRole, setUserRole] = useState(localStorage.getItem("role") || '');

    // 1. Si es DASHBOARD, se sale del flujo centrado para ocupar TODA LA WEB
    if (view === 'dashboard') {
        return (
            <AcademicDashboard 
                userRole={userRole} 
                onLogout={() => {
                    localStorage.clear();
                    setView('login');
                }} 
            />
        );
    }

    // 2. Para Login/Registro usamos el AuthLayout que ya corregimos con fondo total
    return (
        <AuthLayout
            title={
                view === 'register' ? "Crear Cuenta" : 
                view === 'change-password' ? "Seguridad" : "CatsiVard"
            }
            subtitle={
                view === 'register' ? "Únete al sistema de asistencia" : 
                view === 'change-password' ? "Actualiza tu acceso" : "Ingresa tus credenciales"
            }
        >
            {view === 'login' && (
                <LoginForm
                    onLoginSuccess={(role, mustChange) => {
                        setUserRole(role);
                        if (mustChange) {
                            setView('change-password');
                            return;
                        }
                        setView('dashboard');
                    }}
                    onGoToRegister={() => setView('register')}
                />
            )}

            {view === 'register' && (
                <RegisterForm onBackToLogin={() => setView('login')} />
            )}

            {view === 'change-password' && (
                <ForceChangePassword
                    onComplete={() => {
                        localStorage.setItem("must_change_password", "false");
                        setView('dashboard');
                    }}
                />
            )}
        </AuthLayout>
    );
}

export default App;