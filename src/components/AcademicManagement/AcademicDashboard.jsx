import React, { useEffect, useState } from 'react';
// Movimiento 1: Importar el componente de las nuevas cards
import SessionCards from './SessionCards'; 

const AcademicDashboard = ({ userRole = 'teacher', onLogout }) => {

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/v1/academic/my-classes", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          setError("No se pudieron cargar las clases");
          setLoading(false);
          return;
        }

        // Mapeo del Backend
        const formattedClasses = data.classes.map(cls => ({
          status: cls.status === "ACTIVE" ? "activa" : "próxima",
          career: cls.course,
          subject: cls.subject,
          subject_id: cls.id_class,
          time: `${cls.start_time} - ${cls.end_time}`,
          class_id: cls.id_class,
          starts_in: cls.remaining_minutes ? `${cls.remaining_minutes} min` : null
        }));

        setClasses(formattedClasses);
        setLoading(false);
      } catch {
        setError("Error de conexión con el servidor");
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return <p className="text-white p-10 font-mono">Cargando sistema de sesiones...</p>;
  }

  if (error) {
    return <p className="text-red-400 p-10 font-mono">{error}</p>;
  }

  return (
    <div className="min-h-screen w-full bg-[#08060d] text-white p-4 md:p-10 font-sans">

      <header className="flex items-center justify-between pb-8 border-b border-gray-800 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Catsi<span className="text-blue-500">Vard</span>
          </h1>
          <p className="text-gray-400 mt-1 uppercase text-[10px] font-black tracking-widest">Módulo de Sesiones • Panel del Docente</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="font-semibold text-sm">Bienvenido, Docente</p>
            <p className="text-xs text-blue-400 font-mono uppercase">Rol: {userRole}</p>
          </div>

          <button 
            onClick={onLogout}
            className="text-xs text-gray-500 hover:text-red-400 transition font-black border border-gray-800 px-4 py-2 rounded-xl bg-[#13111a]"
          >
            LOGOUT
          </button>
        </div>
      </header>

      <main>
        <div className="mb-10 p-6 bg-blue-950/10 border border-blue-900/30 rounded-2xl">
            <h2 className="text-2xl font-bold italic underline decoration-blue-500 underline-offset-8">Control de Asistencia</h2>
            <p className="text-gray-400 text-sm mt-3">Gestione las sesiones de clase y genere códigos QR para los estudiantes.</p>
        </div>

        {/* Movimiento 2: Reemplazo del mapeo anterior por el componente SessionCards */}
        <div className="mt-8">
            <SessionCards classes={classes} />
        </div>
        
      </main>

      <footer className="mt-20 pt-8 border-t border-gray-800 text-center">
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[5px]">CatsiVard System • v2.0</p>
      </footer>
    </div>
  );
};

export default AcademicDashboard;