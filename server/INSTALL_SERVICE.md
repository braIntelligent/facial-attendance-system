# 🚀 Instalación del Servicio Systemd - Servidor

Esta guía te ayudará a configurar el servidor para que inicie automáticamente al arrancar el sistema.

---

## 📋 Requisitos Previos

- Servidor configurado con Python y venv
- MySQL/Docker corriendo
- Nginx configurado
- Usuario: `adminiot`

---

## 🔧 Instalación

### 1. Copiar archivo de servicio

```bash
# En el servidor Azure
cd ~/facial-attendance-system/server

# Copiar servicio a systemd
sudo cp attendance-server.service /etc/systemd/system/

# Verificar que se copió correctamente
ls -l /etc/systemd/system/attendance-server.service
```

---

### 2. Habilitar el servicio

```bash
# Recargar configuración de systemd
sudo systemctl daemon-reload

# Habilitar inicio automático
sudo systemctl enable attendance-server.service

# Iniciar el servicio
sudo systemctl start attendance-server.service
```

---

### 3. Verificar estado

```bash
# Ver estado del servicio
sudo systemctl status attendance-server.service

# Ver logs en tiempo real
sudo journalctl -u attendance-server -f

# Ver últimas 50 líneas de logs
sudo journalctl -u attendance-server -n 50
```

**Salida esperada:**
```
● attendance-server.service - Sistema de Asistencia IoT - FastAPI Server
     Loaded: loaded (/etc/systemd/system/attendance-server.service; enabled)
     Active: active (running) since ...
```

---

## 🎛️ Comandos Útiles

### Controlar el servicio

```bash
# Iniciar
sudo systemctl start attendance-server

# Detener
sudo systemctl stop attendance-server

# Reiniciar
sudo systemctl restart attendance-server

# Recargar configuración (sin reiniciar)
sudo systemctl reload attendance-server

# Ver estado
sudo systemctl status attendance-server
```

### Ver logs

```bash
# Logs en tiempo real
sudo journalctl -u attendance-server -f

# Logs desde hoy
sudo journalctl -u attendance-server --since today

# Logs de la última hora
sudo journalctl -u attendance-server --since "1 hour ago"

# Logs con filtro
sudo journalctl -u attendance-server | grep ERROR
```

---

## 🔄 Actualizar el Código

Cuando hagas `git pull` con cambios:

```bash
cd ~/facial-attendance-system/server
git pull
sudo systemctl restart attendance-server
sudo journalctl -u attendance-server -f  # Verificar que inició bien
```

---

## 🧪 Probar Auto-inicio

Para verificar que inicia automáticamente al boot:

```bash
# Reiniciar el servidor
sudo reboot

# Después del reinicio, verificar:
sudo systemctl status attendance-server

# Debería mostrar "active (running)"
```

---

## ❌ Deshabilitar (si es necesario)

```bash
# Detener servicio
sudo systemctl stop attendance-server

# Deshabilitar auto-inicio
sudo systemctl disable attendance-server

# Eliminar archivo de servicio
sudo rm /etc/systemd/system/attendance-server.service

# Recargar
sudo systemctl daemon-reload
```

---

## 🐛 Troubleshooting

### El servicio no inicia

```bash
# Ver logs detallados
sudo journalctl -u attendance-server -n 100 --no-pager

# Verificar permisos
ls -l /home/adminiot/facial-attendance-system/server

# Verificar que venv existe
ls -l /home/adminiot/facial-attendance-system/server/venv/bin/uvicorn

# Probar inicio manual
cd /home/adminiot/facial-attendance-system/server
source venv/bin/activate
python -m app.main
```

### "Address already in use" (puerto 8000 ocupado)

```bash
# Ver qué proceso usa el puerto 8000
sudo lsof -i :8000

# Si hay un proceso zombie, matarlo
sudo kill -9 <PID>

# Reiniciar servicio
sudo systemctl restart attendance-server
```

### MySQL no está listo cuando inicia

Editar el servicio para agregar más delay:

```bash
sudo nano /etc/systemd/system/attendance-server.service

# Agregar después de [Service]:
ExecStartPre=/bin/sleep 10

# Recargar y reiniciar
sudo systemctl daemon-reload
sudo systemctl restart attendance-server
```

---

## 📊 Monitoreo

### Verificar que todo funciona

```bash
# 1. Servicio corriendo
sudo systemctl is-active attendance-server
# Debería mostrar: active

# 2. API responde
curl http://localhost:8000/api/health
# Debería mostrar: {"status":"ok"}

# 3. Ver conexiones activas
sudo journalctl -u attendance-server | grep "WebSocket conectado"

# 4. Ver últimos errores
sudo journalctl -u attendance-server -p err
```

---

**✅ Instalación completada!**

El servidor ahora iniciará automáticamente al arrancar el sistema.
