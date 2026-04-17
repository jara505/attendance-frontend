import React, { useState } from 'react';

const Sidebar = ({ setView, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: '🏠' },
    { id: 'courses', label: 'Carreras', icon: '🎓' },
    { id: 'subjects', label: 'Materias', icon: '📚' },
    { id: 'groups', label: 'Grupos', icon: '👥' },
    { id: 'enrollment', label: 'Inscripciones', icon: '📝' },
  ];

  const handleNav = (id) => {
    setView(id);
    setIsOpen(false); // Cierra el menú al hacer click en móvil
  };

  return (
    <>
      {/* Botón para móviles (Hamburguesa) */}
      <div className="md:hidden bg-[#13111a] p-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-500">CatsiVard</h1>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar Principal */}
      <div className={`
        ${isOpen ? 'block' : 'hidden'} 
        md:flex w-full md:w-64 bg-[#13111a] border-r border-gray-800 flex-col min-h-screen md:min-h-0
      `}>
        <div className="p-6 hidden md:block">
          <h1 className="text-xl font-bold text-blue-500">CatsiVard</h1>
          <p className="text-xs text-gray-500">Gestión Académica</p>
        </div>

        <nav className="flex-1 px-4 mt-4 md:mt-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                currentView === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 text-red-400 text-sm hover:bg-red-400/10 p-3 rounded-lg transition">
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;