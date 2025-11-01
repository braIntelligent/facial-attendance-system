// utils.js - Funciones utilitarias comunes

/**
 * Actualiza el reloj en el header
 */
function actualizarReloj() {
    const ahora = new Date();

    const fecha = ahora.toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const hora = ahora.toLocaleTimeString('es-CL');

    const fechaEl = document.getElementById('fecha-actual');
    const horaEl = document.getElementById('hora-actual');

    if (fechaEl) {
        fechaEl.textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
    }

    if (horaEl) {
        horaEl.textContent = hora;
    }
}

/**
 * Muestra un mensaje toast (notificacion temporal)
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de mensaje ('success' o 'error')
 */
function mostrarToast(mensaje, tipo = 'success') {
    const container = document.getElementById('toast-container');

    if (!container) {
        console.warn('Toast container no encontrado');
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;

    const icon = tipo === 'success' ? '✅' : '❌';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div class="toast-message">${mensaje}</div>
    `;

    container.appendChild(toast);

    // Remover despues de 3 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Actualiza el estado de conexion en el UI
 * @param {boolean} online - True si esta conectado, false si no
 */
function actualizarEstadoConexion(online) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.getElementById('status-text');

    if (!statusIndicator || !statusText) return;

    if (online) {
        statusIndicator.classList.add('online');
        statusIndicator.classList.remove('offline');
        statusText.textContent = 'Conectado al servidor';
    } else {
        statusIndicator.classList.remove('online');
        statusIndicator.classList.add('offline');
        statusText.textContent = 'Sin conexion';
    }
}

/**
 * Reproduce un sonido de notificacion
 */
function reproducirSonidoRegistro() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
        // Ignorar errores de audio
        console.debug('No se pudo reproducir sonido');
    }
}
