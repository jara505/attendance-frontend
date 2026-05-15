import React, { useState, useRef, useEffect } from 'react';
// IMPORTANTE: Asegúrate de tener instalada la librería react-router-dom
import { useNavigate } from 'react-router-dom'; 
import { getProfile, updateProfilePhoto } from '../../services/profileService';

const UserAvatar = ({ onLogout }) => {
  const navigate = useNavigate(); // Esto causará error si no se importa arriba
  const [showMenu, setShowMenu] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleToggleMenu = () => setShowMenu(!showMenu);
  const handlePhotoClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await updateProfilePhoto(file);
      const data = await getProfile();
      setProfile(data);
    } catch {
      setError('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={handleToggleMenu}
          className="h-10 w-10 rounded-full border-2 border-blue-500/30 overflow-hidden hover:border-blue-400 transition-all shadow-lg shadow-blue-500/10"
        >
          {profile?.profile_photo ? (
            <img
              src={`${import.meta.env.VITE_API_URL}${profile.profile_photo}`}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold">
              {profile?.first_name?.charAt(0)}
            </div>
          )}
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-3 w-64 bg-[#0d0b14] border border-white/10 rounded-2xl shadow-2xl p-4 z-[100]">
            {loading ? (
              <p className="text-gray-400 text-xs animate-pulse">Cargando...</p>
            ) : profile ? (
              <>
                <div className="flex flex-col items-center mb-4 text-center">
                  <div className="relative group cursor-pointer mb-2" onClick={handlePhotoClick}>
                    <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10">
                      {profile.profile_photo ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${profile.profile_photo}`}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-white/5 flex items-center justify-center text-xl text-white font-bold">
                          {profile.first_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-[10px] text-white font-bold uppercase">Cambiar</span>
                    </div>
                  </div>
                  
                  <p className="text-white font-bold text-sm leading-tight">
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mt-1">
                    {profile.role === 'STUDENT' ? `ID: ${profile.student_card}` : profile.email}
                  </p>
                  {uploading && (
                    <p className="text-blue-300 text-[10px] uppercase font-black tracking-widest mt-2">
                      Subiendo imagen...
                    </p>
                  )}
                  {error && (
                    <p className="text-red-400 text-[10px] uppercase font-black tracking-widest mt-2">
                      {error}
                    </p>
                  )}
                </div>

                <div className="space-y-1 mb-4 border-t border-white/5 pt-4">
                  <button 
                    onClick={() => { navigate('/asistencias'); setShowMenu(false); }}
                    className="w-full text-left p-3 hover:bg-white/5 flex items-center gap-3 transition-all rounded-xl group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-lg group-hover:bg-blue-500 group-hover:text-white transition-all">📅</div>
                    <div>
                      <p className="text-[11px] font-bold text-white group-hover:text-blue-400 transition-colors">Historial Asistencias</p>
                      <p className="text-[9px] text-gray-600 uppercase">Panel detallado</p>
                    </div>
                  </button>
                </div>

                <button
                  onClick={onLogout}
                  className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-red-400 border border-white/5 py-3 rounded-xl hover:bg-red-500/5 transition-all"
                >
                  Cerrar sesión
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>

      {showMenu && (
        <div className="fixed inset-0 z-[90]" onClick={() => setShowMenu(false)} />
      )}
    </>
  );
};

export default UserAvatar;