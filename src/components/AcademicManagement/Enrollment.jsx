//Esta pantalla es clave para registrar alumnos.
import React from "react";

const Enrollment = () => {
  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-400 mb-6">
        Inscripción de Estudiantes
      </h2>

      <div className="bg-[#13111a] border border-gray-800 rounded-xl p-8 shadow-2xl">
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Seleccionar Estudiante
              </label>
              <select className="w-full bg-[#08060d] border border-gray-800 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none">
                <option>Buscar estudiante...</option>
                <option>2026-0001 - Juan Pérez</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Seleccionar Grupo
              </label>
              <select className="w-full bg-[#08060d] border border-gray-800 rounded-lg px-4 py-2.5 focus:border-blue-500 outline-none">
                <option>Seleccionar materia y grupo...</option>
                <option>Programación II - Grupo A</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all"
            >
              Confirmar Inscripción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Enrollment;
