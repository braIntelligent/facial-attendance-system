// monitor.js - Logica del monitoreo de camaras

// Estado de la aplicacion
let state = {
    devices: [],
    selectedDevice: null,
    streamActive: false
};

// Elementos del DOM
let deviceSelector;
let btnRefreshDevices;
let btnToggleStream;
let btnFullscreen;
let btnRetryStream;
let videoStream;
let videoPlaceholder;
let videoLoading;
let videoError;
let deviceInfoSection;
let statsSection;

// ==============================================
// INICIALIZACION
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Monitor de camaras iniciado');

    // Obtener referencias del DOM
    deviceSelector = document.getElementById('device-selector');
    btnRefreshDevices = document.getElementById('btn-refresh-devices');
    btnToggleStream = document.getElementById('btn-toggle-stream');
    btnFullscreen = document.getElementById('btn-fullscreen');
    btnRetryStream = document.getElementById('btn-retry-stream');
    videoStream = document.getElementById('video-stream');
    videoPlaceholder = document.getElementById('video-placeholder');
    videoLoading = document.getElementById('video-loading');
    videoError = document.getElementById('video-error');
    deviceInfoSection = document.getElementById('device-info-section');
    statsSection = document.getElementById('stats-section');

    // Configurar event listeners
    configurarEventListeners();

    // Cargar dispositivos iniciales
    cargarDispositivos();
});

// ==============================================
// EVENT LISTENERS
// ==============================================

function configurarEventListeners() {
    if (deviceSelector) {
        deviceSelector.addEventListener('change', (e) => {
            const deviceId = e.target.value;
            if (deviceId) {
                seleccionarDispositivo(deviceId);
            }
        });
    }

    if (btnRefreshDevices) {
        btnRefreshDevices.addEventListener('click', cargarDispositivos);
    }

    if (btnToggleStream) {
        btnToggleStream.addEventListener('click', toggleStream);
    }

    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', toggleFullscreen);
    }

    if (btnRetryStream) {
        btnRetryStream.addEventListener('click', () => {
            if (state.selectedDevice) {
                iniciarStream();
            }
        });
    }

    // Detectar cambios de fullscreen
    document.addEventListener('fullscreenchange', actualizarBotonFullscreen);
    document.addEventListener('webkitfullscreenchange', actualizarBotonFullscreen);
    document.addEventListener('mozfullscreenchange', actualizarBotonFullscreen);
}

// ==============================================
// FUNCIONES DE DISPOSITIVOS
// ==============================================

/**
 * Carga la lista de dispositivos desde el servidor
 */
async function cargarDispositivos() {
    try {
        btnRefreshDevices.disabled = true;
        btnRefreshDevices.textContent = 'Cargando...';

        const data = await getDevices();
        state.devices = data.devices || [];

        renderizarListaDispositivos();
        mostrarToast('Dispositivos actualizados', 'success');

    } catch (error) {
        console.error('Error cargando dispositivos:', error);
        mostrarToast('Error al cargar dispositivos', 'error');
        deviceSelector.innerHTML = '<option value="">Error al cargar dispositivos</option>';
    } finally {
        btnRefreshDevices.disabled = false;
        btnRefreshDevices.textContent = 'Actualizar Lista';
    }
}

/**
 * Renderiza la lista de dispositivos en el selector
 */
function renderizarListaDispositivos() {
    if (!deviceSelector) return;

    if (state.devices.length === 0) {
        deviceSelector.innerHTML = '<option value="">No hay dispositivos disponibles</option>';
        deviceSelector.disabled = true;
        return;
    }

    deviceSelector.disabled = false;
    deviceSelector.innerHTML = '<option value="">Seleccione un dispositivo...</option>' +
        state.devices.map(device => {
            const status = device.online ? 'Online' : 'Offline';
            return `<option value="${device.id}">${device.id} - ${device.ip} (${status})</option>`;
        }).join('');
}

/**
 * Selecciona un dispositivo y muestra su informacion
 */
function seleccionarDispositivo(deviceId) {
    const device = state.devices.find(d => d.id === deviceId);

    if (!device) {
        console.error('Dispositivo no encontrado:', deviceId);
        return;
    }

    state.selectedDevice = device;

    // Mostrar informacion del dispositivo
    mostrarInfoDispositivo(device);

    // Habilitar controles
    if (btnToggleStream) {
        btnToggleStream.disabled = false;
        btnToggleStream.textContent = 'Iniciar Stream';
    }

    // Detener stream anterior si existe
    if (state.streamActive) {
        detenerStream();
    }
}

/**
 * Muestra la informacion del dispositivo seleccionado
 */
function mostrarInfoDispositivo(device) {
    // Mostrar seccion de informacion
    if (deviceInfoSection) {
        deviceInfoSection.style.display = 'block';
    }

    // Actualizar campos
    const deviceIdEl = document.getElementById('device-id');
    const deviceIpEl = document.getElementById('device-ip');
    const deviceStatusEl = document.getElementById('device-status');
    const deviceLastSeenEl = document.getElementById('device-last-seen');

    if (deviceIdEl) deviceIdEl.textContent = device.id;
    if (deviceIpEl) deviceIpEl.textContent = device.ip;

    if (deviceStatusEl) {
        deviceStatusEl.textContent = device.online ? 'Online' : 'Offline';
        deviceStatusEl.className = device.online ? 'info-value status-online' : 'info-value status-offline';
    }

    if (deviceLastSeenEl) {
        const lastSeen = device.last_seen ? new Date(device.last_seen).toLocaleString('es-CL') : 'Nunca';
        deviceLastSeenEl.textContent = lastSeen;
    }

    // Mostrar estadisticas (simuladas por ahora)
    if (statsSection) {
        statsSection.style.display = 'block';
    }

    const statRegistrosEl = document.getElementById('stat-registros');
    const statUltimoEl = document.getElementById('stat-ultimo');
    const statFpsEl = document.getElementById('stat-fps');

    if (statRegistrosEl) statRegistrosEl.textContent = device.registros_hoy || '0';
    if (statUltimoEl) statUltimoEl.textContent = device.ultimo_registro || '--';
    if (statFpsEl) statFpsEl.textContent = device.fps || '--';
}

// ==============================================
// FUNCIONES DE STREAM
// ==============================================

/**
 * Alterna entre iniciar y detener el stream
 */
function toggleStream() {
    if (state.streamActive) {
        detenerStream();
    } else {
        iniciarStream();
    }
}

/**
 * Inicia el stream de video
 */
function iniciarStream() {
    if (!state.selectedDevice) {
        mostrarToast('Seleccione un dispositivo primero', 'error');
        return;
    }

    // Ocultar elementos
    if (videoPlaceholder) videoPlaceholder.style.display = 'none';
    if (videoError) videoError.style.display = 'none';
    if (videoStream) videoStream.style.display = 'none';

    // Mostrar loading
    if (videoLoading) videoLoading.style.display = 'flex';

    // Construir URL del stream
    const streamUrl = `http://${state.selectedDevice.ip}:8080/video_feed`;

    // Configurar stream
    if (videoStream) {
        videoStream.onload = () => {
            if (videoLoading) videoLoading.style.display = 'none';
            videoStream.style.display = 'block';
            state.streamActive = true;

            if (btnToggleStream) {
                btnToggleStream.textContent = 'Detener Stream';
                btnToggleStream.classList.remove('btn-primario');
                btnToggleStream.classList.add('btn-error');
            }

            if (btnFullscreen) {
                btnFullscreen.disabled = false;
            }

            mostrarToast('Stream iniciado', 'success');
        };

        videoStream.onerror = () => {
            if (videoLoading) videoLoading.style.display = 'none';
            if (videoError) videoError.style.display = 'flex';
            state.streamActive = false;

            if (btnToggleStream) {
                btnToggleStream.textContent = 'Iniciar Stream';
                btnToggleStream.classList.add('btn-primario');
                btnToggleStream.classList.remove('btn-error');
            }

            mostrarToast('Error al cargar stream', 'error');
        };

        // Agregar timestamp para evitar cache
        videoStream.src = `${streamUrl}?t=${Date.now()}`;
    }
}

/**
 * Detiene el stream de video
 */
function detenerStream() {
    if (videoStream) {
        videoStream.src = '';
        videoStream.style.display = 'none';
    }

    if (videoLoading) videoLoading.style.display = 'none';
    if (videoError) videoError.style.display = 'none';
    if (videoPlaceholder) videoPlaceholder.style.display = 'flex';

    state.streamActive = false;

    if (btnToggleStream) {
        btnToggleStream.textContent = 'Iniciar Stream';
        btnToggleStream.classList.add('btn-primario');
        btnToggleStream.classList.remove('btn-error');
    }

    if (btnFullscreen) {
        btnFullscreen.disabled = true;
    }

    mostrarToast('Stream detenido', 'success');
}

// ==============================================
// FUNCIONES DE FULLSCREEN
// ==============================================

/**
 * Alterna el modo pantalla completa
 */
function toggleFullscreen() {
    const container = document.getElementById('video-container');

    if (!container) return;

    if (!document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement) {
        // Entrar a fullscreen
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        }
    } else {
        // Salir de fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
    }
}

/**
 * Actualiza el texto del boton de fullscreen
 */
function actualizarBotonFullscreen() {
    if (!btnFullscreen) return;

    const isFullscreen = document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement;

    btnFullscreen.textContent = isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa';
}

console.log('✅ Monitor de camaras cargado');
