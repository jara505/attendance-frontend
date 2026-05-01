import React, { useState, useRef, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  createSession,
  activateSession,
  getSessionAttendance,
  finishSession,
} from "../../services/sessionService";

const SessionCards = ({ classes = [], sessionDate = "" }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [finishedSessions, setFinishedSessions] = useState({});

  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const pollingRef = useRef(null);

  const formatDate = (dateStr) => {
    if (!dateStr) {
      return new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formattedDate = formatDate(sessionDate);

  // Convertir hora 24h a 12h con AM/PM
  const formatTime12h = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Construye un Date de hoy a partir de "HH:MM"
  const buildTodayAt = (timeStr) => {
    if (!timeStr) return null;
    const [h, m] = timeStr.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  // Determina label/color del badge según status temporal + horario
  const getBadgeInfo = (clase) => {
    const status = clase.status;
    if (status === "past") {
      return { label: "Finalizada", dot: "bg-gray-500", pulse: false };
    }
    if (status === "future") {
      return { label: "Próxima", dot: "bg-orange-500", pulse: false };
    }
    if (status === "active") {
      const now = new Date();
      const start = buildTodayAt(clase.start_time);
      const end = buildTodayAt(clase.end_time);
      if (start && end) {
        if (now > end) {
          return { label: "Finalizada", dot: "bg-gray-500", pulse: false };
        }
        if (now < start) {
          return { label: "Activa", dot: "bg-blue-500", pulse: false };
        }
        return { label: "En proceso", dot: "bg-green-500", pulse: true };
      }
      return { label: "Activa", dot: "bg-blue-500", pulse: false };
    }
    return { label: "Pendiente", dot: "bg-orange-500", pulse: false };
  };

  // Indica si la clase aún no comenzó (para deshabilitar "Iniciar asistencia")
  const hasNotStarted = (clase) => {
    if (clase.status !== "active") return clase.status === "future";
    const start = buildTodayAt(clase.start_time);
    if (!start) return false;
    return new Date() < start;
  };

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const fetchAttendance = useCallback(async (sessionId) => {
    try {
      const data = await getSessionAttendance(sessionId);
      setAttendance(data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  }, []);

  const startPolling = useCallback(
    (sessionId) => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
      fetchAttendance(sessionId);
      pollingRef.current = setInterval(() => {
        fetchAttendance(sessionId);
      }, 10000);
    },
    [fetchAttendance],
  );

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const handleStartSession = async (clase) => {
    setLoading(true);
    setError(null);

    try {
      let sessionId = clase.session_id;
      if (!sessionId) {
        try {
          const newSession = await createSession(clase.class_id);
          sessionId = newSession.id_session;
        } catch (createErr) {
          if (createErr.response?.status === 409) {
            sessionId = createErr.response.data.session_id;
          } else {
            throw createErr;
          }
        }
      }

      if (sessionId) {
        const activated = await activateSession(sessionId, 10);
        setSessionData(activated);
        setActiveSession(clase.class_id);
        startPolling(sessionId);
      }
    } catch (err) {
      console.error("Error starting session:", err);
      if (err.response?.status === 409) {
        setError("Ya existe una sesión para esta clase hoy");
      } else {
        setError(err.response?.data?.message || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async (clase) => {
    if (!clase.session_id) {
      setError("No hay sesión activa para reanudar");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const activated = await activateSession(clase.session_id, 10);
      setSessionData(activated);
      setActiveSession(clase.class_id);
      setIsMinimized(false);
      startPolling(clase.session_id);
    } catch (err) {
      console.error("Error resuming session:", err);
      setError(err.response?.data?.message || "Error al reanudar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleExtend = async (clase) => {
    if (!clase.session_id && !finishedSessions[clase.class_id]) {
      setError("No hay sesión");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sessionId = clase.session_id || finishedSessions[clase.class_id];
      const activated = await activateSession(sessionId, 10);
      setSessionData(activated);
      setActiveSession(clase.class_id);
      setIsMinimized(false);
      // Limpiar de finishedSessions
      setFinishedSessions((prev) => {
        const newState = { ...prev };
        delete newState[clase.class_id];
        return newState;
      });
      startPolling(sessionId);
    } catch (err) {
      setError(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!sessionData?.id_session) return;
    setLoading(true);
    try {
      await finishSession(sessionData.id_session);
      stopPolling();
      // Trackear sesión finalizada
      setFinishedSessions((prev) => ({
        ...prev,
        [activeSession]: sessionData.id_session,
      }));
      setSessionData(null);
      setAttendance(null);
      setIsMinimized(true);
      setActiveSession(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al finalizar");
    } finally {
      setLoading(false);
    }
  };

  const [remainingTime, setRemainingTime] = useState("--:--");

  useEffect(() => {
    const qrExpires = sessionData?.qr_expires;
    if (!qrExpires) return;

    const computeRemaining = () => {
      const diff = new Date(qrExpires) - new Date();
      if (diff <= 0) return "00:00";
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const interval = setInterval(() => {
      setRemainingTime(computeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionData?.qr_expires]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    dragging.current = true;
    offset.current = {
      x: e.clientX - modalPos.x,
      y: e.clientY - modalPos.y,
    };
  };

  const handleMouseMove = (e) => {
    if (dragging.current) {
      setModalPos({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  const present = attendance?.present || 0;
  const late = attendance?.late || 0;
  const totalEnrolled =
    attendance?.total_enrolled || sessionData?.total_students || 0;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {classes.map((clase, index) => {
        const badge = getBadgeInfo(clase);
        return (
          <div
            key={index}
            className={`relative bg-white/5 border ${
              activeSession === clase.class_id
                ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                : "border-white/10"
            } rounded-2xl p-7 transition-all duration-300`}
          >
            <div className="absolute top-6 right-7 flex items-center gap-2.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <span
                className={`h-2.5 w-2.5 rounded-full ${badge.dot} ${badge.pulse ? "animate-pulse" : ""}`}
              ></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
                {badge.label}
              </span>
            </div>

            <div className="space-y-6 mt-6">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Materia
                </p>
                <p className="text-2xl font-bold text-blue-100">
                  {clase.subject}
                </p>
                <p className="text-xs text-gray-500 font-mono mt-1">
                  Class_id: {clase.class_id}
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="opacity-10">
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-3 h-3 bg-white"></div>
                    <div className="w-3 h-3 bg-white"></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">
                    {activeSession === clase.class_id
                      ? "Tiempo restante"
                      : "QR"}
                  </p>
                  <p className="text-xl font-mono font-bold text-blue-400">
                    {activeSession === clase.class_id ? remainingTime : "--:--"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between text-[11px] text-gray-500 font-medium pt-2">
                <div>
                  <p>Fecha</p>
                  <p className="text-gray-300">{formattedDate}</p>
                </div>
                <div className="text-right">
                  <p>Horario</p>
                  <p className="text-gray-300">
                    {clase.time
                      ? formatTime12h(clase.time.split(" - ")[0])
                      : ""}
                  </p>
                </div>
              </div>

              <div className="pt-4 h-16 flex items-center justify-center relative">
                {activeSession === clase.class_id ? (
                  <button
                    onClick={() => setIsMinimized(false)}
                    className="absolute -bottom-2 right-0 p-2.5 bg-white/10 border border-blue-500/50 rounded-xl text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/20 active:scale-90"
                    title="Maximizar"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </button>
                ) : clase.session_status === "FINISHED" ||
                  finishedSessions[clase.class_id] ? (
                  <button
                    onClick={() => handleExtend(clase)}
                    disabled={loading}
                    className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 rounded-xl transition-all"
                  >
                    {loading ? "..." : "Modo extendido"}
                  </button>
                ) : clase.session_status === "ACTIVE" ? (
                  <button
                    onClick={() => handleResume(clase)}
                    disabled={loading}
                    className="absolute -bottom-2 right-0 p-2.5 bg-white/10 border border-blue-500/50 rounded-xl text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/20 active:scale-90 disabled:opacity-50"
                    title="Maximizar"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartSession(clase)}
                    disabled={
                      activeSession !== null ||
                      hasNotStarted(clase) ||
                      clase.status === "past"
                    }
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    title={
                      hasNotStarted(clase)
                        ? "La clase aún no ha comenzado"
                        : clase.status === "past"
                          ? "La clase ya finalizó"
                          : ""
                    }
                  >
                    {loading ? "Iniciando..." : "Iniciar asistencia"}
                  </button>
                )}
              </div>
            </div>

            {activeSession === clase.class_id && !isMinimized && (
              <div
                style={{
                  left: `calc(50% + ${modalPos.x}px)`,
                  top: `calc(50% + ${modalPos.y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseDown={handleMouseDown}
                className="fixed z-[100] w-[450px] bg-[#1e1c26]/95 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.9)] cursor-grab"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Gestión: {clase.subject}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-mono">
                      Control de Sesión
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2 hover:bg-white/10 rounded-xl text-gray-400"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M4 14h6v6m10-10h-6V4m0 6l6-6M10 14l-6 6" />
                    </svg>
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {sessionData?.qr_token && (
                  <div className="bg-white p-6 rounded-[2rem] flex justify-center mb-8">
                    <QRCodeSVG
                      value={sessionData.qr_token}
                      size={220}
                      level="M"
                    />
                  </div>
                )}

                {sessionData && (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">
                        Presentes
                      </p>
                      <p className="text-sm font-bold text-white">
                        <span className="text-green-400 text-lg">
                          {present}
                        </span>{" "}
                        / {totalEnrolled}
                      </p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                      <p className="text-[9px] text-gray-500 uppercase font-black mb-1">
                        Tarde
                      </p>
                      <p className="text-sm font-bold text-white">
                        <span className="text-yellow-400 text-lg">{late}</span>
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleFinish}
                  disabled={loading}
                  className="w-full bg-red-600/10 hover:bg-red-600 border border-red-600/20 text-red-500 hover:text-white font-bold py-3 rounded-2xl transition-all"
                >
                  Finalizar Sesión
                </button>

                <p className="text-center text-[9px] text-gray-600 mt-4">
                  CatsiVard • Secure Session
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SessionCards;
