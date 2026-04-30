// Aquí manejamos el subject_id y su relación con la carrera.

import React from "react";

const Subjects = () => {
  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-400">
            Gestión de Materias
          </h2>
          <p className="text-sm text-gray-500">
            Administra el catálogo de asignaturas
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition shadow-lg">
          + Nueva Materia
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o ID..."
          className="w-full max-w-md bg-[#13111a] border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="overflow-x-auto bg-[#13111a] rounded-xl border border-gray-800">
        <table className="w-full text-left">
          <thead className="border-b border-gray-800 text-gray-400">
            <tr>
              <th className="p-4 text-xs uppercase">Subject ID</th>
              <th className="p-4 text-xs uppercase">Nombre</th>
              <th className="p-4 text-xs uppercase">Carrera (Course ID)</th>
              <th className="p-4 text-xs uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            <tr className="hover:bg-white/5 transition">
              <td className="p-4 text-blue-300">SUB-101</td>
              <td className="p-4 font-medium">Bases de Datos I</td>
              <td className="p-4 text-gray-400">Ing. en Sistemas</td>
              <td className="p-4">
                <button className="text-gray-400 hover:text-white mr-3">
                  Editar
                </button>
                <button className="text-red-500/70 hover:text-red-400">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subjects;
