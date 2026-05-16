import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AttendanceHistory = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = [
    {
      id: 1,
      name: "Cálculo Numérico",
      sessions: 18,
      total: 20,
      percentage: 90,
    },
    {
      id: 2,
      name: "Bases de Datos I",
      sessions: 15,
      total: 15,
      percentage: 100,
    },
    { id: 3, name: "Programación II", sessions: 12, total: 14, percentage: 85 },
    { id: 4, name: "Inglés Técnico", sessions: 10, total: 10, percentage: 100 },
  ];

  const calendarDays = Array.from({ length: 31 }, (_, i) => {
    const statuses = ["present", "absent", "late", "none"];
    const randomStatus = i > 25 ? "none" : statuses[i % 3];
    return { day: i + 1, status: randomStatus };
  });

  // VISTA DETALLADA (Calendario)
  if (selectedSubject) {
    return (
      <div className="min-h-screen w-full bg-[#08060d] bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/5 text-white p-4 md:p-10 font-sans">
        <header className="flex items-center justify-between pb-6 border-b border-gray-800 mb-8">
          <button
            onClick={() => setSelectedSubject(null)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-all flex items-center gap-2"
          >
            <span>❮</span> Volver
          </button>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-white leading-tight">
              {selectedSubject.name}
            </h2>
            <p className="text-[10px] text-blue-300/70 uppercase tracking-widest font-bold mt-1">
              Registro mensual • Mayo 2026
            </p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="grid grid-cols-7 gap-2 mb-4 text-center">
              {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                <span
                  key={d}
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-500"
                >
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              <div className="col-span-4" />
              {calendarDays.map((item) => (
                <div
                  key={item.day}
                  className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all
                    ${
                      item.status === "present"
                        ? "bg-green-500/5 border-green-500/20"
                        : item.status === "late"
                          ? "bg-orange-500/5 border-orange-500/20"
                          : item.status === "absent"
                            ? "bg-red-500/5 border-red-500/20"
                            : "bg-white/[0.02] border-white/5 opacity-40"
                    }
                  `}
                >
                  <span className="text-xs font-semibold text-gray-300 mb-1">
                    {item.day}
                  </span>
                  {item.status !== "none" && (
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        item.status === "present"
                          ? "bg-green-500"
                          : item.status === "late"
                            ? "bg-orange-500"
                            : "bg-red-500"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 border-t border-white/5 pt-6">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                  Presente
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                  Tardanza
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                  Ausencia
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // VISTA PRINCIPAL (Lista de Materias)
  return (
    <div className="min-h-screen w-full bg-[#08060d] bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/5 text-white p-4 md:p-10 font-sans">
      <header className="flex items-center justify-between pb-8 border-b border-gray-800 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Catsi<span className="text-blue-500">Vard</span>
          </h1>
          <p className="text-gray-400 mt-1">Historial de Asistencias</p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-all"
        >
          ← Volver al Dashboard
        </button>
      </header>

      <main>
        <div className="mb-10 p-6 bg-blue-950/20 border border-blue-900 rounded-2xl">
          <h2 className="text-2xl font-bold">Materias Cursadas</h2>
          <p className="text-blue-300 text-sm mt-1">
            {subjects.length} materias activas en el ciclo 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((s) => (
            <div
              key={s.id}
              className="group relative bg-white/5 border border-white/10 hover:border-blue-500/50 rounded-2xl p-6 transition-all shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-full border border-white/10">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-gray-300">
                    Activa
                  </span>
                </div>
                <span className="text-2xl font-bold text-white">
                  {s.percentage}
                  <span className="text-sm text-gray-500">%</span>
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-100 group-hover:text-blue-400 transition-colors leading-tight">
                    {s.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Ciclo Académico 2026
                  </p>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                    Asistencias
                  </p>
                  <p className="text-sm font-semibold text-gray-200">
                    {s.sessions} de {s.total} sesiones
                  </p>
                </div>

                <button
                  onClick={() => setSelectedSubject(s)}
                  className="w-full flex items-center justify-between px-4 py-3 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-400 transition-colors group/btn"
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

      <footer className="mt-20 pt-8 border-t border-gray-800 text-center text-xs text-gray-600">
        © 2026 CatsiVard System • Student Edition
      </footer>
    </div>
  );
};

export default AttendanceHistory;
