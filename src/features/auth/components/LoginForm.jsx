import { useState } from 'react';
import Input from './Input';
import Button from './Button';

const LoginForm = ({ onLoginSuccess }) => {
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password })
            });

            const data = await response.json();
            setLoading(false);

            if (!response.ok) {
                setError("Credenciales incorrectas");
                return;
            }

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("must_change_password", data.must_change_password);

            onLoginSuccess(data.role, data.must_change_password);
        } catch {
            setLoading(false);
            setError("No se pudo conectar con el servidor");
        }
    };

    return (
        /* ESTE DIV ES LA CLAVE: Ocupa todo el ancho y alto con el color de CatsiVard */
        <div className="min-h-screen w-full flex items-center justify-center bg-[#08060d] p-4">
            
            {/* El "Brillo" azul de fondo que Juan quiere ver */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-transparent pointer-events-none" />

            {/* Contenedor del Formulario (El cuadrito blanco/oscuro) */}
            <div className="relative z-10 w-full max-w-md bg-[#13111a] border border-gray-800 p-8 rounded-2xl shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">CatsiVard</h1>
                    <p className="text-gray-400 text-sm">Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="user@catsivard.edu"
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

                    <Button type="submit" loading={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition">
                        Iniciar Sesión
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;