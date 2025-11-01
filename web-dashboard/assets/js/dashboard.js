// dashboard.js - Logica del dashboard de asistencia

// Estado de la aplicacion
let state = {
    estudiantes: [],
    asistencias: [],
    filtroActivo: 'todos',
    busqueda: ''
};

// Contador de asistencias previas (para detectar nuevos registros)
let ultimaCantidadAsistencias = 0;

// ==============================================
// INICIALIZACION
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dashboard iniciado');

    // Verificar si hay mensaje de exito
    verificarMensajeExito();

    // Configurar reloj
    actualizarReloj();
    setInterval(actualizarReloj, 1000);

    // Configurar event listeners
    configurarEventListeners();

    // Cargar datos iniciales
    cargarDatos();

    // Configurar actualizacion automatica
    setInterval(cargarDatos, CONFIG.REFRESH_INTERVAL);
});

// ==============================================
// FUNCIONES DE DATOS
// ==============================================

async function cargarDatos() {
    try {
        // Cargar estudiantes y asistencias en paralelo
        const [estudiantesData, asistenciasData] = await Promise.all([
            getStudents(),
            getAttendanceToday()
        ]);

        state.estudiantes = estudiantesData.estudiantes || [];
        state.asistencias = asistenciasData.asistencias || [];

        // Actualizar UI
        actualizarEstadisticas();
        renderizarListaAsistencia();
        renderizarUltimosRegistros();
        actualizarEstadoConexion(true);
        verificarNuevosRegistros();

        // Actualizar timestamp
        const timestampEl = document.getElementById('ultima-actualizacion');
        if (timestampEl) {
            timestampEl.textContent = new Date().toLocaleTimeString('es-CL');
        }

    } catch (error) {
        console.error('Error cargando datos:', error);
        actualizarEstadoConexion(false);
        mostrarToast('Error al conectar con el servidor', 'error');
    }
}

// ==============================================
// RENDERIZADO
// ==============================================

function renderizarListaAsistencia() {
    const tbody = document.getElementById('lista-estudiantes');

    if (!tbody) return;

    if (state.estudiantes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="mensaje-vacio">No hay estudiantes registrados</td></tr>';
        return;
    }

    // Crear mapa de asistencias para busqueda rapida
    const asistenciasMap = {};
    state.asistencias.forEach(asistencia => {
        asistenciasMap[asistencia.id_estudiante] = asistencia;
    });

    // Filtrar estudiantes segun busqueda
    let estudiantesFiltrados = state.estudiantes;

    if (state.busqueda) {
        const busqueda = state.busqueda.toLowerCase();
        estudiantesFiltrados = estudiantesFiltrados.filter(est =>
            est.nombre_completo.toLowerCase().includes(busqueda) ||
            (est.rut && est.rut.includes(busqueda))
        );
    }

    // Filtrar segun estado
    if (state.filtroActivo === 'presentes') {
        estudiantesFiltrados = estudiantesFiltrados.filter(est =>
            asistenciasMap[est.id_estudiante]
        );
    } else if (state.filtroActivo === 'ausentes') {
        estudiantesFiltrados = estudiantesFiltrados.filter(est =>
            !asistenciasMap[est.id_estudiante]
        );
    }

    // Renderizar filas
    if (estudiantesFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="mensaje-vacio">No se encontraron resultados</td></tr>';
        return;
    }

    tbody.innerHTML = estudiantesFiltrados.map(estudiante => {
        const asistencia = asistenciasMap[estudiante.id_estudiante];
        const presente = !!asistencia;

        return `
            <tr>
                <td>
                    <span class="estado-badge ${presente ? 'presente' : 'ausente'}">
                        ${presente ? '✅ Presente' : '❌ Ausente'}
                    </span>
                </td>
                <td>${estudiante.nombre_completo}</td>
                <td>${estudiante.rut || 'N/A'}</td>
                <td>
                    ${presente
                        ? `<span class="hora-ingreso">${asistencia.hora_ingreso}</span>`
                        : '<span class="hora-ingreso">--</span>'
                    }
                </td>
            </tr>
        `;
    }).join('');
}

function renderizarUltimosRegistros() {
    const container = document.getElementById('ultimos-registros');

    if (!container) return;

    if (state.asistencias.length === 0) {
        container.innerHTML = '<p class="mensaje-vacio">No hay registros hoy</p>';
        return;
    }

    // Tomar los ultimos N registros
    const ultimosRegistros = state.asistencias.slice(0, CONFIG.MAX_REGISTROS_RECIENTES);

    container.innerHTML = ultimosRegistros.map(asistencia => `
        <div class="registro-item">
            <div>
                <div class="nombre">${asistencia.nombre_completo}</div>
                <div class="hora">${asistencia.dispositivo_id || 'Desconocido'}</div>
            </div>
            <div class="hora">${asistencia.hora_ingreso}</div>
        </div>
    `).join('');
}

function actualizarEstadisticas() {
    const totalEstudiantes = state.estudiantes.length;
    const totalPresentes = state.asistencias.length;
    const totalAusentes = totalEstudiantes - totalPresentes;

    const presentesEl = document.getElementById('total-presentes');
    const ausentesEl = document.getElementById('total-ausentes');

    if (presentesEl) presentesEl.textContent = totalPresentes;
    if (ausentesEl) ausentesEl.textContent = totalAusentes;
}

// ==============================================
// EVENT LISTENERS
// ==============================================

function configurarEventListeners() {
    // Buscador
    const inputBuscar = document.getElementById('buscar-estudiante');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', (e) => {
            state.busqueda = e.target.value;
            renderizarListaAsistencia();
        });
    }

    // Filtros de estado
    const filtros = document.querySelectorAll('input[name="filtro"]');
    filtros.forEach(filtro => {
        filtro.addEventListener('change', (e) => {
            state.filtroActivo = e.target.value;
            renderizarListaAsistencia();
        });
    });
}

// ==============================================
// DETECCION DE NUEVOS REGISTROS
// ==============================================

function verificarNuevosRegistros() {
    const cantidadActual = state.asistencias.length;

    if (cantidadActual > ultimaCantidadAsistencias && ultimaCantidadAsistencias > 0) {
        // Hay nuevos registros
        const nuevoRegistro = state.asistencias[0];
        mostrarToast(`${nuevoRegistro.nombre_completo} registrado`, 'success');
        reproducirSonidoRegistro();
    }

    ultimaCantidadAsistencias = cantidadActual;
}

// ==============================================
// MENSAJE DE EXITO AL AGREGAR ESTUDIANTE
// ==============================================

function verificarMensajeExito() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('success') === 'true') {
        mostrarToast('Estudiante agregado exitosamente', 'success');

        // Limpiar el parametro de la URL sin recargar la pagina
        const url = new URL(window.location);
        url.searchParams.delete('success');
        window.history.replaceState({}, '', url);
    }
}

console.log('✅ Dashboard cargado');
