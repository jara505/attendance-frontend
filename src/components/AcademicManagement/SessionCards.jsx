import React, { useState, useRef } from 'react';

const SessionCards = ({ classes = [] }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [modalPos, setModalPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const today = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  // 2. Lógica para mover la ventana tocando en cualquier lugar
  const handleMouseDown = (e) => {
    // Solo iniciamos el arrastre si es con el botón izquierdo
    if (e.button !== 0) return;
    dragging.current = true;
    
    // Calculamos el desfase entre el mouse y la posición actual del modal
    offset.current = {
      x: e.clientX - modalPos.x,
      y: e.clientY - modalPos.y
    };
  };

  const handleMouseMove = (e) => {
    if (dragging.current) {
      setModalPos({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y
      });
    }
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative select-none" 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {classes.map((clase, index) => (
        <div 
          key={index} 
          className={`relative bg-[#13111a] border ${activeSession === clase.class_id ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'border-gray-800'} rounded-2xl p-7 transition-all duration-300`}
        >
          {/* Badge de Estado */}
          <div className="absolute top-6 right-7 flex items-center gap-2.5 bg-[#08060d] px-3 py-1.5 rounded-full border border-gray-800">
            <span className={`h-2.5 w-2.5 rounded-full ${activeSession === clase.class_id ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
              {activeSession === clase.class_id ? 'En Proceso' : 'Pendiente'}
            </span>
          </div>

          <div className="space-y-6 mt-6">
            <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Materia</p>
                <p className="text-2xl font-bold text-blue-100 italic">{clase.subject}</p>
                <p className="text-xs text-gray-500 font-mono mt-1 italic">Class_id: {clase.class_id}</p>
            </div>

            {/* Monitor de Tiempo Estático */}
            <div className="bg-[#08060d] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                <div className="opacity-10"><div className="grid grid-cols-2 gap-0.5"><div className="w-3 h-3 bg-white"></div><div className="w-3 h-3 bg-white"></div></div></div>
                <div className="text-right">
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest italic">Tiempo Restante</p>
                    <p className="text-xl font-mono font-bold text-gray-700 italic">--:--</p>
                </div>
            </div>

            <div className="flex justify-between text-[11px] text-gray-500 font-medium uppercase italic pt-2">
                <div><p>Fecha</p><p className="text-gray-300">{today}</p></div>
                <div className="text-right"><p>Horario</p><p className="text-gray-300">{clase.time}</p></div>
            </div>

            <div className="pt-4 h-16 flex items-center justify-center relative">
                {activeSession === clase.class_id && isMinimized ? (
                    /* 1. Posición de minimizado reubicada para no estorbar */
                    <button 
                        onClick={() => setIsMinimized(false)}
                        className="absolute -bottom-2 right-0 p-2.5 bg-[#13111a] border border-blue-500/50 rounded-xl text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-blue-500/20 active:scale-90"
                        title="Maximizar Gestión"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                        </svg>
                    </button>
                ) : (
                    <button 
                        onClick={() => { setActiveSession(clase.class_id); setIsMinimized(false); }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-95 disabled:opacity-30 disabled:grayscale"
                        disabled={activeSession && activeSession !== clase.class_id}
                    >
                        Iniciar asistencia
                    </button>
                )}
            </div>
          </div>

          {/* VENTANA EMERGENTE (MODAL) */}
          {activeSession === clase.class_id && !isMinimized && (
            <div 
              style={{ 
                left: `calc(50% + ${modalPos.x}px)`, 
                top: `calc(50% + ${modalPos.y}px)`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseDown={handleMouseDown}
              className="fixed z-[100] w-[450px] bg-[#1e1c26] border border-gray-700 rounded-3xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.9)] cursor-grab active:cursor-grabbing select-none"
            >
                {/* Header del Modal */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white italic tracking-tight">Gestión: {clase.subject}</h3>
                        <p className="text-[10px] text-gray-500 font-mono italic">Control de Sesión Activa</p>
                    </div>
                    <button 
                        onMouseDown={(e) => e.stopPropagation()} // Evita que el click para cerrar active el arrastre
                        onClick={() => setIsMinimized(true)} 
                        className="p-2 hover:bg-white/10 rounded-xl text-gray-400 transition-colors"
                    >
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 14h6v6m10-10h-6V4m0 6l6-6M10 14l-6 6"></path></svg>
                    </button>
                </div>

                {/* QR Section */}
                <div className="bg-white p-6 rounded-[2rem] flex justify-center mb-8 shadow-inner overflow-hidden">
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${clase.class_id}`} 
                        alt="QR Asistencia" 
                        className="w-56 h-56 object-contain pointer-events-none" 
                    />
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8 italic">
                    <div className="bg-[#13111a] p-3 rounded-2xl border border-gray-800">
                        <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Registrados</p>
                        <p className="text-sm font-bold text-white"><span className="text-blue-400 text-lg">18</span> / 30</p>
                    </div>
                    <div className="bg-[#13111a] p-3 rounded-2xl border border-gray-800">
                        <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Cierre Automático</p>
                        <p className="text-sm font-bold text-orange-400 text-lg">08:45</p>
                    </div>
                </div>

                {/* Footer Action */}
                <button 
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => { setActiveSession(null); setModalPos({x:0, y:0}); }}
                    className="w-full bg-red-600/10 hover:bg-red-600 border border-red-600/20 text-red-500 hover:text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
                >
                    Finalizar Asistencia
                </button>
                <p className="text-center text-[9px] text-gray-600 italic mt-4 uppercase tracking-[2px]">CatsiVard • Secure Session</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SessionCards;