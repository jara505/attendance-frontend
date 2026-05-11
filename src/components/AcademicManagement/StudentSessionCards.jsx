import React, { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";


// SUBMÓDULO INTERNO: CALENDARIO DE ASISTENCIA 

const AttendanceCalendarModal = ({ isOpen, onClose, subjectName }) => {
  if (!isOpen) return null;

  const daysOfWeek = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

  // Datos estáticos para representar el calendario de Mayo 2026 (Referencia image_bf4c65.jpg)
  const calendarDays = [
    { type: "empty" }, { type: "empty" }, { type: "empty" }, { type: "empty" },
    { day: 1, status: "p" }, { day: 2, status: "p" }, { day: 3, status: "t" },
    { day: 4, status: "p" }, { day: 5, status: "p" }, { day: 6, status: "p" },
    { day: 7, status: "p" }, { day: 8, status: "a" }, { day: 9, status: "p" },
    { day: 10, status: "p" }, { day: 11, status: "p" }, { day: 12, status: "p" },
    { day: 13, status: "p" }, { day: 14, status: "p" }, { day: 15, status: "p" },
    { day: 16, status: "p" }, { day: 17, status: "p" }, { day: 18, status: "p" },
    { day: 19, status: "p" }, { day: 20, status: "p" }, { day: 21, status: "sc" },
    { day: 22, status: "sc" }, { day: 23, status: "p" },
  ];

  const renderStatus = (status) => {
    if (status === "p") return <span className="text-green-500 font-bold text-lg">✓</span>;
    if (status === "t") return <span className="text-yellow-500 font-bold text-lg">◔</span>;
    if (status === "a") return <span className="text-red-500 font-bold text-lg">✕</span>;
    if (status === "sc") return <span className="text-gray-600 font-bold text-lg">—</span>;
    return null;
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0d0b14] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="p-6 pb-2 flex justify-between items-center">
          <button onClick={onClose} className="bg-white/5 hover:bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
            <span>❮</span> Volver
          </button>
          <div className="text-right">
            <h2 className="text-lg font-bold text-white leading-tight">{subjectName || "Materia"}</h2>
            <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest">Mayo 2026</p>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-[#13111a] border border-white/5 rounded-2xl p-4 shadow-inner">
            <div className="grid grid-cols-7 gap-1 mb-4 border-b border-white/5 pb-2">
              {daysOfWeek.map(d => (
                <span key={d} className="text-[9px] text-center font-bold text-gray-500 uppercase tracking-tighter">{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-4">
              {calendarDays.map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center min-h-[40px]">
                  {item.type !== "empty" && (
                    <>
                      <span className="text-[10px] font-medium text-gray-400 mb-1">{item.day.toString().padStart(2, '0')}</span>
                      <div className="h-4 flex items-center">{renderStatus(item.status)}</div>
                    </>
                  )}
                </div>
              ))}
              <div className="col-span-2 flex items-center pl-2">
                <span className="text-[9px] text-gray-600 italic font-medium">(Sin clase)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
            <div className="flex items-center gap-1"><span className="text-green-500 text-sm">✓</span> Presente</div>
            <div className="flex items-center gap-1"><span className="text-yellow-500 text-sm">◔</span> Tardanza</div>
            <div className="flex items-center gap-1"><span className="text-red-500 text-sm">✕</span> Ausencia</div>
          </div>
        </div>

        <div className="p-3 bg-black/20 text-center">
          <p className="text-[9px] text-gray-700 uppercase font-bold tracking-widest">CatsiVard • Visual History</p>
        </div>
      </div>
    </div>
  );
};

// COMPONENTE PRINCIPAL

const StudentSessionCards = ({ classes = [] }) => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [_scannedResult, setScannedResult] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [, setSelectedClass] = useState(null);
  
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
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  const getBadgeInfo = (clase) => {
    const status = clase.status?.toLowerCase();
    if (status === "past") return { label: "Finalizada", dot: "bg-gray-500", pulse: false };
    if (status === "future") return { label: "Próxima", dot: "bg-orange-500", pulse: false };
    if (status === "active") {
      const now = new Date();
      const start = buildTodayAt(clase.start_time);
      const end = buildTodayAt(clase.end_time);
      if (start && end && now > end) return { label: "Finalizada", dot: "bg-gray-500", pulse: false };
      return { label: "En proceso", dot: "bg-green-500", pulse: true };
    }
    return { label: "Pendiente", dot: "bg-orange-500", pulse: false };
  };

  const handleOpenScanner = (e, clase) => {
    e.stopPropagation();
    setSelectedClass(clase);
    setScannerOpen(true);
    setCameraError("");
    setScannedResult("");
    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;
        await html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, 
          async (text) => {
            setScannedResult(text);
            await html5QrCode.stop();
            setScannerOpen(false);
          }, () => {}
        );
      } catch { setCameraError("Error de cámara"); }
    }, 300);
  };

  const handleOpenDetail = (clase) => {
    setClassForDetail(clase);
    setDetailOpen(true);
  };

  const closeScanner = async () => {
    if (scannerRef.current) await scannerRef.current.stop().catch(() => {});
    setScannerOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {classes.map((clase, index) => {
        const badge = getBadgeInfo(clase);
        return (
          <div key={index} onClick={() => handleOpenDetail(clase)}
            className="group relative bg-white/5 border border-white/10 hover:border-blue-500/50 rounded-2xl p-6 transition-all cursor-pointer shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-full border border-white/10">
                <span className={`h-2 w-2 rounded-full ${badge.dot} ${badge.pulse ? "animate-pulse" : ""}`} />
                <span className="text-[9px] font-black uppercase text-gray-300">{badge.label}</span>
              </div>
              <span className="text-[10px] font-bold text-gray-500 px-2 py-0.5 border border-white/5 rounded-md">{clase.group}</span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-blue-100 group-hover:text-blue-400 transition-colors leading-tight">{clase.subject}</h3>
                <p className="text-xs text-gray-500 mt-1">{clase.course}</p>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Horario</p>
                <p className="text-sm font-semibold text-gray-200">
                  {clase.start_time ? `${formatTime12h(clase.start_time)} – ${formatTime12h(clase.end_time)}` : "—"}
                </p>
              </div>

              <button onClick={(e) => handleOpenScanner(e, clase)}
                disabled={clase.status?.toLowerCase() === "past" || !clase.qr_available}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-20"
              >
                Escanear QR
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
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-white">Escanear QR</h2>
              <button onClick={closeScanner} className="text-gray-400 text-2xl">✕</button>
            </div>
            <div id="reader" className="overflow-hidden rounded-2xl border border-white/5" />
            {cameraError && <p className="mt-4 text-red-400 text-center text-sm">{cameraError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSessionCards;