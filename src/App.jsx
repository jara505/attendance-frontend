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
            title={
                view === 'register'
                    ? "Crear Cuenta"
                    : view === 'change-password'
                        ? "Seguridad"
                        : "CatsiVard"
            }
            subtitle={
                view === 'register'
                    ? "Únete al sistema de asistencia"
                    : view === 'change-password'
                        ? "Actualiza tu acceso"
                        : view === 'dashboard'
                            ? "Panel de control"
                            : "Ingresa tus credenciales"
            }
        >

            {/* LOGIN */}
            {view === 'login' && (
                <LoginForm
                    onLoginSuccess={(role, mustChange) => {

                        setUserRole(role);

                        // Si el usuario debe cambiar contraseña
                        if (mustChange) {
                            setView('change-password');
                            return;
                        }

                        // Si no necesita cambiar contraseña
                        setView('dashboard');
                    }}
                    onGoToRegister={() => setView('register')}
                />
            )}

            {/* REGISTRO */}
            {view === 'register' && (
                <RegisterForm onBackToLogin={() => setView('login')} />
            )}

            {/* CAMBIO DE CONTRASEÑA OBLIGATORIO */}
            {view === 'change-password' && (
                <ForceChangePassword
                    onComplete={() => {

                        // Marcar que ya cambió la contraseña
                        localStorage.setItem("must_change_password", "false");

                        // Ir al dashboard
                        setView('dashboard');
                    }}
                />
            )}

            {/* DASHBOARD */}
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
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            localStorage.removeItem("must_change_password");
                            setView('login');
                        }}
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
