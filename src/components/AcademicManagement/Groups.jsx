// Aquí es donde el docente organiza sus secciones (group_id).

import React from 'react';

const Groups = () => {
  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-400">Grupos Activos</h2>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition">
          + Crear Grupo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card de Ejemplo */}
        <div className="bg-[#13111a] border border-gray-800 p-5 rounded-xl hover:border-blue-500/50 transition">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded">ID: GRP-2024-A</span>
            <span className="text-gray-500 text-xs">35 Estudiantes</span>
          </div>
          <h3 className="text-lg font-bold mb-1">Cálculo Numérico</h3>
          <p className="text-sm text-gray-500 mb-4">Sección: Matutina</p>
          <div className="flex gap-2">
            <button className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-sm transition">Ver Lista</button>
            <button className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded-lg text-sm transition">Asistencia</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;