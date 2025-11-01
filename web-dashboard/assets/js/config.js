// config.js - Configuracion centralizada de la aplicacion

const CONFIG = {
    API_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:8000'
        : 'https://iotinacap.eastus.cloudapp.azure.com',
    REFRESH_INTERVAL: 10000, // 10 segundos
    MAX_REGISTROS_RECIENTES: 10
};
