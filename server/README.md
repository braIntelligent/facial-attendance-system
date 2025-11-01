# 🖥️ Servidor Backend - Sistema de Asistencia

Backend FastAPI con reconocimiento facial, WebSockets y base de datos MySQL.

---

## 📋 Requisitos Previos

- Python 3.9+
- Docker & Docker Compose
- 4GB RAM mínimo
- Ubuntu 20.04+ (o cualquier Linux/macOS)

---

## 🚀 Instalación Rápida

### 1. Crear entorno virtual

```bash
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

### 2. Instalar dependencias

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
nano .env  # Editar con tus credenciales
```

**Importante:** Genera un SECRET_KEY seguro:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### 4. Iniciar MySQL con Docker

```bash
docker-compose up -d
```

Verificar que está corriendo:
```bash
docker ps
# Deberías ver: mysql-db y mysql-visor
```

### 5. Inicializar base de datos

```bash
# Esperar a que MySQL esté listo (unos 10 segundos)
sleep 10

# Crear tablas
python init_db.py
```

Salida esperada:
```
✅ Base de datos inicializada exitosamente
📊 Tablas en la base de datos:
   - estudiantes
   - asistencia
```

### 6. Iniciar el servidor

```bash
python -m app.main
```

Salida esperada:
```
╔═══════════════════════════════════════════════════╗
║      SERVIDOR DE ASISTENCIA IoT - v2.0           ║
║        Reconocimiento Facial Centralizado        ║
╚═══════════════════════════════════════════════════╝

INFO: Started server process
INFO: Uvicorn running on http://0.0.0.0:8000
```

### 7. Verificar que funciona

Abrir en navegador:
```
http://localhost:8000/docs
```

Deberías ver la documentación interactiva de la API (Swagger UI).

---

## 🔧 Comandos Útiles

### Detener/Reiniciar MySQL

```bash
# Detener
docker-compose down

# Reiniciar
docker-compose up -d

# Ver logs
docker-compose logs -f mysql-db
```

### Acceder a phpMyAdmin

```
http://localhost:8080

Usuario: root (o el que configuraste en DB_USER)
Password: el que configuraste en DB_ROOT_PASS
```

### Limpiar base de datos

```bash
# CUIDADO: Esto borra TODOS los datos
docker-compose down -v
docker-compose up -d
sleep 10
python init_db.py
```

### Ver logs del servidor

```bash
# Si usas systemd
sudo journalctl -u attendance-server -f

# Si ejecutas manualmente
# Los logs aparecen en la terminal
```

---

## 📁 Estructura de Archivos

```
server/
├── app/
│   ├── api/            # Endpoints organizados (futuro)
│   ├── core/
│   │   ├── database.py         # Operaciones de BD
│   │   └── face_recognition.py # Reconocimiento facial
│   ├── models/
│   │   ├── student.py          # Modelo de estudiante
│   │   ├── attendance.py       # Modelo de asistencia
│   │   └── frame.py            # Modelo de frames
│   ├── utils/          # Utilidades (futuro)
│   ├── config.py       # Configuración centralizada
│   └── main.py         # FastAPI app principal
├── data/
│   ├── photos/
│   │   ├── student_photos/     # Fotos de estudiantes
│   │   └── encodings.pkl       # Encodings faciales (generado automáticamente)
│   └── logs/           # Logs del servidor
├── docker-compose.yml  # MySQL + phpMyAdmin
├── requirements.txt    # Dependencias Python
├── schema.sql          # Schema de base de datos
├── init_db.py          # Script de inicialización
├── .env.example        # Template de configuración
└── README.md           # Este archivo
```

---

## 🔍 Troubleshooting

### Error: "Cannot connect to MySQL"

**Solución:**
```bash
# Verificar que MySQL está corriendo
docker ps | grep mysql

# Ver logs de MySQL
docker-compose logs mysql-db

# Reiniciar contenedor
docker-compose restart mysql-db
```

### Error: "File encodings.pkl not found"

**Esto es NORMAL en la primera ejecución.** El archivo se crea automáticamente cuando:
1. Agregas el primer estudiante desde el dashboard
2. El servidor genera los encodings faciales

**NO necesitas crear este archivo manualmente.**

### Error: "ModuleNotFoundError"

**Solución:**
```bash
# Verificar que estás en el entorno virtual
which python
# Debería mostrar: /path/to/venv/bin/python

# Reinstalar dependencias
pip install -r requirements.txt
```

### Error: "Permission denied" en Docker

**Solución:**
```bash
# Agregar tu usuario al grupo docker
sudo usermod -aG docker $USER

# Cerrar sesión y volver a iniciar
```

### Warning: "Encodings no cargados"

**Esto es normal** si no has agregado estudiantes aún. Los encodings se generan automáticamente cuando:
1. Subes la primera foto de un estudiante
2. El endpoint `/api/estudiantes/nuevo` se ejecuta
3. Se llama a `face_processor.generar_encodings_desde_fotos()`

---

## 🧪 Testing

### Test de conexión a BD

```bash
python3 << EOF
import os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()
conn = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASS"),
    database=os.getenv("DB_NAME")
)
print("✅ Conexión exitosa a MySQL")
conn.close()
EOF
```

### Test de API

```bash
# Health check
curl http://localhost:8000/api/health

# Listar estudiantes
curl http://localhost:8000/api/estudiantes

# Listar dispositivos
curl http://localhost:8000/api/devices
```

---

## 🚀 Despliegue en Producción

### Usando systemd (Linux)

```bash
sudo nano /etc/systemd/system/attendance-server.service
```

Contenido:
```ini
[Unit]
Description=Sistema de Asistencia - Backend FastAPI
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=adminiot
WorkingDirectory=/home/adminiot/facial-attendance-system/server
Environment=PATH=/home/adminiot/facial-attendance-system/server/venv/bin
ExecStart=/home/adminiot/facial-attendance-system/server/venv/bin/python -m app.main
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Habilitar:
```bash
sudo systemctl daemon-reload
sudo systemctl enable attendance-server
sudo systemctl start attendance-server

# Ver estado
sudo systemctl status attendance-server

# Ver logs
sudo journalctl -u attendance-server -f
```

### Usando Docker (alternativa)

Crear `Dockerfile`:
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "-m", "app.main"]
```

Build y run:
```bash
docker build -t attendance-server .
docker run -d -p 8000:8000 --env-file .env attendance-server
```

---

## 📊 Monitoreo

### Endpoints de monitoreo

- `GET /api/health` - Estado del servidor
- `GET /` - Info del sistema
- `GET /docs` - Documentación Swagger

### Métricas importantes

```bash
# Número de estudiantes
curl http://localhost:8000/api/estudiantes | jq '.total'

# Asistencia hoy
curl http://localhost:8000/api/asistencia/hoy | jq '.total'

# Dispositivos conectados
curl http://localhost:8000/api/devices | jq '.total'
```

---

## 🔒 Seguridad

### Cambiar contraseñas por defecto

Editar `.env`:
```bash
DB_PASS=tu_password_muy_seguro_aqui
DB_ROOT_PASS=otro_password_muy_seguro
SECRET_KEY=genera_uno_con_el_comando_de_arriba
```

### Firewall (producción)

```bash
# Permitir solo puerto 8000
sudo ufw allow 8000/tcp

# Bloquear MySQL desde internet (solo localhost)
sudo ufw deny 3306/tcp
```

### HTTPS (producción)

Usar Nginx como reverse proxy con Let's Encrypt:
```nginx
server {
    listen 443 ssl;
    server_name iotinacap.eastus.cloudapp.azure.com;

    ssl_certificate /etc/letsencrypt/live/iotinacap.eastus.cloudapp.azure.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/iotinacap.eastus.cloudapp.azure.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📞 Soporte

- **GitHub Issues:** https://github.com/braIntelligent/facial-attendance-system/issues
- **Documentación:** Ver `/docs` en el repositorio

---

**Última actualización:** 2024-10-31
