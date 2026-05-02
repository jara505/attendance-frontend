import api from '../config/axios';

// Obtener perfil del usuario
export const getProfile = async () => {
  const response = await api.get('/profile/me');
  return response.data;
};

// Actualizar foto de perfil
export const updateProfilePhoto = async (file) => {
  // Validar extensión
  const validExtensions = ['png', 'jpg', 'jpeg'];
  const fileName = file.name.toLowerCase();
  const ext = fileName.split('.').pop();
  
  if (!validExtensions.includes(ext)) {
    throw new Error('Solo se permiten imágenes PNG, JPG o JPEG');
  }
  
  // Validar tamaño (máx 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('La imagen no puede pesar más de 5MB');
  }
  
  const formData = new FormData();
  formData.append('photo', file);
  
  const response = await api.post('/profile/photo/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default {
  getProfile,
  updateProfilePhoto,
};