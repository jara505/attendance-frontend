import React from 'react';

const AcademicDashboard = ({ userRole = 'teacher', onLogout }) => {
  // DATOS SIMULADOS (Reemplazan la vista vacía por la estructura académica real)
  // Aquí es donde "definimos la base estructural": usamos los IDs requeridos.
  const activeClasses = [
    {
      status: 'activa', // Para el indicador de estado del sketch
      career: 'Ingeniería de Sistemas',
      career_id: 'CRS-IS101', // Course_id
      subject: 'Programación II',
      subject_id: 'SUB-PROG2', // Subject_id
      time: '8:00 - 9:30 AM',
      group: 'K1 - Morning',
      group_id: 'GRP-K1M', // Group_id
      class_id: 'CLS-2026-001' // Class_id (La base para la asistencia)
    },
    {
      status: 'próxima',
      career: 'Ingeniería de Sistemas',
      career_id: 'CRS-IS101', // Course_id
      subject: 'Bases de Datos I',
      subject_id: 'SUB-DB101', // Subject_id
      time: '11:00 AM - 12:30 PM',
      group: 'L2 - Morning',
      group_id: 'GRP-L2M', // Group_id
      class_id: 'CLS-2026-002', // Class_id
      starts_in: '45 min' // Dato extra para la UI del sketch
    },
    {
      status: 'próxima',
      career: 'Ingeniería Industrial',
      career_id: 'CRS-II105', // Course_id
      subject: 'Cálculo III',
      subject_id: 'SUB-CALC3', // Subject_id
      time: '2:00 - 3:30 PM',
      group: 'M1 - Afternoon',
      group_id: 'GRP-M1A', // Group_id
      class_id: 'CLS-2026-003', // Class_id
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#08060d] text-white p-4 md:p-10 font-sans">
      {/* HEADER: Integrado al estilo de la App */}
      <header className="flex items-center justify-between pb-8 border-b border-gray-800 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Catsi<span className="text-blue-500">Vard</span>
          </h1>
          <p className="text-gray-400 mt-1">Gestión Académica • Panel del Docente</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold text-sm">Bienvenido, Docente</p>
            <p className="text-xs text-blue-400 font-mono uppercase">Rol: {userRole}</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-xs text-gray-500 hover:text-red-400 transition font-medium border border-gray-800 px-3 py-1 rounded-full bg-[#13111a]"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL: La grilla de tarjetas del sketch */}
      <main>
        <div className="mb-10 p-6 bg-blue-950/20 border border-blue-900 rounded-2xl">
            <h2 className="text-2xl font-bold">Mis Clases de Hoy</h2>
            <p className="text-blue-300 text-sm mt-1">Estructura académica base definida y lista para la toma de asistencia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeClasses.map((clase, index) => (
            <div 
              key={index} 
              className="relative bg-[#13111a] border border-gray-800 rounded-2xl p-7 shadow-2xl transition-all duration-300 hover:border-blue-700 group hover:-translate-y-1"
            >
              {/* STATUS INDICATOR (Siguiendo el sketch, con estilo CatsiVard) */}
              <div className="absolute top-6 right-7 flex items-center gap-2.5 bg-[#08060d] px-3 py-1.5 rounded-full border border-gray-800">
                <span className={`h-2.5 w-2.5 rounded-full ${clase.status === 'activa' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></span>
                <span className={`text-xs font-bold uppercase tracking-wider ${clase.status === 'activa' ? 'text-green-400' : 'text-orange-400'}`}>
                  {clase.status === 'activa' ? 'Clase Activa' : `Inicia en ${clase.starts_in || '-- min'}`}
                </span>
              </div>

              {/* DETALLES DE LA CLASE (Estructura Académica e IDs) */}
              <div className="space-y-6 mt-6">
                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Materia</p>
                    <p className="text-2xl font-bold text-blue-100 group-hover:text-blue-400 transition">{clase.subject}</p>
                    <p className="text-xs text-blue-300/60 font-mono mt-1">ID: {clase.subject_id}</p>
                </div>

                <div className="border-t border-gray-800 pt-5">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Carrera</p>
                    <p className="text-lg font-semibold text-gray-200">{clase.career}</p>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {clase.career_id}</p>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2 text-sm text-gray-300 bg-[#08060d] p-4 rounded-xl border border-gray-800">
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="font-medium text-gray-200">{clase.time}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    <span className="font-medium text-gray-200">{clase.group}</span>
                    <span className="text-xs text-gray-600 font-mono">({clase.group_id})</span>
                  </div>
                </div>
              </div>

              {/* ACCIÓN PRINCIPAL (El botón del sketch con Class_id definido) */}
              <div className="mt-8 pt-6 border-t border-gray-800">
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl transition duration-150 shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                  Generar QR de Asistencia
                </button>
                <p className="text-center text-xs text-gray-700 font-mono mt-3">Class ID: {clase.class_id}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER: Mantenemos la identidad corporativa */}
      <footer className="mt-20 pt-8 border-t border-gray-800 text-center text-xs text-gray-600">
        © 2026 CatsiVard System • Professional Edition • Módulo de Gestión Académica (UI v1.0)
      </footer>
    </div>
  );
};

export default AcademicDashboard;