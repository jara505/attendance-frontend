import React, { useEffect, useState } from "react";
import SessionCards from "./SessionCards";
import api from "../../config/axios";
import UserAvatar from "./UserAvatar";

const AcademicDashboard = ({ userRole = "teacher", onLogout }) => {
  const [classes, setClasses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionDate, setSessionDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classes and profile in parallel
        const [classesResponse, profileResponse] = await Promise.all([
          api.get("/academic/my-classes"),
          api.get("/profile/me"),
        ]);

        // Process classes
        if (classesResponse.status === 200) {
          const classesData = classesResponse.data;
          // Guardar la fecha de las clases del backend
          setSessionDate(classesData.date || "");

          const formattedClasses = classesData.classes.map((cls) => ({
            // Estado temporal de la clase (future/past/active) — normalizado a lowercase
            status: cls.status ? String(cls.status).toLowerCase() : null,
            start_time: cls.start_time || null,
            end_time: cls.end_time || null,
            career: cls.course,
            career_id: cls.course,
            subject: cls.subject,
            subject_id: cls.id_class,
            time: `${cls.start_time} - ${cls.end_time}`,
            group: cls.group,
            group_id: cls.group,
            class_id: cls.id_class,
            starts_in: cls.remaining_minutes
              ? `${cls.remaining_minutes} min`
              : null,
            // Session info
            session_id: cls.session_id || null,
            session_status: cls.session_status || null,
          }));
          setClasses(formattedClasses);
        } else {
          setError("No se pudieron cargar las clases");
        }

        // Process profile
        if (profileResponse.status === 200) {
          setProfile(profileResponse.data);
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
      TEACHER: "Docente",
      STUDENT: "Estudiante",
      ADMIN: "Administrador",
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
          <p className="text-gray-400 mt-1">
            Gestión Académica • Panel del{" "}
            {getRoleLabel(profile?.role || userRole)}
          </p>
        </div>

        <div className="flex items-center gap-4">
            <UserAvatar onLogout={onLogout} />
          </div>
      </header>

      <main>
        {/* Banner de Bienvenida */}
        <div className="mb-10 p-6 bg-blue-950/20 border border-blue-900 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold">Tus Clases</h2>
            <p className="text-blue-300 text-sm mt-1">
              {classes.length > 0
                ? `Tienes ${classes.length} sesiones programadas.`
                : "No hay clases programadas por ahora."}
            </p>
          </div>
          {sessionDate && (
            <div className="text-right">
              <p className="text-[10px] text-blue-300/70 uppercase tracking-widest font-bold">
                Fecha
              </p>
              <p className="text-sm font-semibold text-gray-200 capitalize">
                {new Date(sessionDate).toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
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
