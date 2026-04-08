import { useState } from 'react';
import Input from './Input';
import Button from './Button';

const LoginForm = ({ onLoginSuccess, onGoToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {

            const response = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            setLoading(false);

            if (!response.ok) {
                setError("Credenciales incorrectas");
                return;
            }

        
            localStorage.setItem("token", data.access_token);

        
            const role = data.role;

        
            onLoginSuccess(role, false);

        } catch (err) {
            setLoading(false);
            setError("No se pudo conectar con el servidor");
        }
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

            <div className="text-center flex flex-col gap-2">
                <p className="text-slate-400 text-sm">
                    ¿Eres nuevo? Usa el correo de la institución.
                </p>

                <p className="text-slate-400 text-sm">
                    ¿No tienes cuenta?{" "}
                    <button
                        type="button"
                        onClick={onGoToRegister}
                        className="text-blue-400 font-medium hover:underline"
                    >
                        Regístrate
                    </button>
                </p>
            </div>

        </form>
    );
};

export default LoginForm;
