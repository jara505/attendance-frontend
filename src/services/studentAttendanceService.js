import api from "../config/axios";

// OBTENER RESUMEN SEMESTRAL DE ASISTENCIA
export const getSemesterAttendance = async (year = 2026) => {
  try {
    const response = await api.get("/student/attendance", {
      params: {
        year,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error obteniendo asistencia semestral:", error);
    throw error;
  }
};

// OBTENER DETALLE DE ASISTENCIA POR MATERIA Y MES
export const getSubjectAttendanceDetail = async (
  subjectId,
  month,
  year = 2026
) => {
  try {
    const response = await api.get(
      `/student/attendance/${subjectId}`,
      {
        params: {
          month,
          year,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error obteniendo detalle de asistencia:", error);
    throw error;
  }
};