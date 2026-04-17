import React, { useState } from 'react';
import Sidebar from '../../features/auth/components/Sidebar';

// Imports de componentes (Asegúrate de que estén en la misma carpeta)
import Courses from './Courses';
import Subjects from './Subjects';
import Groups from './Groups';
import Enrollment from './Enrollment';

const AcademicDashboard = ({ userRole = 'teacher' }) => {
  const [currentView, setCurrentView] = useState('dashboard');

  // Lógica de protección: Solo el Admin entra a Enrollment
  const renderView = () => {
    switch (currentView) {
      case 'courses': 
        return <Courses userRole={userRole} />;
      case 'subjects': 
        return <Subjects userRole={userRole} />;
      case 'groups': 
        return <Groups userRole={userRole} />;
      case 'enrollment': 
        // Lógica para el PR: Si es profesor, denegar acceso a Matrículas
        if (userRole === 'admin') {
          return <Enrollment />;
        } else {
          return (
            <div className="flex flex-col items-center justify-center h-screen text-white p-10">
              <h2 className="text-3xl font-bold text-red-500">Acceso Denegado</h2>
              <p className="text-gray-400 mt-2">Solo el administrador puede gestionar matrículas.</p>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
              >
                Volver al Panel
              </button>
            </div>
          );
        }
      default: 
        return (
          <div className="p-4 md:p-10 text-white w-full max-w-7xl mx-auto">
            <header className="mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
                Bienvenido, <span className="text-blue-500">{userRole === 'teacher' ? 'Profesor' : 'Administrador'}</span>
              </h2>
              <p className="text-gray-400 font-light text-sm md:text-base">
                Sistema de Gestión Académica <span className="text-blue-500/80 font-semibold italic">CatsiVard Professional</span>.
              </p>
            </header>
            
            {/* Grid dinámico que cambia según el rol */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#13111a] border border-gray-800/50 p-6 rounded-2xl shadow-2xl hover:border-blue-500/30 transition-all">
                    <h3 className="text-blue-400 text-xs font-black uppercase mb-3 tracking-widest">Cursos Asignados</h3>
                    <p className="text-3xl font-bold">04</p>
                    <p className="text-xs text-gray-500 mt-2 italic">Ciclo Lectivo 2026</p>
                </div>

                <div className="bg-[#13111a] border border-gray-800/50 p-6 rounded-2xl shadow-2xl hover:border-green-500/30 transition-all">
                    <h3 className="text-green-400 text-xs font-black uppercase mb-3 tracking-widest">Estudiantes a Cargo</h3>
                    <p className="text-3xl font-bold">128</p>
                    <p className="text-xs text-gray-500 mt-2 italic">Total inscritos en tus materias</p>
                </div>

                <div className="bg-[#13111a] border border-gray-800/50 p-6 rounded-2xl shadow-2xl lg:col-span-1 md:col-span-2 hover:border-purple-500/30 transition-all">
                    <h3 className="text-purple-400 text-xs font-black uppercase mb-3 tracking-widest">Reportes Pendientes</h3>
                    <p className="text-3xl font-bold">02</p>
                    <p className="text-xs text-gray-500 mt-2 italic">Cierre de actas próximo viernes</p>
                </div>
            </div>

            <div className="mt-10 bg-[#13111a]/30 border border-dashed border-gray-800/60 p-12 rounded-3xl text-center">
                <div className="inline-block p-3 bg-blue-500/10 rounded-full mb-4">
                  <span className="text-blue-500 text-sm font-bold tracking-widest uppercase">Módulo Analítico</span>
                </div>
                <p className="text-gray-500 max-w-md mx-auto">
                  El gráfico de rendimiento académico está en desarrollo para el próximo sprint.
                </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#08060d] w-full overflow-x-hidden">
      {/* Sidebar recibe el rol para ocultar botones no permitidos */}
      <Sidebar 
        setView={setCurrentView} 
        currentView={currentView} 
        userRole={userRole} 
      />
      
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-[#08060d]">
        <div className="animate-in fade-in duration-500">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default AcademicDashboard;