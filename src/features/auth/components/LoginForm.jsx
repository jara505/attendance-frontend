import { useState } from 'react';
import Input from './Input';
import Button from './Button';

// 1. AGREGAMOS onGoToRegister AQUÍ ABAJO
const LoginForm = ({ onLoginSuccess, onGoToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            if (email === 'nuevo@attendance.com') {
                onLoginSuccess('alumno', true);
                return;
            }
            if (email === 'admin@attendance.com' && password === '123456') {
                onLoginSuccess('admin', false);
                return;
            }
            setError('Credenciales incorrectas. Intenta con nuevo@attendance.com');
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
                label="Email"
                type="email"
                placeholder="usuario@attendance.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
            />

            <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" loading={loading}>
                Iniciar Sesión
            </Button>

            {/* 2. AGREGAMOS EL BLOQUE DE REGISTRO AQUÍ */}
            <div className="text-center flex flex-col gap-2">
                <p className="text-slate-400 text-sm">
                    ¿Eres nuevo? Usa el correo de la institución.
                </p>
                <p className="text-slate-400 text-sm">
                    ¿No tienes cuenta? <button type="button" onClick={onGoToRegister} className="text-blue-400 font-medium hover:underline">Regístrate</button>
                </p>
            </div>
        </form>
    );
};

export default LoginForm;
