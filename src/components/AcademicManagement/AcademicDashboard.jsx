import React, { useEffect, useState } from 'react';

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

        // 🔥 MAPEO DEL BACKEND → UI
        const formattedClasses = data.classes.map(cls => ({
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
        setLoading(false);

      } catch (err) {
        setError("Error de conexión con el servidor");
        setLoading(false);
      }
    };

    fetchClasses();

  }, []);

  if (loading) {
    return <p className="text-white p-10">Cargando clases...</p>;
  }

  if (error) {
    return <p className="text-red-400 p-10">{error}</p>;
  }

  return (
    <div className="min-h-screen w-full bg-[#08060d] text-white p-4 md:p-10 font-sans">

      <header className="flex items-center justify-between pb-8 border-b border-gray-800 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Catsi<span className="text-blue-500">Vard</span>
          </h1>
          <p className="text-gray-400 mt-1">Gestión Académica • Panel del Docente</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-sm">Bienvenido, Docente</p>
            <p className="text-xs text-blue-400 font-mono uppercase">Rol: {userRole}</p>
          </div>

          <button 
            onClick={onLogout}
            className="text-xs text-gray-500 hover:text-red-400 transition font-medium border border-gray-800 px-3 py-1 rounded-full bg-[#13111a]"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main>
        <div className="mb-10 p-6 bg-blue-950/20 border border-blue-900 rounded-2xl">
            <h2 className="text-2xl font-bold">Mis Clases de Hoy</h2>
            <p className="text-blue-300 text-sm mt-1">Clases obtenidas desde el backend.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {classes.length === 0 && (
            <p className="text-slate-400">No tienes clases hoy</p>
          )}

          {classes.map((clase, index) => (
            <div 
              key={index} 
              className="relative bg-[#13111a] border border-gray-800 rounded-2xl p-7 shadow-2xl transition-all duration-300 hover:border-blue-700 group hover:-translate-y-1"
            >

              <div className="absolute top-6 right-7 flex items-center gap-2.5 bg-[#08060d] px-3 py-1.5 rounded-full border border-gray-800">
                <span className={`h-2.5 w-2.5 rounded-full ${clase.status === 'activa' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></span>
                <span className={`text-xs font-bold uppercase tracking-wider ${clase.status === 'activa' ? 'text-green-400' : 'text-orange-400'}`}>
                  {clase.status === 'activa' ? 'Clase Activa' : `Inicia en ${clase.starts_in || '-- min'}`}
                </span>
              </div>

              <div className="space-y-6 mt-6">
                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Materia</p>
                    <p className="text-2xl font-bold text-blue-100 group-hover:text-blue-400 transition">{clase.subject}</p>
                    <p className="text-xs text-blue-300/60 font-mono mt-1">ID: {clase.subject_id}</p>
                </div>

                <div className="border-t border-gray-800 pt-5">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Carrera</p>
                    <p className="text-lg font-semibold text-gray-200">{clase.career}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {clase.career_id}</p>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2 text-sm text-gray-300 bg-[#08060d] p-4 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-2.5">
                    <span className="font-medium text-gray-200">{clase.time}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-medium text-gray-200">{clase.group}</span>
                    <span className="text-xs text-gray-600 font-mono">({clase.group_id})</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800">
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition duration-150 shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                  Generar QR de Asistencia
                </button>
                <p className="text-center text-xs text-gray-700 font-mono mt-3">Class ID: {clase.class_id}</p>
              </div>
            </div>
          ))}

        </div>
      </main>

      <footer className="mt-20 pt-8 border-t border-gray-800 text-center text-xs text-gray-600">
        © 2026 CatsiVard System • Professional Edition
      </footer>
    </div>
  );
};

export default AcademicDashboard;