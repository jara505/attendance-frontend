import api from '../config/axios';

// Obtener la fecha actual en formato YYYY-MM-DD usando timezone local
const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Obtener sesiones de una clase por fecha
 * @param {string} idClass - ID de la clase
 * @param {string} sessionDate - Fecha de la sesión (opcional)
 * @returns {Promise} - Retorna las sesiones
 */
export const getSessionsByClass = async (idClass, sessionDate = getTodayDate()) => {
  const response = await api.get(`/sessions`, {
    params: { id_class: idClass, session_date: sessionDate },
  });
  return response.data;
};

/**
 * Obtener una sesión específica
 * @param {string} sessionId - ID de la sesión
 * @returns {Promise} - Retorna la sesión
 */
export const getSession = async (sessionId) => {
  const response = await api.get(`/sessions/${sessionId}`);
  return response.data;
};

/**
 * Crear una nueva sesión de asistencia para una clase
 * @param {string} idClass - ID de la clase
 * @param {string} sessionDate - Fecha de la sesión (opcional, usa hoy si no se provee)
 * @returns {Promise} - Retorna la sesión creada
 */
export const createSession = async (idClass, sessionDate = getTodayDate()) => {
  const response = await api.post('/sessions', {
    id_class: idClass,
    session_date: sessionDate,
  });
  return response.data;
};

/**
 * Activar una sesión (generar QR)
 * @param {string} sessionId - ID de la sesión
 * @param {number} qrDurationMinutes - Duración del QR en minutos (default: 10)
 * @returns {Promise} - Retorna la sesión activada con qr_token
 */
export const activateSession = async (sessionId, qrDurationMinutes = 10) => {
  const response = await api.post(`/sessions/${sessionId}/activate`, {
    qr_duration_minutes: qrDurationMinutes,
  });
  return response.data;
};

/**
 * Obtener asistencia de una sesión específica
 * @param {string} sessionId - ID de la sesión
 * @returns {Promise} - Retorna estadísticas de asistencia
 */
export const getSessionAttendance = async (sessionId) => {
  const response = await api.get(`/sessions/${sessionId}/attendance`);
  return response.data;
};

/**
 * Finalizar una sesión (marcar ausentes y cerrar)
 * @param {string} sessionId - ID de la sesión
 * @returns {Promise} - Retorna la sesión finalizada
 */
export const finishSession = async (sessionId) => {
  const response = await api.post(`/sessions/${sessionId}/finish`);
  return response.data;
};

/**
 * Extender el tiempo del QR de una sesión
 * @param {string} sessionId - ID de la sesión
 * @returns {Promise} - Retorna la sesión con tiempo extendido
 */
export const extendSession = async (sessionId) => {
  const response = await api.post(`/sessions/${sessionId}/extend`);
  return response.data;
};

export default {
  createSession,
  activateSession,
  getSessionAttendance,
  finishSession,
  extendSession,
  getSessionsByClass,
  getSession,
};