# 🎓 Sistema de Asistencia con Reconocimiento Facial

> Sistema IoT profesional para control de asistencia académica mediante reconocimiento facial, desarrollado con FastAPI, Raspberry Pi y tecnologías modernas.

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.120.0-green.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Configuración](#-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Marco Legal](#-marco-legal)
- [Defensa del Proyecto](#-defensa-del-proyecto)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## ✨ Características

### 🚀 Funcionalidades Principales

- ✅ **Reconocimiento facial en tiempo real** con librería face_recognition
- ✅ **Dashboard web interactivo** con estadísticas en tiempo real
- ✅ **Sistema multi-dispositivo** (múltiples Raspberry Pi)
- ✅ **Registro automático de asistencia** con cooldown anti-duplicados
- ✅ **Gestión de estudiantes** con captura de foto desde webcam
- ✅ **WebSockets bidireccionales** para control de LEDs remotos
- ✅ **Base de datos MySQL** con Docker Compose
- ✅ **API RESTful documentada** con OpenAPI/Swagger

### 🔒 Seguridad y Privacidad

- 🔐 No se almacenan fotos originales (solo encodings matemáticos)
- 🔐 Conexiones HTTPS/WSS cifradas
- 🔐 Cumplimiento con Ley 19.628 (Protección de Datos Personales - Chile)
- 🔐 Sistema opt-in con consentimiento informado
- 🔐 Derecho a eliminación de datos (GDPR-compliant)

### 📊 Métricas y Reportes

- 📈 Estadísticas de asistencia en tiempo real
- 📈 Historial de registros por estudiante
- 📈 Filtros por fecha, estado (presente/ausente)
- 📈 Exportación de datos (futuro)

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────┐
│           AZURE CLOUD (HTTPS)               │
│  ┌─────────────────────────────────────┐    │
│  │   FastAPI Server                    │    │
│  │   - API REST                        │    │
│  │   - WebSocket Server                │    │
│  │   - Face Recognition (async)        │    │
│  └──────────┬──────────────────┬───────┘    │
│             │                  │            │
│  ┌──────────▼────────┐  ┌──────▼──────┐   │
│  │   MySQL (Docker)  │  │  Encodings  │   │
│  └───────────────────┘  └─────────────┘   │
└────────────┬────────────────────────────────┘
             │ HTTPS/WSS
             │
    ┌────────▼─────────────────────┐
    │   RASPBERRY PI (Edge Device) │
    │  ┌────────────────────────┐  │
    │  │  Camera Client         │  │
    │  │  - Video streaming     │  │
    │  │  - Frame capture       │  │
    │  │  - LED control (GPIO)  │  │
    │  └────────────────────────┘  │
    └──────────────────────────────┘
             │ HTTPS
             │
    ┌────────▼─────────────────────┐
    │   WEB DASHBOARD              │
    │  - Tiempo real               │
    │  - Gestión de estudiantes    │
    └──────────────────────────────┘
```

**Flujo de datos:**

1. **Raspberry Pi** captura frames de video (30 FPS streaming local)
2. Envía frames al **servidor** cada 2 segundos para procesamiento
3. **Servidor** realiza reconocimiento facial (asyncio + ThreadPoolExecutor)
4. Si reconoce un estudiante, registra en **MySQL**
5. **WebSocket** envía comando LED a Raspberry Pi (verde/rojo)
6. **Dashboard web** actualiza estadísticas en tiempo real (polling cada 10s)

---

## 📦 Requisitos

### Hardware

- **Servidor:**
  - Azure VM (Standard B2s) o equivalente
  - 2 vCPUs, 4GB RAM mínimo
  - 20GB almacenamiento

- **Raspberry Pi:**
  - Raspberry Pi 4 (4GB RAM recomendado)
  - Cámara oficial Raspberry Pi o compatible
  - LEDs (verde/rojo) + resistencias
  - Fuente 5V/3A

- **Cliente:**
  - Navegador moderno (Chrome, Firefox, Safari)
  - Webcam (para agregar estudiantes)

### Software

- **Servidor:**
  - Python 3.9+
  - Docker & Docker Compose
  - MySQL 8.0
  - Ubuntu 20.04+ (recomendado)

- **Raspberry Pi:**
  - Raspberry Pi OS (Bullseye)
  - Python 3.9+
  - PiCamera2

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/braIntelligent/facial-attendance-system.git
cd facial-attendance-system
```

### 2. Configurar el Servidor

```bash
cd server

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
nano .env  # Editar con tus credenciales

# Iniciar base de datos MySQL
docker-compose up -d

# Esperar 10 segundos a que MySQL esté listo
sleep 10

# Ejecutar migraciones (crear tablas)
python init_db.py

# Iniciar servidor
python -m app.main
```

El servidor estará disponible en `http://localhost:8000`

### 3. Configurar Raspberry Pi

```bash
cd raspberry-pi

# Instalar dependencias del sistema
sudo apt-get update
sudo apt-get install -y python3-pip python3-picamera2 \
  libatlas-base-dev libopenjp2-7 libtiff5

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias Python
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
nano .env  # Configurar SERVER_URL y DEVICE_ID

# Iniciar cliente
python camera_client.py
```

### 4. Configurar Dashboard Web

```bash
cd web-dashboard

# Opción 1: Servidor HTTP simple
python3 -m http.server 8080

# Opción 2: Live Server (VSCode)
# Instalar extensión "Live Server" y hacer clic derecho > "Open with Live Server"
```

Abrir `http://localhost:8080` en el navegador.

---

## 🔧 Configuración

### Variables de Entorno - Servidor (`server/.env`)

```env
# Base de Datos
DB_HOST=localhost
DB_USER=asistencia_user
DB_PASS=tu_password_seguro
DB_NAME=asistencia_db
DB_PORT=3306
DB_ROOT_PASS=root_password

# Seguridad
SECRET_KEY=genera_una_clave_segura_aqui
ALLOWED_ORIGINS=https://tudominio.com,http://localhost:8080

# Face Recognition
FACE_TOLERANCE=0.6
FACE_DETECTION_MODEL=hog
COOLDOWN_SECONDS=300
```

### Variables de Entorno - Raspberry Pi (`raspberry-pi/.env`)

```env
# Servidor
SERVER_HOST=iotinacap.eastus.cloudapp.azure.com
DEVICE_ID=pi-aula-101

# Cámara
FRAME_WIDTH=640
FRAME_HEIGHT=480
JPEG_QUALITY=70
CAPTURE_INTERVAL=2.0

# GPIO
LED_GREEN_PIN=17
LED_RED_PIN=27
```

### Configuración de Frontend (`web-dashboard/assets/js/config.js`)

```javascript
const CONFIG = {
    API_URL: 'https://iotinacap.eastus.cloudapp.azure.com',
    WS_URL: 'wss://iotinacap.eastus.cloudapp.azure.com/ws',
    REFRESH_INTERVAL: 10000,  // 10 segundos
};
```

---

## 📁 Estructura del Proyecto

```
facial-attendance-system/
├── server/                      # Backend FastAPI
│   ├── app/
│   │   ├── api/                # Endpoints REST
│   │   │   ├── attendance.py
│   │   │   ├── students.py
│   │   │   ├── frames.py
│   │   │   └── websocket.py
│   │   ├── core/               # Lógica de negocio
│   │   │   ├── database.py
│   │   │   ├── face_recognition.py
│   │   │   └── validators.py
│   │   ├── models/             # Modelos Pydantic
│   │   ├── utils/              # Utilidades
│   │   ├── config.py
│   │   └── main.py             # Punto de entrada
│   ├── data/
│   │   ├── photos/             # Encodings y fotos
│   │   └── logs/               # Logs del servidor
│   ├── tests/                  # Tests unitarios
│   ├── docker-compose.yml
│   ├── requirements.txt
│   └── .env.example
│
├── raspberry-pi/               # Cliente IoT
│   ├── camera_client.py        # Script principal
│   ├── config.py
│   ├── requirements.txt
│   └── .env.example
│
├── web-dashboard/              # Frontend
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css
│   │   │   ├── dashboard.css
│   │   │   └── students.css
│   │   └── js/
│   │       ├── config.js
│   │       ├── api.js
│   │       ├── dashboard.js
│   │       └── student-form.js
│   └── views/
│       ├── index.html          # Dashboard principal
│       └── add-student.html    # Agregar estudiante
│
├── docs/                       # Documentación
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── DEFENSE.md              # Defensa del proyecto
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 📖 Uso

### 1. Agregar un nuevo estudiante

1. Acceder al dashboard web
2. Clic en "➕ Agregar Estudiante"
3. Completar formulario:
   - Nombre completo
   - RUT (opcional)
   - Capturar foto con webcam
4. Guardar → El sistema automáticamente:
   - Guarda la foto
   - Genera el encoding facial
   - Actualiza la base de datos
   - Recarga los encodings del servidor

### 2. Registrar asistencia

1. Raspberry Pi inicia automáticamente al encender
2. Los estudiantes se posicionan frente a la cámara (15 segundos)
3. El sistema reconoce el rostro y registra asistencia
4. LED verde: Reconocido y registrado
5. LED rojo: No reconocido
6. Cooldown de 5 minutos para evitar duplicados

### 3. Consultar reportes

1. Dashboard muestra estadísticas en tiempo real:
   - Total presentes/ausentes
   - Últimos 10 registros
   - Lista completa de estudiantes
2. Filtros disponibles:
   - Buscar por nombre/RUT
   - Filtrar: Todos/Presentes/Ausentes

---

## ⚖️ Marco Legal

Este proyecto cumple con:

- ✅ **Ley 19.628** (Protección de Datos Personales - Chile)
- ✅ **Ley 21.096** (Derechos Digitales - Chile)
- ✅ **RGPD** (como referencia de buenas prácticas)

### Principios aplicados:

1. **Consentimiento informado**: Los estudiantes autorizan explícitamente
2. **Finalidad específica**: Solo para control de asistencia académica
3. **Minimización de datos**: Solo se guardan datos esenciales
4. **Seguridad**: Encodings cifrados, no fotos originales
5. **Derecho de acceso**: Los estudiantes pueden consultar/eliminar sus datos
6. **Transparencia**: Código abierto y auditables

Ver documento completo: [docs/DEFENSE.md](docs/DEFENSE.md)

---

## 🛡️ Defensa del Proyecto

Para consultar la argumentación completa sobre:

- ✅ Por qué NO es invasivo
- ✅ Diferencia entre vigilancia y control de asistencia
- ✅ Comparación con alternativas (huella, RFID, lista manual)
- ✅ Casos de uso en instituciones reales
- ✅ Plan de gestión de datos (Data Governance)
- ✅ Respuestas a objeciones comunes
- ✅ Presupuesto y ROI

**Ver documento completo:** [docs/DEFENSE.md](docs/DEFENSE.md)

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Matías Cataldo**

- GitHub: [@braIntelligent](https://github.com/braIntelligent)
- Proyecto académico - Inacap IoT Module

---

## 🙏 Agradecimientos

- [face_recognition](https://github.com/ageitgey/face_recognition) por la librería de reconocimiento facial
- [FastAPI](https://fastapi.tiangolo.com/) por el framework web
- [Raspberry Pi Foundation](https://www.raspberrypi.org/) por el hardware

---

## 📞 Soporte

Para reportar bugs o solicitar features:

- Abrir un [Issue](https://github.com/braIntelligent/facial-attendance-system/issues)
- Contactar: [tu-email@ejemplo.com]

---

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub**
