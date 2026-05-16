import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AttendanceHistory = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = [
    { id: 1, name: "Cálculo Numérico", present: 18, late: 2, absent: 2, total: 22, percentage: 90 },
    { id: 2, name: "Bases de Datos I", present: 15, late: 0, absent: 0, total: 15, percentage: 100 },
    { id: 3, name: "Programación II", present: 12, late: 1, absent: 1, total: 14, percentage: 86 },
    { id: 4, name: "Inglés Técnico", present: 10, late: 0, absent: 0, total: 10, percentage: 100 },
  ];

  // VISTA PRINCIPAL (Lista de Materias)
  return (
    <div className="min-h-screen w-full bg-[#0d0b14] text-white p-4 md:p-8 font-sans">
      <header className="flex items-center justify-between pb-8 border-b border-white/10 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Catsi<span className="text-blue-500">Vard</span>
          </h1>
          <p className="text-gray-400 mt-1">Mi Asistencia</p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-gray-300 transition-all"
        >
          ← Volver al Dashboard
        </button>
      </header>

      <main>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((s) => (
            <div
              key={s.id}
              className="group relative bg-white/5 border border-white/10 hover:border-blue-500/50 rounded-xl p-3 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-full border border-white/10">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase text-gray-300">
                    Activa
                  </span>
                </div>
                <span className={`text-lg font-bold ${s.percentage >= 80 ? "text-green-400" : s.percentage >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                  {s.percentage}%
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="text-xl font-bold text-blue-100 group-hover:text-blue-400 transition-colors leading-tight">
                    {s.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Ciclo Académico 2026
                  </p>
                </div>

                {/* Blue gradient background container */}
                <div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-1.5 rounded-full" style={{ width: `${s.percentage}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span><span className="text-green-500">✓</span> {s.present}</span>
                    <span><span className="text-yellow-500">◔</span> {s.late}</span>
                    <span><span className="text-red-500">✕</span> {s.absent}</span>
                    <span className="text-gray-400">{s.total} clases</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSubject(s)}
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

      <footer className="mt-20 pt-8 border-t border-white/10 text-center text-xs text-gray-600">
        © 2026 CatsiVard System • Student Edition
      </footer>

      {/* Modal de Calendario - Ventana Flotante */}
      {selectedSubject && <CalendarModal subject={selectedSubject} onClose={() => setSelectedSubject(null)} />}
    </div>
  );
};

// Componente Modal de Calendario
const CalendarModal = ({ subject, onClose }) => {
  const [activeMonth, setActiveMonth] = useState("may");

  const months = [
    { id: "feb", name: "FEB" },
    { id: "mar", name: "MAR" },
    { id: "abr", name: "ABR" },
    { id: "may", name: "MAY" },
  ];

  const getMonthData = (monthId) => {
    const data = {
      feb: Array.from({ length: 28 }, (_, i) => {
        const day = i + 1;
        if (day <= 20) {
          const statuses = ["p", "p", "a", "p", "p", "p"];
          return { day, status: statuses[i % statuses.length] };
        }
        return { day, status: "none" };
      }),
      mar: Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        const statuses = ["p", "p", "p", "a", "p", "p", "t"];
        return { day, status: statuses[i % statuses.length] };
      }),
      abr: Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const statuses = ["p", "p", "p", "p", "p", "a"];
        return { day, status: statuses[i % statuses.length] };
      }),
      may: Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        if (day <= 23) {
          const statuses = ["p", "p", "t", "p", "p", "p", "p", "a", "p"];
          return { day, status: statuses[i % statuses.length] };
        }
        return { day, status: "none" };
      }),
    };
    return data[monthId] || [];
  };

  const currentMonthData = getMonthData(activeMonth);
  const daysOfWeek = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
  const firstDayOffset = 1;

  const renderStatus = (status) => {
    if (status === "p") return <span className="text-green-500 font-bold text-lg">✓</span>;
    if (status === "t") return <span className="text-yellow-500 font-bold text-lg">◔</span>;
    if (status === "a") return <span className="text-red-500 font-bold text-lg">✕</span>;
    if (status === "none") return <span className="text-gray-700">—</span>;
    return null;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-[#0d0b14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 pb-3 flex justify-between items-center sticky top-0 bg-[#0d0b14] z-10 border-b border-white/5">
          <button
            onClick={onClose}
            className="bg-white/5 hover:bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>❮</span> Cerrar
          </button>
          <div className="text-right">
            <h2 className="text-lg font-bold text-white leading-tight">{subject.name}</h2>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest">Semestre 2026-1</p>
          </div>
        </div>


        {/* Tabs */}
        <div className="px-5 pb-3">
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
            {months.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMonth(m.id)}
                className={`flex-1 py-2 text-[10px] font-black uppercase rounded-md transition-all ${
                  activeMonth === m.id ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Calendario */}
        <div className="p-5 pt-0">
          <div className="bg-[#13111a] border border-white/5 rounded-2xl p-3">
            <div className="grid grid-cols-7 gap-1 mb-3 pb-2 border-b border-white/5">
              {daysOfWeek.map((d) => (
                <span key={d} className="text-[9px] text-center font-bold text-gray-500">{d}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-3">
              {Array.from({ length: firstDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[40px]" />
              ))}
              {currentMonthData.map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center min-h-[40px]">
                  {item.status !== "none" && (
                    <>
                      <span className="text-[10px] text-gray-400 mb-0.5">{item.day.toString().padStart(2, "0")}</span>
                      <div className="h-4">{renderStatus(item.status)}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
            <span><span className="text-green-500 text-sm">✓</span> Presente</span>
            <span><span className="text-yellow-500 text-sm">◔</span> Tardanza</span>
            <span><span className="text-red-500 text-sm">✕</span> Ausencia</span>
          </div>
        </div>

        <div className="p-3 bg-black/20 text-center">
          <p className="text-[9px] text-gray-700">CatsiVard • Visual History</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
