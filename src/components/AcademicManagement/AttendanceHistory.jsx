import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AttendanceSemesterModal from "./AttendanceSemesterModal";

import { getSemesterAttendance } from "../../services/studentAttendanceService";

const AttendanceHistory = () => {
  const navigate = useNavigate();

  const [selectedSubject, setSelectedSubject] = useState(null);

  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // CARGAR ASISTENCIA
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        const data = await getSemesterAttendance(2026);

        const mappedSubjects = data.courses.map((course) => ({
          id: course.subject_id,
          name: course.subject_name,
          present: course.present,
          late: course.late,
          absent: course.absent,
          percentage: course.percentage,
          status: course.status,
          total:
            course.present +
            course.late +
            course.absent,
        }));

        setSubjects(mappedSubjects);
      } catch (err) {
        console.error(err);

        setError("No se pudo cargar la asistencia.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0d0b14] text-white p-4 md:p-8 font-sans">
      {/* HEADER */}
      <header className="flex items-center justify-between pb-8 border-b border-white/10 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Catsi<span className="text-blue-500">Vard</span>
          </h1>

          <p className="text-gray-400 mt-1">
            Mi Asistencia
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-all"
        >
          ← Volver al Dashboard
        </button>
      </header>

      {/* LOADING */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400 text-sm">
            Cargando asistencia...
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6">
          {error}
        </div>
      )}

      {/* MATERIAS */}
      {!loading && !error && (
        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((s) => (
              <div
                key={s.id}
                className="group relative bg-white/5 border border-white/10 hover:border-blue-500/50 rounded-xl p-3 transition-all hover:-translate-y-0.5"
              >
                {/* BADGE */}
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-full border border-white/10">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        s.status === "OK"
                          ? "bg-green-500 animate-pulse"
                          : "bg-yellow-500 animate-pulse"
                      }`}
                    />

                    <span className="text-[9px] font-black uppercase text-gray-300">
                      {s.status === "OK"
                        ? "Asistencia OK"
                        : "Alerta"}
                    </span>
                  </div>

                  <span
                    className={`text-lg font-bold ${
                      s.percentage >= 80
                        ? "text-green-400"
                        : s.percentage >= 60
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {s.percentage}%
                  </span>
                </div>

                {/* INFO */}
                <div className="space-y-2">
                  <div>
                    <h3 className="text-xl font-bold text-blue-100 group-hover:text-blue-400 transition-colors leading-tight">
                      {s.name}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      Ciclo Académico 2026
                    </p>
                  </div>

                  {/* BARRA */}
                  <div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-1.5 rounded-full transition-all"
                        style={{
                          width: `${s.percentage}%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        <span className="text-green-500">
                          ✓
                        </span>{" "}
                        {s.present}
                      </span>

                      <span>
                        <span className="text-yellow-500">
                          ◔
                        </span>{" "}
                        {s.late}
                      </span>

                      <span>
                        <span className="text-red-500">
                          ✕
                        </span>{" "}
                        {s.absent}
                      </span>

                      <span className="text-gray-400">
                        {s.total} clases
                      </span>
                    </div>
                  </div>

                  {/* BOTÓN */}
                  <button
                    onClick={() =>
                      setSelectedSubject(s)
                    }
                    className="w-full flex items-center gap-2 px-2 py-2 border-t border-white/5 text-[10px] font-bold uppercase text-gray-500 hover:text-blue-400 transition-colors group/btn"
                  >
                    <span>Ver Calendario</span>

                    <span className="transition-transform group-hover/btn:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="mt-20 pt-8 border-t border-white/10 text-center text-xs text-gray-600">
        © 2026 CatsiVard System • Student Edition
      </footer>

      {/* MODAL */}
      {selectedSubject && (
        <AttendanceSemesterModal
          isOpen={!!selectedSubject}
          onClose={() =>
            setSelectedSubject(null)
          }
          subjectName={selectedSubject.name}
          subjectId={selectedSubject.id}
        />
      )}
    </div>
  );
};

export default AttendanceHistory;
