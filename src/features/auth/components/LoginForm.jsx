import { useState } from 'react';
import Input from './Input';
import Button from './Button';
import api from '@/config/axios';

const EMAIL_MAX_LENGTH = 254;
const PASSWORD_MAX_LENGTH = 128;

const sanitizeEmail = (email) => {
  return email.trim().toLowerCase();
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const LoginForm = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const form = e.target;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const sanitizedEmail = sanitizeEmail(email);

        if (password.length > PASSWORD_MAX_LENGTH) {
            setError(`La contraseña no puede exceder ${PASSWORD_MAX_LENGTH} caracteres`);
            return;
        }

        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', {
                email: sanitizedEmail,
                password: password
            });

            localStorage.setItem("token", data.access_token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("must_change_password", data.must_change_password);

            onLoginSuccess(data.role, data.must_change_password);
        } catch (err) {
            setLoading(false);
            setError(err.response?.status === 401 ? "Credenciales incorrectas" : "No se pudo conectar con el servidor");
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value.slice(0, EMAIL_MAX_LENGTH);
        setEmail(value);
        if (error) setError('');
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value.slice(0, PASSWORD_MAX_LENGTH);
        setPassword(value);
        if (error) setError('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
                label="Email"
                type="email"
                placeholder="user@catsivard.edu"
                value={email}
                onChange={handleEmailChange}
                error={error}
                maxLength={EMAIL_MAX_LENGTH}
                required
            />

            <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                maxLength={PASSWORD_MAX_LENGTH}
                required
            />

            <Button type="submit" loading={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition">
                Iniciar Sesión
            </Button>
        </form>
    );
};

export default LoginForm;