import api from '../config/axios';

/**
 * Registrar asistencia con QR token
 * @param {string} qrToken - Token obtenido del QR escaneado
 * @returns {Promise} - Retorna el resultado del registro
 */
export const checkIn = async (qrToken) => {
  const response = await api.post('/attendance/check-in', {
    qr_token: qrToken,
  });
  return response.data;
};

export default {
  checkIn,
};