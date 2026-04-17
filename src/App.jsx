import React, { useState } from 'react';
import AuthLayout from './features/auth/components/AuthLayout';
import LoginForm from './features/auth/components/LoginForm';
import ForceChangePassword from './features/auth/components/ForceChangePassword';
import RegisterForm from './features/auth/components/RegisterForm';
// Si quieres usar tu Dashboard real, descomenta la siguiente línea:
// import AcademicManagement from './features/auth/components/AcademicManagement';

function App() {
    const [view, setView] = useState('login');
    const [userRole, setUserRole] = useState('');

    return (
        <div className="min-h-screen bg-[#08060d] flex items-center justify-center w-full">
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
                            if (mustChange) {
                                setView('change-password');
                                return;
                            }
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
                            localStorage.setItem("must_change_password", "false");
                            setView('dashboard');
                        }}
                    />
                )}

                {/* DASHBOARD (Aquí puedes poner tu AcademicManagement si prefieres) */}
                {view === 'dashboard' && (
                    <div className="flex flex-col items-center gap-4 py-8 animate-fade-in text-center">
                        <h2 className="text-2xl font-bold text-white">¡Bienvenido!</h2>

                        <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                            <p className="text-blue-400 font-medium">
                                Estás en el Panel de {userRole ? userRole.toUpperCase() : 'USUARIO'}
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
        </div>
    );
}

export default App;