import React, { useState } from "react";
import Input from "./Input.jsx";
import Button from "./Button.jsx";

const ForceChangePassword = ({ onComplete }) => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!currentPass) {
      setError("Debes ingresar tu contraseña actual");
      return;
    }

    if (newPass.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPass !== confirmPass) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/v1/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPass,
          new_password: newPass,
        }),
      });

      const data = await response.json();

      setLoading(false);

      if (!response.ok) {
        setError(data.message || "No se pudo cambiar la contraseña");
        return;
      }

      // Si todo salió bien
      onComplete();
    } catch {
      setLoading(false);
      setError("No se pudo conectar con el servidor");
    }
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
        label="Contraseña Actual"
        type="password"
        value={currentPass}
        onChange={(e) => setCurrentPass(e.target.value)}
      />

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

      <Button type="submit" loading={loading}>
        Actualizar Acceso
      </Button>
    </form>
  );
};

export default ForceChangePassword;
