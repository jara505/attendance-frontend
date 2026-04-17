import React from 'react';

const Sidebar = ({ setView, currentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: '🏠' },
    { id: 'courses', label: 'Carreras', icon: '🎓' },
    { id: 'subjects', label: 'Materias', icon: '📚' },
    { id: 'groups', label: 'Grupos', icon: '👥' },
    { id: 'enrollment', label: 'Inscripciones', icon: '📝' },
  ];

  return (
    <div className="w-64 bg-[#13111a] border-r border-gray-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-500">CatsiVard</h1>
        <p className="text-xs text-gray-500">Gestión Académica</p>
      </div>
      <nav className="flex-1 px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
              currentView === item.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button className="text-red-400 text-sm hover:underline">Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default Sidebar;