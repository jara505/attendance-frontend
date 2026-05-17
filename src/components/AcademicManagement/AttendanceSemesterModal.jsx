import React, { useEffect, useMemo, useState } from "react";

import {
  getSubjectAttendanceDetail,
} from "../../services/studentAttendanceService";

const AttendanceSemesterModal = ({
  isOpen,
  onClose,
  subjectName,
  subjectId,
}) => {
  const currentYear = 2026;

  const months = [
    { id: "feb", name: "FEB", number: 2 },
    { id: "mar", name: "MAR", number: 3 },
    { id: "abr", name: "ABR", number: 4 },
    { id: "may", name: "MAY", number: 5 },
  ];

  const [activeMonth, setActiveMonth] =
    useState(months[3]);

  const [attendanceData, setAttendanceData] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // FETCH DEL MES
  useEffect(() => {
    if (!isOpen || !subjectId) return;

    const fetchMonthAttendance =
      async () => {
        try {
          setLoading(true);

          setError("");

          const data =
            await getSubjectAttendanceDetail(
              subjectId,
              activeMonth.number,
              currentYear
            );

          setAttendanceData(
            data.days || []
          );
        } catch (err) {
          console.error(err);

          setError(
            "No se pudo cargar el calendario."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchMonthAttendance();
  }, [
    activeMonth,
    subjectId,
    isOpen,
  ]);

  // MAPA DE DÍAS
  const attendanceMap = useMemo(() => {
    const map = {};

    attendanceData.forEach((item) => {
      map[item.day] = item.status;
    });

    return map;
  }, [attendanceData]);

  // DÍAS DEL MES
  const daysInMonth = useMemo(() => {
    return new Date(
      currentYear,
      activeMonth.number,
      0
    ).getDate();
  }, [activeMonth]);

  // OFFSET DEL CALENDARIO
  const firstDayOffset = useMemo(() => {
    const firstDay =
      new Date(
        currentYear,
        activeMonth.number - 1,
        1
      ).getDay();

    return firstDay === 0
      ? 6
      : firstDay - 1;
  }, [activeMonth]);

  const daysOfWeek = [
    "LUN",
    "MAR",
    "MIÉ",
    "JUE",
    "VIE",
    "SÁB",
    "DOM",
  ];

  // RENDER STATUS
  const renderStatus = (status) => {
    if (status === "PRESENT") {
      return (
        <span className="text-green-500 font-bold text-lg">
          ✓
        </span>
      );
    }

    if (status === "LATE") {
      return (
        <span className="text-yellow-500 font-bold text-lg">
          ◔
        </span>
      );
    }

    if (status === "ABSENT") {
      return (
        <span className="text-red-500 font-bold text-lg">
          ✕
        </span>
      );
    }

    if (status === "JUSTIFIED") {
      return (
        <span className="text-blue-400 font-bold text-sm">
          J
        </span>
      );
    }

    return (
      <span className="text-gray-700">
        —
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[260] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0d0b14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* HEADER */}
        <div className="p-5 pb-3 flex justify-between items-center sticky top-0 bg-[#0d0b14] z-10 border-b border-white/5">
          <button
            onClick={onClose}
            className="bg-white/5 hover:bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>❮</span> Cerrar
          </button>

          <div className="text-right">
            <h2 className="text-lg font-bold text-white leading-tight">
              {subjectName ||
                "Mi Asistencia"}
            </h2>

            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest">
              Semestre 2026-1
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
            {months.map((m) => (
              <button
                key={m.id}
                onClick={() =>
                  setActiveMonth(m)
                }
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-md transition-all ${
                  activeMonth.id === m.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="px-5 pb-5 text-sm text-gray-400">
            Cargando calendario...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="px-5 pb-5">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
              {error}
            </div>
          </div>
        )}

        {/* CALENDARIO */}
        {!loading && !error && (
          <div className="p-5 pt-0">
            <div className="bg-[#13111a] border border-white/5 rounded-2xl p-4 shadow-inner">
              {/* DÍAS */}
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

              {/* GRID */}
              <div className="grid grid-cols-7 gap-y-3">
                {Array.from({
                  length: firstDayOffset,
                }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="min-h-[40px]"
                  />
                ))}

                {Array.from({
                  length: daysInMonth,
                }).map((_, i) => {
                  const day = i + 1;

                  const status =
                    attendanceMap[day];

                  return (
                    <div
                      key={day}
                      className="flex flex-col items-center justify-center min-h-[40px]"
                    >
                      <span className="text-[10px] font-medium text-gray-400 mb-0.5">
                        {day
                          .toString()
                          .padStart(2, "0")}
                      </span>

                      <div className="h-4 flex items-center">
                        {renderStatus(
                          status
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LEYENDA */}
            <div className="flex justify-center gap-4 mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-tighter flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-green-500 text-sm">
                  ✓
                </span>
                Presente
              </div>

              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-sm">
                  ◔
                </span>
                Tardanza
              </div>

              <div className="flex items-center gap-1">
                <span className="text-red-500 text-sm">
                  ✕
                </span>
                Ausencia
              </div>

              <div className="flex items-center gap-1">
                <span className="text-blue-400 text-sm">
                  J
                </span>
                Justificado
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
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