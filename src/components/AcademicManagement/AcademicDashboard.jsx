// Este archivo decidirá qué pantalla mostrar

import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import Courses from './Courses';
import Subjects from './Subjects';
import Groups from './Groups';
import Enrollment from './Enrollment';

const AcademicDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'courses': 
        return <Courses />;
      case 'subjects': 
        return <Subjects />;
      case 'groups': 
        return <Groups />;
      case 'enrollment': 
        return <Enrollment />;
      default: 
        return (
          <div className="p-10 text-white">
            <h2 className="text-3xl font-bold mb-4">Bienvenido al Panel</h2>
            <p className="text-gray-400 font-light">
              Selecciona una opción del menú lateral para administrar la estructura académica de <span className="text-blue-500 font-semibold">CatsiVard</span>.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50">
                <div className="border border-dashed border-gray-700 p-6 rounded-xl">
                    <p className="text-sm">Resumen de actividad aparecerá aquí...</p>
                </div>
                <div className="border border-dashed border-gray-700 p-6 rounded-xl">
                    <p className="text-sm">Próximas clases aparecerán aquí...</p>
                </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#08060d]">
      <Sidebar setView={setCurrentView} currentView={currentView} />
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default AcademicDashboard;



