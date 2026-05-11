import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { checkIn } from "../../services/attendanceService";

const StudentSessionCards = ({ classes = [], markedSessions = [], onCheckInSuccess }) => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [scannedResult, setScannedResult] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState(null); // 'success' | 'error' | null
  const [checkInMessage, setCheckInMessage] = useState("");

  const scannerRef = useRef(null);

  // FORMATO DE HORA
  const formatTime12h = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":");
    const h = parseInt(hours);

    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;

    return `${hour12}:${minutes} ${ampm}`;
  };

  // CONSTRUIR FECHA
  const buildTodayAt = (timeStr) => {
    if (!timeStr) return null;

    const [h, m] = timeStr.split(":").map(Number);

    if (Number.isNaN(h) || Number.isNaN(m)) return null;

    const d = new Date();

    d.setHours(h, m, 0, 0);

    return d;
  };

  // BADGE DE ESTADO
  const getBadgeInfo = (clase) => {
    const status = clase.status?.toLowerCase();

    if (status === "past") {
      return {
        label: "Finalizada",
        dot: "bg-gray-500",
        pulse: false,
      };
    }

    if (status === "future") {
      return {
        label: "Próxima",
        dot: "bg-orange-500",
        pulse: false,
      };
    }

    if (status === "active") {
      const now = new Date();

      const start = buildTodayAt(clase.start_time);
      const end = buildTodayAt(clase.end_time);

      if (start && end) {
        if (now > end) {
          return {
            label: "Finalizada",
            dot: "bg-gray-500",
            pulse: false,
          };
        }

        if (now < start) {
          return {
            label: "Activa",
            dot: "bg-blue-500",
            pulse: false,
          };
        }

        return {
          label: "En proceso",
          dot: "bg-green-500",
          pulse: true,
        };
      }

      return {
        label: "Activa",
        dot: "bg-blue-500",
        pulse: false,
      };
    }

    return {
      label: "Pendiente",
      dot: "bg-orange-500",
      pulse: false,
    };
  };

  // COUNTDOWN
  const getCountdown = (clase) => {
    const status = clase.status?.toLowerCase();

    if (status === "future" && clase.remaining_minutes) {
      return `Empieza en ${clase.remaining_minutes} min`;
    }

    if (status === "active") {
      const end = buildTodayAt(clase.end_time);

      if (end) {
        const diffMin = Math.floor((end - new Date()) / 60000);

        if (diffMin > 0) {
          return `Termina en ${diffMin} min`;
        }
      }
    }

    return null;
  };

  // VERIFICAR SI YA ESTÁ MARCADA
  const isMarked = (clase) => {
    return markedSessions.includes(clase.id_session) || markedSessions.includes(clase.session_id);
  };

  // OBTENER TEXTO DEL BOTÓN
  const getButtonText = (clase) => {
    if (isMarked(clase)) {
      return "Asistencia Registrada";
    }

    if (isMarked(clase)) return "Asistencia Registrada";

    if (!isMarked(clase) && !clase.can_check_in) {
      return "Sesión Finalizada";
    }

    return "Escanear QR";
  };

  // OBTENER CLASE DEL BOTÓN
  const getButtonClass = (clase) => {
    if (isMarked(clase)) {
      return "w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-all cursor-default";
    }

    if (!clase.can_check_in) {
      return "w-full bg-green-600/30 text-green-400/50 font-semibold py-3 rounded-xl transition-all cursor-not-allowed";
    }

    return "w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-xl transition-all";
  };

  // ABRIR SCANNER
  const handleOpenScanner = async (clase) => {
    if (isMarked(clase)) return;

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
          {
            facingMode: "environment",
          },
          {
            fps: 10,
            qrbox: 250,
          },
          async (decodedText) => {
            console.log("QR ESCANEADO:", decodedText);

            setScannedResult(decodedText);
            setIsCheckingIn(true);

            await html5QrCode.stop();
            await html5QrCode.clear();

            // LLAMAR AL ENDPOINT DE CHECK-IN
            try {
              const result = await checkIn(decodedText);

              setCheckInStatus("success");
              setCheckInMessage(
                result?.message || "¡Asistencia registrada exitosamente!"
              );

              // Notificar al padre para actualizar estado
              if (onCheckInSuccess) {
                onCheckInSuccess(selectedClass?.session_id || selectedClass?.id_session);
              }

              // Cerrar modal después de 2 segundos
              setTimeout(() => {
                setScannerOpen(false);
              }, 2000);
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

              // Permitir reintentar después de 3 segundos
              setTimeout(() => {
                setIsCheckingIn(false);
                setScannedResult("");
                setCheckInStatus(null);
                setCheckInMessage("");
              }, 3000);
            }
          },
          () => {}
        );
      } catch (err) {
        console.error(err);

        setCameraError(
          "No se pudo acceder a la cámara. Verifica permisos."
        );
      }
    }, 300);
  };

  // CERRAR SCANNER
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
            className="relative bg-white/5 border border-white/10 hover:border-white/25 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
          >
            {/* BADGE */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded-full border border-white/10">
                <span
                  className={`h-2 w-2 rounded-full ${badge.dot} ${
                    badge.pulse ? "animate-pulse" : ""
                  }`}
                />

                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
                  {badge.label}
                </span>
              </div>

              {clase.group && (
                <span className="text-xs font-semibold text-gray-400 px-2 py-0.5 bg-white/5 border border-white/10 rounded-md">
                  {clase.group}
                </span>
              )}

              {marked && (
                <span className="text-xs font-semibold text-indigo-400 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md">
                  Registrada
                </span>
              )}
            </div>

            {/* INFO */}
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-blue-100">
                  {clase.subject}
                </h3>

                {clase.course && (
                  <p className="text-xs text-gray-400 mt-1">
                    {clase.course}
                  </p>
                )}

                <p className="text-xs text-gray-500 mt-2 font-mono">
                  {clase.id_class}
                </p>
              </div>

              {/* HORARIO */}
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    Horario
                  </p>

                  <p className="text-sm font-semibold text-gray-200">
                    {clase.start_time && clase.end_time
                      ? `${formatTime12h(
                          clase.start_time
                        )} – ${formatTime12h(clase.end_time)}`
                      : "—"}
                  </p>

                  {getCountdown(clase) && (
                    <p className="text-[11px] text-blue-400 font-medium mt-1">
                      {getCountdown(clase)}
                    </p>
                  )}
                </div>
              </div>

              {/* CHECK IN INFO */}
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

              {/* BOTÓN */}
              <button
                onClick={() => handleOpenScanner(clase)}
                disabled={!clase.can_check_in}
                className={getButtonClass(clase)}
              >
                {getButtonText(clase)}
              </button>
            </div>
          </div>
        );
      })}

      {/* MODAL SCANNER */}
      {scannerOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#13111a] border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Escanear QR
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  {selectedClass?.subject}
                </p>
              </div>

              <button
                onClick={closeScanner}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* CAMARA */}
            {!checkInStatus && (
              <div
                id="reader"
                className="overflow-hidden rounded-2xl"
              />
            )}

            {/* CARGANDO */}
            {isCheckingIn && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-4" />
                <p className="text-gray-400 text-sm">Registrando asistencia...</p>
              </div>
            )}

            {/* ÉXITO */}
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

            {/* ERROR */}
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
                <p className="text-red-400 font-semibold text-lg">
                  Error
                </p>
                <p className="text-gray-400 text-sm mt-1 text-center">
                  {checkInMessage}
                </p>
                <p className="text-gray-500 text-xs mt-3">
                  Preparando para reintentar...
                </p>
              </div>
            )}

            {/* CAMERA ERROR */}
            {cameraError && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
                {cameraError}
              </div>
            )}

            {/* RESULTADO DEBUG */}
            {scannedResult && !checkInStatus && !isCheckingIn && (
              <div className="mt-4 bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl text-sm break-all">
                QR detectado:
                <br />
                {scannedResult}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSessionCards;