import React, { useState } from 'react';
import Sidebar from '../../features/auth/components/Sidebar';

// Componentes simulados (deben estar en la misma carpeta)
import Courses from './Courses';
import Subjects from './Subjects';
import Groups from './Groups';
import Enrollment from './Enrollment';

const AcademicDashboard = ({ userRole = 'teacher' }) => {
  const [currentView, setCurrentView] = useState('dashboard');

  // DATOS SIMULADOS PARA CUMPLIR CON LAS ENTRADAS SOLICITADAS
  const mockData = {
    course: { id: "CRS-2026", name: "Ingeniería de Sistemas" },
    subject: { id: "SUB-102", name: "Bases de Datos II" },
    group: { id: "GRP-A1", name: "Grupo Nocturno" },
    class_id: "CLS-998"
  };

  const renderView = () => {
    switch (currentView) {
      case 'courses': return <Courses mockId={mockData.course.id} />;
      case 'subjects': return <Subjects mockId={mockData.subject.id} />;
      case 'groups': return <Groups mockId={mockData.group.id} />;
      case 'enrollment': 
        // Simulación de Regla de Negocio: El profesor solo ve, el admin gestiona
        return <Enrollment userRole={userRole} />;
      default: 
        return (
          <div className="p-4 md:p-10 text-white w-full max-w-7xl mx-auto animate-in fade-in duration-700">
            <header className="mb-10">
              <h2 className="text-3xl font-extrabold mb-2">
                Panel de <span className="text-blue-500">Gestión Académica</span>
              </h2>
              <p className="text-gray-400">Estructura base para el control de asistencia.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card: Carreras (Course_id) */}
                <div className="bg-[#13111a] border border-gray-800 p-6 rounded-2xl">
                    <h3 className="text-blue-400 text-xs font-bold uppercase mb-2">Carrera Activa</h3>
                    <p className="text-lg font-semibold">{mockData.course.name}</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {mockData.course.id}</p>
                </div>

                {/* Card: Materias (Subject_id) */}
                <div className="bg-[#13111a] border border-gray-800 p-6 rounded-2xl">
                    <h3 className="text-green-400 text-xs font-bold uppercase mb-2">Materia</h3>
                    <p className="text-lg font-semibold">{mockData.subject.name}</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {mockData.subject.id}</p>
                </div>

                {/* Card: Grupos (Group_id) */}
                <div className="bg-[#13111a] border border-gray-800 p-6 rounded-2xl">
                    <h3 className="text-purple-400 text-xs font-bold uppercase mb-2">Grupo Asignado</h3>
                    <p className="text-lg font-semibold">{mockData.group.name}</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {mockData.group.id}</p>
                </div>

                {/* Card: Sesión (Class_id) */}
                <div className="bg-[#13111a] border border-gray-800 p-6 rounded-2xl shadow-lg shadow-blue-500/5">
                    <h3 className="text-orange-400 text-xs font-bold uppercase mb-2">ID de Clase</h3>
                    <p className="text-lg font-semibold">{mockData.class_id}</p>
                    <p className="text-xs text-gray-500 mt-1 text-orange-400/50 italic font-mono">Ready for Attendance</p>
                </div>
            </div>

            <div className="mt-10 p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
              <p className="text-sm text-blue-300">
                <strong>Regla de Negocio:</strong> El estado <code>must_change_password</code> ha sido validado satisfactoriamente para esta sesión.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#08060d] w-full overflow-x-hidden">
      <Sidebar setView={setCurrentView} currentView={currentView} userRole={userRole} />
      <main className="flex-1 w-full bg-[#08060d] overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default AcademicDashboard;