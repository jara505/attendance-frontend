import React, { useState } from 'react'; 
import Select from './Select';
import Input from './Input'; 
import Button from './button';

const RegisterForm = ({ onBackToLogin }) => {
  const [role, setRole] = useState('alumno');
  const [loading, setLoading] = useState(false);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Registro exitoso como ${role}`);
      onBackToLogin();
    }, 1500);
  };

  const roles = [
    { value: 'alumno', label: 'Soy Alumno' },
    { value: 'docente', label: 'Soy Docente' },
    { value: 'admin', label: 'Soy Administrador' }
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input label="Nombre Completo" placeholder="Ej. Juan Pérez" />
      <Input label="Email" type="email" placeholder="usuario@attendance.com" />
      
      <Select 
        label="Tipo de Usuario"
        options={roles}
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <Button type="submit" loading={loading}>
        Crear Cuenta
      </Button>

      <button 
        type="button" 
        onClick={onBackToLogin} 
        className="text-sm text-slate-400 hover:text-white underline"
      >
        Volver al Login
      </button>
    </form>
  );
};

export default RegisterForm;