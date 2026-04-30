import React, { useEffect, useState } from 'react';
import SessionCards from './SessionCards'; 

const AcademicDashboard = ({ userRole = 'teacher', onLogout }) => {
  const [classes, setClasses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch classes and profile in parallel
        const [classesResponse, profileResponse] = await Promise.all([
          fetch("/api/v1/academic/my-classes", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch("/api/v1/profile/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
          })
        ]);

        // Process classes
        if (classesResponse.ok) {
          const classesData = await classesResponse.json();
          const formattedClasses = classesData.classes.map(cls => ({
            status: cls.status === "ACTIVE" ? "activa" : "próxima",
            career: cls.course,
            career_id: cls.course,
            subject: cls.subject,
            subject_id: cls.id_class,
            time: `${cls.start_time} - ${cls.end_time}`,
            group: cls.group,
            group_id: cls.group,
            class_id: cls.id_class,
            starts_in: cls.remaining_minutes ? `${cls.remaining_minutes} min` : null
          }));
          setClasses(formattedClasses);
        } else {
          setError("No se pudieron cargar las clases");
        }

        // Process profile
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
        }

        setLoading(false);
      } catch {
        setError("Error de conexión con el servidor");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoleLabel = (role) => {
    const roles = {
      'TEACHER': 'Docente',
      'STUDENT': 'Estudiante',
      'ADMIN': 'Administrador'
    };
    return roles[role] || role;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08060d] flex items-center justify-center">
        <p className="text-white text-xl animate-pulse">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#08060d] bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/5 text-white p-4 md:p-10 font-sans">
      
      {/* Header */}
      <header className="flex items-center justify-between pb-8 border-b border-gray-800 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Catsi<span className="text-blue-500">Vard</span>
          </h1>
          <p className="text-gray-400 mt-1">Gestión Académica • Panel del {getRoleLabel(profile?.role || userRole)}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="font-semibold text-sm">Bienvenido, {profile?.first_name} {profile?.last_name}</p>
            <p className="text-xs text-blue-400 font-mono uppercase">Rol: {profile?.role || userRole}</p>
          </div>

          <button 
            onClick={onLogout}
            className="text-xs text-gray-500 hover:text-red-400 transition font-medium border border-gray-800 px-4 py-2 rounded-full bg-[#13111a]"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main>
        {/* Banner de Bienvenida */}
        <div className="mb-10 p-6 bg-blue-950/20 border border-blue-900 rounded-2xl">
            <h2 className="text-2xl font-bold">Tus Clases</h2>
            <p className="text-blue-300 text-sm mt-1">
              {classes.length > 0 
                ? `Tienes ${classes.length} sesiones programadas.` 
                : "No hay clases programadas por ahora."}
            </p>
        </div>

        {error ? (
          <div className="p-10 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <SessionCards classes={classes} />
        )}
      </main>

      <footer className="mt-20 pt-8 border-t border-gray-800 text-center text-xs text-gray-600">
        © 2026 CatsiVard System • Professional Edition
      </footer>
    </div>
  );
};

export default AcademicDashboard;
