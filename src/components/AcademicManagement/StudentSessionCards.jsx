import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { checkIn } from "../../services/attendanceService";

// SUBMÓDULO INTERNO: CALENDARIO DE ASISTENCIA

const AttendanceCalendarModal = ({ isOpen, onClose, subjectName }) => {
  if (!isOpen) return null;

  const daysOfWeek = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

  // Datos estáticos para representar el calendario de Mayo 2026 (Referencia image_bf4c65.jpg)
  const calendarDays = [
    { type: "empty" },
    { type: "empty" },
    { type: "empty" },
    { type: "empty" },
    { day: 1, status: "p" },
    { day: 2, status: "p" },
    { day: 3, status: "t" },
    { day: 4, status: "p" },
    { day: 5, status: "p" },
    { day: 6, status: "p" },
    { day: 7, status: "p" },
    { day: 8, status: "a" },
    { day: 9, status: "p" },
    { day: 10, status: "p" },
    { day: 11, status: "p" },
    { day: 12, status: "p" },
    { day: 13, status: "p" },
    { day: 14, status: "p" },
    { day: 15, status: "p" },
    { day: 16, status: "p" },
    { day: 17, status: "p" },
    { day: 18, status: "p" },
    { day: 19, status: "p" },
    { day: 20, status: "p" },
    { day: 21, status: "sc" },
    { day: 22, status: "sc" },
    { day: 23, status: "p" },
  ];

  const renderStatus = (status) => {
    if (status === "p")
      return <span className="text-green-500 font-bold text-lg">✓</span>;
    if (status === "t")
      return <span className="text-yellow-500 font-bold text-lg">◔</span>;
    if (status === "a")
      return <span className="text-red-500 font-bold text-lg">✕</span>;
    if (status === "sc")
      return <span className="text-gray-600 font-bold text-lg">—</span>;
    return null;
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0d0b14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 pb-2 flex justify-between items-center">
          <button
            onClick={onClose}
            className="bg-white/5 hover:bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>❮</span> Volver
          </button>
          <div className="text-right">
            <h2 className="text-lg font-bold text-white leading-tight">
              {subjectName || "Materia"}
            </h2>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest">
              Mayo 2026
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-[#13111a] border border-white/5 rounded-2xl p-4 shadow-inner">
            <div className="grid grid-cols-7 gap-1 mb-4 border-b border-white/5 pb-2">
              {daysOfWeek.map((d) => (
                <span
                  key={d}
                  className="text-[9px] text-center font-bold text-gray-500 uppercase tracking-tighter"
                >
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-4">
              {calendarDays.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center min-h-[40px]"
                >
                  {item.type !== "empty" && (
                    <>
                      <span className="text-[10px] font-medium text-gray-400 mb-1">
                        {item.day.toString().padStart(2, "0")}
                      </span>
                      <div className="h-4 flex items-center">
                        {renderStatus(item.status)}
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div className="col-span-2 flex items-center pl-2">
                <span className="text-[9px] text-gray-600 italic font-medium">
                  (Sin clase)
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
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

        <div className="p-3 bg-black/20 text-center">
          <p className="text-[9px] text-gray-700 uppercase font-bold tracking-widest">
            CatsiVard • Visual History
          </p>
        </div>
      </div>
    </div>
  );
};

// COMPONENTE PRINCIPAL

const StudentSessionCards = ({
  classes = [],
  markedSessions = [],
  onCheckInSuccess,
}) => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [, setScannedResult] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState(null); // 'success' | 'error' | null
  const [checkInMessage, setCheckInMessage] = useState("");

  // Estados para el detalle del calendario
  const [detailOpen, setDetailOpen] = useState(false);
  const [classForDetail, setClassForDetail] = useState(null);

  const scannerRef = useRef(null);

  const formatTime12h = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const buildTodayAt = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  const getBadgeInfo = (clase) => {
    const status = clase.status?.toLowerCase();
    if (status === "past")
      return { label: "Finalizada", dot: "bg-gray-500", pulse: false };
    if (status === "future")
      return { label: "Próxima", dot: "bg-orange-500", pulse: false };
    if (status === "active") {
      const now = new Date();
      const start = buildTodayAt(clase.start_time);
      const end = buildTodayAt(clase.end_time);
      if (start && end) {
        if (now > end)
          return { label: "Finalizada", dot: "bg-gray-500", pulse: false };
        if (now < start)
          return { label: "Activa", dot: "bg-blue-500", pulse: false };
        return { label: "En proceso", dot: "bg-green-500", pulse: true };
      }
      return { label: "Activa", dot: "bg-blue-500", pulse: false };
    }
    return { label: "Pendiente", dot: "bg-orange-500", pulse: false };
  };

  const getCountdown = (clase) => {
    const status = clase.status?.toLowerCase();
    if (status === "future" && clase.remaining_minutes) {
      return `Empieza en ${clase.remaining_minutes} min`;
    }
    if (status === "active") {
      const end = buildTodayAt(clase.end_time);
      if (end) {
        const diffMin = Math.floor((end - new Date()) / 60000);
        if (diffMin > 0) return `Termina en ${diffMin} min`;
      }
    }
    return null;
  };

  const isMarked = (clase) =>
    markedSessions.includes(clase.id_session) ||
    markedSessions.includes(clase.session_id);

  const getButtonText = (clase) => {
    if (isMarked(clase)) return "Asistencia Registrada";
    if (!clase.can_check_in) return "Sesión Finalizada";
    return "Escanear QR";
  };

  const getButtonClass = (clase) => {
    if (isMarked(clase)) {
      return "w-full bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all cursor-default";
    }
    if (!clase.can_check_in) {
      return "w-full bg-green-600/30 text-green-400/50 font-bold py-3 rounded-xl transition-all cursor-not-allowed";
    }
    return "w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all";
  };

  const handleOpenScanner = (e, clase) => {
    e.stopPropagation();
    if (isMarked(clase) || !clase.can_check_in) return;

    setSelectedClass(clase);
    setScannerOpen(true);
    setCameraError("");
    setScannedResult("");
    setCheckInStatus(null);
    setCheckInMessage("");
    setIsCheckingIn(false);

    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          async (decodedText) => {
            setScannedResult(decodedText);
            setIsCheckingIn(true);

            try {
              await html5QrCode.stop();
              await html5QrCode.clear();
            } catch {
              // ignore stop/clear errors
            }

            try {
              const result = await checkIn(decodedText);

              setCheckInStatus("success");
              setCheckInMessage(
                result?.message || "¡Asistencia registrada exitosamente!",
              );

              if (onCheckInSuccess) {
                onCheckInSuccess(clase?.session_id || clase?.id_session);
              }

              setTimeout(() => setScannerOpen(false), 2000);
            } catch (error) {
              const data = error?.response?.data;
              const detail = data?.detail;
              const errorMsg =
                (typeof detail === "string" && detail) ||
                detail?.message ||
                data?.message ||
                data?.error ||
                error?.message ||
                "No se pudo registrar la asistencia. Intenta de nuevo.";

              console.error("Check-in error:", {
                status: error?.response?.status,
                data,
                qrToken: decodedText,
              });

              setCheckInStatus("error");
              setCheckInMessage(errorMsg);

              setTimeout(() => {
                setIsCheckingIn(false);
                setScannedResult("");
                setCheckInStatus(null);
                setCheckInMessage("");
              }, 3000);
            }
          },
          () => {},
        );
      } catch (err) {
        console.error(err);
        setCameraError("No se pudo acceder a la cámara. Verifica permisos.");
      }
    }, 300);
  };

  const handleOpenDetail = (clase) => {
    setClassForDetail(clase);
    setDetailOpen(true);
  };

  const closeScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch (err) {
      console.error(err);
    }
    setScannerOpen(false);
  };

  // LIMPIAR AL DESMONTAR
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current.clear())
          .catch(() => {});
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {classes.map((clase, index) => {
        const badge = getBadgeInfo(clase);
        const marked = isMarked(clase);
        return (
          <div
            key={index}
            onClick={() => handleOpenDetail(clase)}
            className="group relative bg-white/5 border border-white/10 hover:border-blue-500/50 rounded-2xl p-6 transition-all cursor-pointer shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-full border border-white/10">
                <span
                  className={`h-2 w-2 rounded-full ${badge.dot} ${badge.pulse ? "animate-pulse" : ""}`}
                />
                <span className="text-[9px] font-black uppercase text-gray-300">
                  {badge.label}
                </span>
              </div>
              {clase.group && (
                <span className="text-[10px] font-bold text-gray-500 px-2 py-0.5 border border-white/5 rounded-md">
                  {clase.group}
                </span>
              )}
              {marked && (
                <span className="text-xs font-semibold text-indigo-400 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                  Registrada
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-blue-100 group-hover:text-blue-400 transition-colors leading-tight">
                  {clase.subject}
                </h3>
                {clase.course && (
                  <p className="text-xs text-gray-500 mt-1">{clase.course}</p>
                )}
                {clase.id_class && (
                  <p className="text-[10px] text-gray-600 mt-1 font-mono">
                    {clase.id_class}
                  </p>
                )}
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                  Horario
                </p>
                <p className="text-sm font-semibold text-gray-200">
                  {clase.start_time && clase.end_time
                    ? `${formatTime12h(clase.start_time)} – ${formatTime12h(clase.end_time)}`
                    : "—"}
                </p>
                {getCountdown(clase) && (
                  <p className="text-[11px] text-blue-400 font-medium mt-1">
                    {getCountdown(clase)}
                  </p>
                )}
              </div>

              {marked && clase.check_in_time && (
                <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                    Registrado a las
                  </p>
                  <p className="text-sm font-semibold text-indigo-300 mt-0.5">
                    {formatTime12h(clase.check_in_time)}
                  </p>
                </div>
              )}

              <button
                onClick={(e) => handleOpenScanner(e, clase)}
                disabled={isMarked(clase) || !clase.can_check_in}
                className={getButtonClass(clase)}
              >
                {getButtonText(clase)}
              </button>
            </div>
          </div>
        );
      })}

      <AttendanceCalendarModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        subjectName={classForDetail?.subject}
      />

      {scannerOpen && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#13111a] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-white">Escanear QR</h2>
                {selectedClass?.subject && (
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedClass.subject}
                  </p>
                )}
              </div>
              <button
                onClick={closeScanner}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            {!checkInStatus && !isCheckingIn && (
              <div
                id="reader"
                className="overflow-hidden rounded-2xl border border-white/5"
              />
            )}

            {isCheckingIn && !checkInStatus && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-4" />
                <p className="text-gray-400 text-sm">
                  Registrando asistencia...
                </p>
              </div>
            )}

            {checkInStatus === "success" && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-green-400 font-semibold text-lg">
                  ¡Asistencia Registrada!
                </p>
                <p className="text-gray-400 text-sm mt-1 text-center">
                  {checkInMessage}
                </p>
              </div>
            )}

            {checkInStatus === "error" && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="text-red-400 font-semibold text-lg">Error</p>
                <p className="text-gray-400 text-sm mt-1 text-center">
                  {checkInMessage}
                </p>
              </div>
            )}

            {cameraError && (
              <p className="mt-4 text-red-400 text-center text-sm">
                {cameraError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSessionCards;
