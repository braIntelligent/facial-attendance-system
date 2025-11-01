# 🔒 Acceder al Stream de la Raspberry Pi vía Túnel SSH

Como la Raspberry Pi está en una red privada (Inacap, tu casa, etc.) y no es accesible directamente desde internet, puedes usar un **túnel SSH** para ver el stream en tu computadora local.

---

## 📺 Ver el Stream desde tu Mac/PC

### Opción 1: Túnel SSH Simple

```bash
# Desde tu Mac/PC
ssh -L 8080:localhost:8080 matias@<IP-RASPBERRY>

# Deja esta terminal abierta
# Ahora abre en tu navegador:
http://localhost:8080
```

**Explicación:**
- `-L 8080:localhost:8080` = Reenvía el puerto 8080 de la Pi al puerto 8080 de tu Mac
- `matias@<IP-RASPBERRY>` = Reemplaza con tu usuario y la IP de tu Raspberry

### Opción 2: Túnel SSH en Background

```bash
# Crea el túnel en background
ssh -f -N -L 8080:localhost:8080 matias@<IP-RASPBERRY>

# Ahora abre:
http://localhost:8080

# Para cerrar el túnel después:
pkill -f "ssh -f -N -L 8080"
```

### Opción 3: Configurar en ~/.ssh/config (Más Cómodo)

```bash
# Editar archivo de configuración SSH
nano ~/.ssh/config
```

Agregar:
```
Host raspberry-stream
    HostName <IP-RASPBERRY>
    User matias
    LocalForward 8080 localhost:8080
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

Ahora solo ejecutas:
```bash
ssh raspberry-stream

# Y abres:
http://localhost:8080
```

---

## 🌐 Acceder desde Múltiples Dispositivos en la Red Local

Si estás en la **misma red WiFi/LAN** que la Raspberry:

### 1. Averiguar IP de la Raspberry

```bash
# En la Raspberry Pi
hostname -I
# Ejemplo: 192.168.1.100
```

### 2. Abrir en cualquier dispositivo de la red

```
http://192.168.1.100:8080
```

Funciona en:
- Tu Mac
- Tu celular
- Cualquier PC en la misma red

---

## 🔐 Túnel Permanente con autossh (Avanzado)

Si quieres que el túnel se mantenga siempre activo:

```bash
# Instalar autossh en tu Mac
brew install autossh

# Crear túnel permanente
autossh -M 0 -f -N -L 8080:localhost:8080 matias@<IP-RASPBERRY>
```

---

## 📱 Ver Stream desde tu Celular (misma red)

1. Conecta tu celular a la misma WiFi que la Raspberry
2. Averigua la IP de la Raspberry: `hostname -I`
3. Abre en el navegador del celular: `http://192.168.1.100:8080`

---

## 🌍 Exponer Temporalmente con ngrok (DEMO)

Para mostrar el proyecto a alguien que NO está en tu red:

### En la Raspberry Pi:

```bash
# Instalar ngrok
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
  sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
  sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# Crear cuenta gratis en https://ngrok.com
# Obtener token de autenticación

# Autenticarse
ngrok config add-authtoken TU_TOKEN_AQUI

# Exponer puerto 8080
ngrok http 8080
```

Te dará una URL pública temporal:
```
Forwarding: https://abc123.ngrok-free.app -> http://localhost:8080
```

Ahora **cualquiera en el mundo** puede ver el stream en:
```
https://abc123.ngrok-free.app
```

> ⚠️ **Nota:** Esta URL es temporal y se pierde al cerrar ngrok.

---

## 🎓 Para tu Presentación en Inacap

### Escenario 1: Presentas con tu laptop

```bash
# Antes de la presentación, crear túnel SSH:
ssh -L 8080:localhost:8080 matias@<IP-RASPBERRY-EN-INACAP>

# Abrir:
http://localhost:8080
```

### Escenario 2: Presentas con proyector conectado a Raspberry

La Raspberry puede mostrar su propio stream:

```bash
# En la Raspberry (conectada al proyector)
chromium-browser --kiosk http://localhost:8080
```

### Escenario 3: Demostración remota

Usar ngrok (ver arriba) y compartir el link temporal.

---

## 📊 Comparación de Métodos

| Método | Facilidad | Permanencia | Seguridad | Requiere Internet |
|--------|-----------|-------------|-----------|-------------------|
| **IP Local** | ⭐⭐⭐ Fácil | ✅ Permanente | ✅ Seguro | ❌ No |
| **Túnel SSH** | ⭐⭐ Media | ⏰ Mientras esté conectado | ✅ Muy seguro | ✅ Sí |
| **autossh** | ⭐ Difícil | ✅ Permanente | ✅ Muy seguro | ✅ Sí |
| **ngrok** | ⭐⭐⭐ Fácil | ❌ Temporal | ⚠️ Público | ✅ Sí |

---

## 🔧 Troubleshooting

### "Connection refused" al hacer túnel SSH

**Solución:**
```bash
# Verificar que la Raspberry está accesible
ping <IP-RASPBERRY>

# Verificar que SSH está habilitado en la Pi
sudo systemctl status ssh

# Habilitar SSH si está deshabilitado
sudo systemctl enable ssh
sudo systemctl start ssh
```

### "Address already in use" (puerto 8080 ocupado)

**Solución:**
```bash
# Ver qué está usando el puerto 8080
lsof -i :8080

# Usar otro puerto local
ssh -L 8081:localhost:8080 matias@<IP-RASPBERRY>
# Ahora abre: http://localhost:8081
```

### El túnel se cae constantemente

**Solución:** Usar `autossh` o configurar `ServerAliveInterval` en `~/.ssh/config`:

```
Host raspberry-stream
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

---

**¿Funcionó? ¿Necesitas ayuda con algún método específico?**
