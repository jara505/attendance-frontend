import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Courses from './Courses';
import Subjects from './Subjects';
import Groups from './Groups';
import Enrollment from './Enrollment';

const AcademicDashboard = ({ userRole = 'teacher' }) => { // Por defecto teacher para la prueba
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'courses': return <Courses />;
      case 'subjects': return <Subjects />;
      case 'groups': return <Groups />;
      case 'enrollment': return <Enrollment />;
      default: 
        return (
          <div className="p-4 md:p-10 text-white w-full max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Bienvenido, {userRole === 'teacher' ? 'Profesor' : 'Administrador'}</h2>
            <p className="text-gray-400 font-light mb-8 text-sm md:text-base">
              Panel de control <span className="text-blue-500 font-semibold">CatsiVard</span>.
            </p>
            
            {/* Sección de Resumen (Cumple requerimiento de info para docente) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#13111a] border border-gray-800 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-blue-400 text-sm font-bold uppercase mb-2">Clases de Hoy</h3>
                    <p className="text-2xl font-bold">4 Sesiones</p>
                    <p className="text-xs text-gray-500 mt-2">Próxima: 10:30 AM - Bases de Datos</p>
                </div>
                <div className="bg-[#13111a] border border-gray-800 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-green-400 text-sm font-bold uppercase mb-2">Total Alumnos</h3>
                    <p className="text-2xl font-bold">128</p>
                    <p className="text-xs text-gray-500 mt-2">Inscritos en tus 3 materias</p>
                </div>
                <div className="bg-[#13111a] border border-gray-800 p-6 rounded-2xl shadow-xl lg:col-span-1 md:col-span-2">
                    <h3 className="text-purple-400 text-sm font-bold uppercase mb-2">Asistencia Promedio</h3>
                    <p className="text-2xl font-bold">92%</p>
                    <p className="text-xs text-gray-500 mt-2">Ultimos 30 días</p>
                </div>
            </div>

            <div className="mt-10 bg-[#13111a]/50 border border-dashed border-gray-800 p-8 rounded-2xl text-center">
                <p className="text-gray-500">Gráfico de rendimiento académico (Módulo en desarrollo)</p>
            </div>
          </div>
        );
    }
  };

  return (
    // Se añade flex-col en móvil y flex-row en escritorio
    <div className="flex flex-col md:flex-row min-h-screen bg-[#08060d] w-full overflow-x-hidden">
      <Sidebar setView={setCurrentView} currentView={currentView} />
      <main className="flex-1 w-full overflow-x-hidden">
        {renderView()}
      </main>
    </div>
  );
};

export default AcademicDashboard;