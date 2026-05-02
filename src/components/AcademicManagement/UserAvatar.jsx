import React, { useState, useRef, useEffect } from 'react';
import { getProfile, updateProfilePhoto } from '../../services/profileService';

const UserAvatar = ({ onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Cargar perfil al inicio
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

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    
    try {
      await updateProfilePhoto(file);
      // Actualizar perfil local
      setProfile(prev => ({
        ...prev,
        photo_url: `${import.meta.env.VITE_API_URL}/profile/photo?t=${Date.now()}`
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al subir foto');
    } finally {
      setUploading(false);
    }
  };

  // Obtener iniciales
  const getInitials = () => {
    if (!profile) return '';
    const first = profile.first_name?.[0] || '';
    const last = profile.last_name?.[0] || '';
    return (first + last).toUpperCase() || '';
  };

  // URL de la foto
  const photoUrl = profile?.photo_url 
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}${profile.photo_url}`
    : null;

  return (
    <div className="relative">
      {/* Avatar button */}
      <button
        onClick={handleToggleMenu}
        className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden hover:bg-blue-500 transition"
      >
        {photoUrl ? (
          <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
        ) : getInitials() || (
          <span className="text-xs">...</span>
        )}
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-[#1e1c26] border border-gray-700 rounded-2xl p-4 shadow-xl z-50">
          {loading ? (
            <p className="text-gray-400 text-sm">Cargando...</p>
          ) : profile ? (
            <>
              {/* Foto */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden mb-2">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
                  ) : (
                    getInitials()
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  onClick={handlePhotoClick}
                  disabled={uploading}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  {uploading ? 'Subiendo...' : 'Cambiar foto'}
                </button>
                {error && (
                  <p className="text-xs text-red-400 mt-1">{error}</p>
                )}
              </div>

              {/* Info */}
              <div className="text-center mb-4">
                <p className="text-white font-semibold">
                  {profile.first_name} {profile.last_name}
                </p>
                {profile.role === 'STUDENT' ? (
                  <p className="text-gray-400 text-xs">Carné: {profile.student_card}</p>
                ) : (
                  <p className="text-gray-400 text-xs">{profile.email}</p>
                )}
              </div>

              {/* Cerrar sesión */}
              <button
                onClick={onLogout}
                className="w-full text-xs text-gray-400 hover:text-red-400 border border-gray-700 py-2 rounded-lg"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <p className="text-gray-400 text-sm">Error al cargar perfil</p>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default UserAvatar;