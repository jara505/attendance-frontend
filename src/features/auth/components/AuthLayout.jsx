// envolvera el login y el registro 
import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        // Contenedor principal: Ocupa toda la pantalla y centra el contenido
        <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-blue-900 p-4">

            {/* Card del Formulario: Glassmorphism suave con Tailwind v4 */}
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden">

                <div className="p-8">
                    {/* Encabezado dinámico */}
                    <header className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            {title}
                        </h1>
                        <p className="text-slate-300 mt-2">
                            {subtitle}
                        </p>
                    </header>

                    {/* Aquí se inyectará el formulario de Login o Registro */}
                    {children}
                </div>

                {/* Footer opcional del card */}
                <footer className="bg-white/5 p-4 text-center border-t border-white/10">
                    <p className="text-xs text-slate-400">
                        © 2026 CatsiVard System • Professional Edition
                    </p>
                </footer>
            </div>
        </main>
    );
};

export default AuthLayout;
