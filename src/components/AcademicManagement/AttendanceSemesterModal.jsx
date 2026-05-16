import React, { useState } from "react";

const AttendanceSemesterModal = ({ isOpen, onClose, subjectName, subjectId }) => {
  const [activeMonth, setActiveMonth] = useState("may");

  if (!isOpen) return null;

  const months = [
    { id: "feb", name: "FEB", days: 28 },
    { id: "mar", name: "MAR", days: 31 },
    { id: "abr", name: "ABR", days: 30 },
    { id: "may", name: "MAY", days: 31 },
  ];

  const semesterStats = subjectId ? {
    present: 18,
    late: 2,
    absent: 2,
    total: 22,
    percentage: 90,
  } : { present: 55, late: 3, absent: 3, total: 61, percentage: 94 };

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
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-4" onClick={onClose}>
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
            <h2 className="text-lg font-bold text-white leading-tight">
              {subjectName || "Mi Asistencia"}
            </h2>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest">
              Semestre 2026-1
            </p>
          </div>
        </div>

        {/* Stats del semestre */}
        <div className="px-5 pt-4">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/20 border border-blue-500/20 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Asistencia Semestral</span>
              <span className="text-2xl font-bold text-white">{semesterStats.percentage}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all"
                style={{ width: `${semesterStats.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500">
              <span><span className="text-green-500">✓</span> {semesterStats.present} presentes</span>
              <span><span className="text-yellow-500">◔</span> {semesterStats.late} tardanzas</span>
              <span><span className="text-red-500">✕</span> {semesterStats.absent} ausencias</span>
            </div>
          </div>
        </div>

        {/* Tabs de meses */}
        <div className="px-5 pb-3">
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
            {months.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMonth(m.id)}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${
                  activeMonth === m.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Calendario del mes activo */}
        <div className="p-5 pt-0">
          <div className="bg-[#13111a] border border-white/5 rounded-2xl p-4 shadow-inner">
            <div className="grid grid-cols-7 gap-1 mb-3 border-b border-white/5 pb-2">
              {daysOfWeek.map((d) => (
                <span
                  key={d}
                  className="text-[9px] text-center font-bold text-gray-500 uppercase tracking-tighter"
                >
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-3">
              {Array.from({ length: firstDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[40px]" />
              ))}
              {currentMonthData.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center min-h-[40px]"
                >
                  {item.status !== "none" && (
                    <>
                      <span className="text-[10px] font-medium text-gray-400 mb-0.5">
                        {item.day.toString().padStart(2, "0")}
                      </span>
                      <div className="h-4 flex items-center">
                        {renderStatus(item.status)}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Leyenda */}
          <div className="flex justify-center gap-4 mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
            <div className="flex items-center gap-1">
              <span className="text-green-500 text-sm">✓</span> Presente
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-sm">◔</span> Tardanza
            </div>
            <div className="flex items-center gap-1">
              <span className="text-red-500 text-sm">✕</span> Ausencia
            </div>
          </div>
        </div>

        <div className="p-3 bg-black/20 text-center mt-2">
          <p className="text-[9px] text-gray-700 uppercase font-bold tracking-widest">
            CatsiVard • Visual History
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSemesterModal;
