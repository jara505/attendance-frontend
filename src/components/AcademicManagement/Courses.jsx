import React from "react";

const Courses = () => {
  return (
    <div className="p-6 bg-[#08060d] min-height-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-400">
          Gestión de Carreras
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition shadow-lg">
          + Nueva Carrera
        </button>
      </div>

      <div className="overflow-x-auto bg-[#13111a] rounded-xl border border-gray-800">
        <table className="w-full text-left">
          <thead className="border-b border-gray-800 text-gray-400">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Nombre de la Carrera</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-800/50 hover:bg-white/5 transition">
              <td className="p-4 text-sm">C001</td>
              <td className="p-4 font-medium">Ingeniería en Sistemas</td>
              <td className="p-4 text-blue-400 cursor-pointer hover:underline">
                Editar
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Courses;
