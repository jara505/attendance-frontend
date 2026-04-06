import React, { useState } from 'react';
import Input from './Input.jsx';
import Button from "./Button.jsx";

const ForceChangePassword = ({ onComplete }) => {
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPass.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return;
        }
        if (newPass !== confirmPass) {
            setError("Las contraseñas no coinciden");
            return;
        }
        onComplete();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
                <p className="text-sm text-amber-200 text-center font-medium">
                    ⚠️ Primer inicio de sesión detectado.
                </p>
                <p className="text-xs text-slate-400 text-center mt-1">
                    Por reglas de negocio, debes actualizar tu contraseña ahora.
                </p>
            </div>

            <Input
                label="Nueva Contraseña"
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
            />
            <Input
                label="Confirmar Contraseña"
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                error={error}
            />

            <Button type="submit">Actualizar Acceso</Button>
        </form>
    );
};

export default ForceChangePassword;
