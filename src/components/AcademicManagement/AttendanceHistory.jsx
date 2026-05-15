import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AttendanceHistory = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = [
    { id: 1, name: "Cálculo Numérico", sessions: 18, total: 20, percentage: 90, color: "from-blue-500/20 to-cyan-400/5" },
    { id: 2, name: "Bases de Datos I", sessions: 15, total: 15, percentage: 100, color: "from-purple-500/20 to-indigo-400/5" },
    { id: 3, name: "Programación II", sessions: 12, total: 14, percentage: 85, color: "from-emerald-500/20 to-teal-400/5" },
    { id: 4, name: "Inglés Técnico", sessions: 10, total: 10, percentage: 100, color: "from-orange-500/20 to-yellow-400/5" },
  ];

  const calendarDays = Array.from({ length: 31 }, (_, i) => {
    const statuses = ['present', 'absent', 'late', 'none'];
    const randomStatus = i > 25 ? 'none' : statuses[i % 3];
    return { day: i + 1, status: randomStatus };
  });

  // Vista Detallada (Calendario)
  if (selectedSubject) {
    return (
      <div className="min-h-screen bg-[#08060d] text-white p-6 pt-28 animate-in fade-in zoom-in duration-300">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-10">
            {/* Botón Volver (Estilo Neón Pulido) */}
            <button 
              onClick={() => setSelectedSubject(null)} 
              className="px-6 py-2 border border-blue-500/50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 hover:bg-blue-500/10 transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]"
            >
              ❮ Volver
            </button>
            <div className="text-right">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                {selectedSubject.name}
              </h2>
              <p className="text-[10px] font-bold text-gray-600 tracking-widest uppercase">REGISTRO MENSUAL • MAYO 2026</p>
            </div>
          </header>

          <div className="bg-[#110f18] border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-7 mb-8 text-center text-[10px] font-black text-gray-600 tracking-widest uppercase">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => <span key={d}>{d}</span>)}
            </div>

            <div className="grid grid-cols-7 gap-3">
              <div className="col-span-4"></div> {/* Espaciado para inicio de mes */}
              {calendarDays.map((item) => (
                <div 
                  key={item.day}
                  className={`aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all
                    ${item.status === 'present' ? 'bg-green-500/5 border-green-500/20' : 
                      item.status === 'late' ? 'bg-orange-500/5 border-orange-500/20' : 
                      item.status === 'absent' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/[0.02] border-white/5 opacity-30'}
                  `}
                >
                  <span className="text-[10px] font-bold text-gray-500 mb-1">{item.day}</span>
                  {item.status !== 'none' && (
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      item.status === 'present' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 
                      item.status === 'late' ? 'bg-orange-500 shadow-[0_0_8px_#f97316]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Simbología / Leyenda del Calendario */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 border-t border-white/5 pt-8">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Presente</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]" />
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Tardanza</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Ausencia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista Principal (Lista de Materias)
  return (
    <div className="min-h-screen bg-[#08060d] text-white p-6 pt-28 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          {/* Logo con estilo exacto: Blanco y Azul */}
          <h1 className="text-6xl font-extrabold tracking-tighter">
            <span className="text-white">Catsi</span>
            <span className="text-[#3b82f6]">Vard</span>
          </h1>

          {/* Botón Volver al Dashboard (Estilo Pulido) */}
          <button 
            onClick={() => navigate('/dashboard')} 
            className="px-8 py-3 bg-transparent border border-blue-500/50 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-blue-400 hover:bg-blue-500/10 hover:text-white hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300"
          >
            Volver al Dashboard
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subjects.map((s) => (
            <div 
              key={s.id} 
              className="group relative bg-[#11111a] border border-white/5 rounded-[2.5rem] p-10 overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-2xl"
            >
              {/* Reflejo neón de fondo */}
              <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${s.color} blur-3xl opacity-20`} />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white/90 group-hover:text-blue-400 transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-600 tracking-[0.2em] mt-1 uppercase italic">Ciclo Académico 2026</p>
                  </div>
                  <span className="text-4xl font-black italic text-white/90">{s.percentage}%</span>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                    <span className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Materia Activa</span>
                  </div>
                  <button 
                    onClick={() => setSelectedSubject(s)}
                    className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-all border-b border-transparent hover:border-white"
                  >
                    Ver Detalles →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-24 text-center text-[10px] font-black uppercase text-gray-800 tracking-[1.5em] select-none">
          CatsiVard Academic • 2026
        </p>
      </div>
    </div>
  );
};

export default AttendanceHistory;