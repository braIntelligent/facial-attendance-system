# 📷 Raspberry Pi - Cliente de Cámara

Cliente IoT para Raspberry Pi que captura video, envía frames al servidor para reconocimiento facial, y controla LEDs de estado.

---

## 📋 Requisitos

### Hardware
- Raspberry Pi 4 (4GB RAM recomendado)
- Cámara oficial Raspberry Pi o compatible
- 2× LEDs (verde y rojo)
- 2× Resistencias 220Ω
- Cables jumper
- Fuente 5V/3A

### Software
- Raspberry Pi OS (Bullseye o superior)
- Python 3.9+
- PiCamera2

---

## 🔌 Diagrama de Conexión GPIO

```
Raspberry Pi 4 - Pinout

         3.3V ┌─────┬─────┐ 5V
         GPIO2┤  1  │  2  │ 5V
         GPIO3│  3  │  4  │ GND
         GPIO4│  5  │  6  │ GPIO14
          GND │  7  │  8  │ GPIO15
        GPIO17├─────┤  9  │ GND   ← LED Verde (+)
        GPIO18│ 10  │ 11  │ GPIO18
        GPIO27├─────┤ 12  │ GND   ← LED Rojo (+)
         ... más pines ...

Conexiones:
- GPIO 17 → LED Verde (ánodo) → Resistencia 220Ω → GND
- GPIO 27 → LED Rojo (ánodo) → Resistencia 220Ω → GND
```

---

## 🚀 Instalación

### 1. Preparar el sistema

```bash
sudo apt-get update
sudo apt-get upgrade -y

# Instalar dependencias del sistema
sudo apt-get install -y \
    python3-pip \
    python3-picamera2 \
    python3-venv \
    libatlas-base-dev \
    libopenjp2-7 \
    libtiff5

# Habilitar cámara (si no está habilitada)
sudo raspi-config
# Interface Options → Camera → Enable
```

### 2. Clonar el repositorio

```bash
cd ~
git clone https://github.com/braIntelligent/facial-attendance-system.git
cd facial-attendance-system/raspberry-pi
```

### 3. Crear entorno virtual

```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Instalar dependencias Python

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 5. Configurar variables de entorno

```bash
cp .env.example .env
nano .env
```

Editar con tus valores:
```env
SERVER_HOST=iotinacap.eastus.cloudapp.azure.com
DEVICE_ID=pi-aula-101  # Cambiar según aula
LED_GREEN_PIN=17
LED_RED_PIN=27
```

---

## ▶️ Uso

### Ejecutar manualmente

```bash
source venv/bin/activate
python camera_client.py
```

Salida esperada:
```
╔═══════════════════════════════════════════════════╗
║        RASPBERRY PI CAMERA CLIENT v2.0            ║
║    Stream: 30 FPS | Server: cada 2 segundos       ║
╚═══════════════════════════════════════════════════╝

🔌 Inicializando GPIO...
🎥 Inicializando cámara...
✅ Cámara: 640x480 @ 30fps
🌐 Servidor: https://iotinacap.eastus.cloudapp.azure.com
📤 Envío al servidor: cada 2.0s

🚀 SISTEMA ACTIVO
   📺 Stream local: 30 FPS
   📤 Envío servidor: cada 2.0s

🌐 http://172.20.10.4:8080
```

### Ver stream de cámara

Abrir navegador en:
```
http://<IP-DE-TU-RASPBERRY>:8080
```

---

## 🔧 Configurar inicio automático (systemd)

Crear servicio systemd para que se ejecute al arrancar:

```bash
sudo nano /etc/systemd/system/attendance-camera.service
```

Contenido:
```ini
[Unit]
Description=Sistema de Asistencia - Cliente de Cámara
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/facial-attendance-system/raspberry-pi
Environment=PATH=/home/pi/facial-attendance-system/raspberry-pi/venv/bin
ExecStart=/home/pi/facial-attendance-system/raspberry-pi/venv/bin/python camera_client.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Habilitar y iniciar:
```bash
sudo systemctl daemon-reload
sudo systemctl enable attendance-camera.service
sudo systemctl start attendance-camera.service

# Ver estado
sudo systemctl status attendance-camera.service

# Ver logs
sudo journalctl -u attendance-camera.service -f
```

---

## 🧪 Pruebas

### Test de cámara

```bash
python -c "from picamera2 import Picamera2; cam = Picamera2(); cam.start(); print('✅ Cámara OK'); cam.stop()"
```

### Test de GPIO

```bash
python3 << EOF
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.OUT)
GPIO.output(17, GPIO.HIGH)
print("✅ LED Verde debería estar encendido")
input("Presiona Enter para apagar...")
GPIO.output(17, GPIO.LOW)
GPIO.cleanup()
EOF
```

### Test de conexión al servidor

```bash
curl https://iotinacap.eastus.cloudapp.azure.com/api/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "timestamp": "2024-10-31T12:34:56",
  "encodings_loaded": true
}
```

---

## 🔍 Troubleshooting

### La cámara no funciona

```bash
# Verificar que está conectada
vcgencmd get_camera

# Debería mostrar: supported=1 detected=1

# Si no detecta:
sudo raspi-config
# Interface Options → Legacy Camera → Enable
# Reboot
```

### Error "RuntimeError: Camera is not enabled"

```bash
# Habilitar cámara
sudo raspi-config
# Interface Options → Camera → Enable
sudo reboot
```

### LEDs no encienden

- Verificar conexiones físicas
- Verificar resistencias (220Ω)
- Probar con script de test GPIO (ver arriba)
- Verificar permisos GPIO:
  ```bash
  sudo usermod -a -G gpio pi
  sudo reboot
  ```

### No se conecta al servidor

- Verificar conectividad:
  ```bash
  ping iotinacap.eastus.cloudapp.azure.com
  ```
- Verificar variables de entorno en `.env`
- Revisar logs:
  ```bash
  sudo journalctl -u attendance-camera.service -n 50
  ```

### Baja precisión de reconocimiento

- Mejorar iluminación del aula
- Ajustar posición de la cámara (altura y ángulo)
- Verificar calidad de fotos de referencia en el servidor
- Ajustar `FACE_TOLERANCE` en servidor (config.py)

---

## 📊 Monitoreo

### Ver estadísticas en tiempo real

Dashboard web local:
```
http://<IP-RASPBERRY>:8080
```

Muestra:
- Stream de video en vivo
- Frames procesados
- Estado de reconocimiento
- Último estudiante registrado

### Logs

```bash
# Ver logs en tiempo real
sudo journalctl -u attendance-camera.service -f

# Ver últimos 100 logs
sudo journalctl -u attendance-camera.service -n 100

# Logs de hoy
sudo journalctl -u attendance-camera.service --since today
```

---

## 🔒 Seguridad

### Cambiar puerto del stream local

Editar `camera_client.py`:
```python
# Línea ~356
port=8080  # Cambiar a otro puerto
```

### Deshabilitar stream local (solo producción)

Comentar sección Flask en `camera_client.py`:
```python
# flask_thread = threading.Thread(...)
# flask_thread.start()
```

---

## 📝 Notas Importantes

1. **IP dinámica**: Si tu Raspberry tiene IP dinámica en la red local, considera configurar IP estática:
   ```bash
   sudo nano /etc/dhcpcd.conf
   # Agregar al final:
   # interface eth0
   # static ip_address=192.168.1.100/24
   # static routers=192.168.1.1
   # static domain_name_servers=8.8.8.8
   ```

2. **Actualizar software**:
   ```bash
   cd ~/facial-attendance-system
   git pull origin main
   cd raspberry-pi
   source venv/bin/activate
   pip install -r requirements.txt --upgrade
   sudo systemctl restart attendance-camera.service
   ```

3. **Backup de configuración**:
   ```bash
   cp .env .env.backup
   ```

---

## 🆘 Soporte

- **GitHub Issues**: [https://github.com/braIntelligent/facial-attendance-system/issues](https://github.com/braIntelligent/facial-attendance-system/issues)
- **Documentación completa**: Ver `/docs` en el repositorio principal

---

**Última actualización**: 2024-10-31
