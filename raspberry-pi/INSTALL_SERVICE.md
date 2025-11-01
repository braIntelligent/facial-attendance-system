# 🚀 Instalación del Servicio Systemd - Raspberry Pi

Esta guía te ayudará a configurar la Raspberry Pi para que el cliente de cámara inicie automáticamente al arrancar.

---

## 📋 Requisitos Previos

- Raspberry Pi con Raspbian/Raspberry Pi OS
- Código clonado en `/home/pi/facial-attendance-system/raspberry-pi`
- Dependencias instaladas (`pip3 install --break-system-packages -r requirements.txt`)
- Archivo `.env` configurado
- Usuario: `pi` (usuario predeterminado de Raspberry Pi OS)

---

## 🔧 Instalación

### 1. Editar archivo de servicio (si usas otro usuario)

```bash
# Si tu usuario NO es "pi", editar el servicio:
nano ~/facial-attendance-system/raspberry-pi/camera-client.service

# Cambiar las líneas:
User=TU_USUARIO
Group=TU_USUARIO
WorkingDirectory=/home/TU_USUARIO/facial-attendance-system/raspberry-pi
ExecStart=/usr/bin/python3 /home/TU_USUARIO/facial-attendance-system/raspberry-pi/camera_client.py
```

---

### 2. Copiar archivo de servicio

```bash
# En la Raspberry Pi
cd ~/facial-attendance-system/raspberry-pi

# Copiar servicio a systemd
sudo cp camera-client.service /etc/systemd/system/

# Verificar que se copió correctamente
ls -l /etc/systemd/system/camera-client.service
```

---

### 3. Habilitar el servicio

```bash
# Recargar configuración de systemd
sudo systemctl daemon-reload

# Habilitar inicio automático
sudo systemctl enable camera-client.service

# Iniciar el servicio
sudo systemctl start camera-client.service
```

---

### 4. Verificar estado

```bash
# Ver estado del servicio
sudo systemctl status camera-client.service

# Ver logs en tiempo real
sudo journalctl -u camera-client -f

# Ver últimas 50 líneas de logs
sudo journalctl -u camera-client -n 50
```

**Salida esperada:**
```
● camera-client.service - Raspberry Pi Camera Client - Sistema de Asistencia IoT
     Loaded: loaded (/etc/systemd/system/camera-client.service; enabled)
     Active: active (running) since ...

   ... 🎥 Inicializando cámara (Picamera2)...
   ... ✅ Cámara inicializada: 640x480 @ 30fps
   ... 🚀 STREAMING ACTIVO @ 30 FPS
   ... ✅ WebSocket conectado para streaming
   ... 📡 WebSocket streaming iniciado (3.0 FPS)
```

---

## 🎛️ Comandos Útiles

### Controlar el servicio

```bash
# Iniciar
sudo systemctl start camera-client

# Detener
sudo systemctl stop camera-client

# Reiniciar
sudo systemctl restart camera-client

# Ver estado
sudo systemctl status camera-client
```

### Ver logs

```bash
# Logs en tiempo real
sudo journalctl -u camera-client -f

# Logs desde hoy
sudo journalctl -u camera-client --since today

# Logs de la última hora
sudo journalctl -u camera-client --since "1 hour ago"

# Filtrar por nivel
sudo journalctl -u camera-client | grep ERROR
sudo journalctl -u camera-client | grep "WebSocket"
sudo journalctl -u camera-client | grep "RECONOCIDO"
```

---

## 🔄 Actualizar el Código

Cuando hagas `git pull` con cambios:

```bash
cd ~/facial-attendance-system/raspberry-pi
git pull
sudo systemctl restart camera-client
sudo journalctl -u camera-client -f  # Verificar que inició bien
```

---

## 🧪 Probar Auto-inicio

Para verificar que inicia automáticamente al boot:

```bash
# Reiniciar la Raspberry Pi
sudo reboot

# Después del reinicio (esperar ~30 segundos):
sudo systemctl status camera-client

# Debería mostrar "active (running)"

# Ver logs del inicio
sudo journalctl -u camera-client --since "2 minutes ago"
```

---

## ❌ Deshabilitar (si es necesario)

```bash
# Detener servicio
sudo systemctl stop camera-client

# Deshabilitar auto-inicio
sudo systemctl disable camera-client

# Eliminar archivo de servicio
sudo rm /etc/systemd/system/camera-client.service

# Recargar
sudo systemctl daemon-reload
```

---

## 🐛 Troubleshooting

### El servicio no inicia

```bash
# Ver logs detallados
sudo journalctl -u camera-client -n 100 --no-pager

# Verificar que Python3 existe
which python3

# Verificar permisos del código
ls -l ~/facial-attendance-system/raspberry-pi/camera_client.py

# Probar inicio manual
cd ~/facial-attendance-system/raspberry-pi
python3 camera_client.py
```

### "Permission denied" en GPIO

```bash
# Agregar usuario al grupo gpio
sudo usermod -a -G gpio pi

# Agregar usuario al grupo video (cámara)
sudo usermod -a -G video pi

# Cerrar sesión y volver a entrar para aplicar cambios
exit
# (volver a hacer SSH)

# Verificar grupos
groups
# Debería mostrar: ... gpio video ...
```

### "Camera not detected"

```bash
# Verificar que la cámara está habilitada
sudo raspi-config
# Ir a: Interface Options -> Camera -> Enable

# Verificar que la cámara se detecta
libcamera-hello --list-cameras

# Si no se detecta, revisar conexión física del cable
```

### "Cannot connect to server"

```bash
# Verificar conectividad
ping tu-servidor.example.com

# Verificar DNS
nslookup tu-servidor.example.com

# Verificar puerto 8000
curl -I https://tu-servidor.example.com/api/health

# Revisar archivo .env
cat ~/facial-attendance-system/raspberry-pi/.env | grep SERVER_HOST
```

### El servicio se reinicia constantemente

```bash
# Ver cuántas veces ha reiniciado
systemctl status camera-client

# Si muestra muchos "Restart":
# 1. Ver el error específico
sudo journalctl -u camera-client -n 50

# 2. Aumentar el delay de reinicio
sudo nano /etc/systemd/system/camera-client.service
# Cambiar:
RestartSec=30  # Era 10

# Recargar y reiniciar
sudo systemctl daemon-reload
sudo systemctl restart camera-client
```

---

## 📊 Monitoreo

### Verificar que todo funciona

```bash
# 1. Servicio corriendo
sudo systemctl is-active camera-client
# Debería mostrar: active

# 2. WebSocket conectado
sudo journalctl -u camera-client | tail -20 | grep "WebSocket conectado"

# 3. Ver frames enviados
sudo journalctl -u camera-client | grep "Frame enviado" | tail -5

# 4. Ver reconocimientos exitosos
sudo journalctl -u camera-client | grep "RECONOCIDO"

# 5. Ver asistencias registradas
sudo journalctl -u camera-client | grep "REGISTRADO"
```

### Stream web local (opcional)

Si habilitaste `ENABLE_WEB_STREAM=true`, puedes ver el stream localmente:

```bash
# Desde la misma Raspberry Pi
chromium-browser http://localhost:8080

# Desde otra computadora en la misma red
# Averiguar IP de la Pi:
hostname -I
# Ejemplo: 192.168.1.50

# Abrir en navegador:
# http://192.168.1.50:8080
```

---

## 🌐 Acceso Remoto al Stream

Si estás en otra red y quieres ver el stream:

### Opción 1: SSH Tunnel

```bash
# Desde tu Mac/PC:
ssh -L 8080:localhost:8080 pi@<IP-RASPBERRY>

# Mantener esa terminal abierta
# Abrir en navegador:
http://localhost:8080
```

### Opción 2: Dashboard Centralizado

El método recomendado es usar el monitor del dashboard:
```
https://tu-servidor.example.com/views/monitor.html
```

---

## 🔐 Seguridad

### Cambiar usuario predeterminado

Si usas el usuario `pi` predeterminado de Raspberry Pi OS, considera cambiarlo:

```bash
# Crear nuevo usuario
sudo adduser adminpi
sudo usermod -aG sudo,gpio,video,i2c adminpi

# Probar que funciona
su - adminpi
groups  # Verificar que tiene los grupos necesarios

# Si funciona, eliminar usuario 'pi' (opcional)
sudo deluser -remove-home pi
```

### Firewall (opcional)

```bash
# Instalar UFW
sudo apt install ufw

# Permitir SSH
sudo ufw allow 22/tcp

# Permitir stream local (opcional)
sudo ufw allow 8080/tcp

# Habilitar firewall
sudo ufw enable
```

---

**✅ Instalación completada!**

La Raspberry Pi ahora iniciará el cliente de cámara automáticamente al arrancar.
