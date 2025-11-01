// api.js - Cliente API centralizado

/**
 * Obtiene la lista de todos los estudiantes
 * @returns {Promise<Object>} Lista de estudiantes
 */
async function getStudents() {
    const response = await fetch(`${CONFIG.API_URL}/api/estudiantes`);

    if (!response.ok) {
        throw new Error('Error al cargar estudiantes');
    }

    return await response.json();
}

/**
 * Obtiene las asistencias del dia actual
 * @returns {Promise<Object>} Lista de asistencias de hoy
 */
async function getAttendanceToday() {
    const response = await fetch(`${CONFIG.API_URL}/api/asistencia/hoy`);

    if (!response.ok) {
        throw new Error('Error al cargar asistencias');
    }

    return await response.json();
}

/**
 * Agrega un nuevo estudiante con su foto
 * @param {FormData} formData - Datos del formulario (nombre, rut, foto)
 * @returns {Promise<Object>} Datos del estudiante creado
 */
async function addStudent(formData) {
    const response = await fetch(`${CONFIG.API_URL}/api/estudiantes/nuevo`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al guardar estudiante');
    }

    return await response.json();
}

/**
 * Obtiene la lista de dispositivos registrados
 * @returns {Promise<Object>} Lista de dispositivos
 */
async function getDevices() {
    const response = await fetch(`${CONFIG.API_URL}/api/devices`);

    if (!response.ok) {
        throw new Error('Error al cargar dispositivos');
    }

    return await response.json();
}

/**
 * Recarga los encodings faciales desde el servidor
 * @returns {Promise<Object>} Resultado de la operacion
 */
async function reloadEncodings() {
    const response = await fetch(`${CONFIG.API_URL}/api/reload-encodings`, {
        method: 'POST'
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al recargar encodings');
    }

    return await response.json();
}
