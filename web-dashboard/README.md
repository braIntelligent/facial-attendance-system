# Web Dashboard - Sistema de Asistencia IoT

## Estructura del Proyecto

```
web-dashboard/
├── views/
│   ├── index.html              # Dashboard principal - Vista de asistencia
│   └── add-student.html        # Vista para agregar estudiantes
├── assets/
│   ├── css/
│   │   ├── main.css           # Estilos globales (header, botones, toasts, etc.)
│   │   ├── dashboard.css      # Estilos del dashboard (tabla, filtros, registros)
│   │   └── students.css       # Estilos del formulario de estudiante
│   └── js/
│       ├── config.js          # Configuracion centralizada (API URL, intervalos)
│       ├── api.js             # Cliente API centralizado (fetch calls)
│       ├── utils.js           # Funciones utilitarias (reloj, toasts, etc.)
│       ├── dashboard.js       # Logica del dashboard de asistencia
│       └── student-form.js    # Logica del formulario de estudiante
└── README.md                  # Este archivo
```

## Arquitectura

### Separacion de Responsabilidades

1. **config.js**: Configuracion centralizada
   - URL de la API (auto-deteccion localhost vs produccion)
   - Intervalo de actualizacion
   - Configuraciones globales

2. **api.js**: Cliente API
   - `getStudents()`: Obtiene lista de estudiantes
   - `getAttendanceToday()`: Obtiene asistencias del dia
   - `addStudent(formData)`: Agrega nuevo estudiante

3. **utils.js**: Funciones comunes
   - `actualizarReloj()`: Actualiza fecha/hora
   - `mostrarToast()`: Muestra notificaciones
   - `actualizarEstadoConexion()`: Actualiza indicador de conexion
   - `reproducirSonidoRegistro()`: Reproduce sonido de notificacion

4. **dashboard.js**: Logica del dashboard
   - Carga y renderizado de asistencias
   - Filtros y busqueda
   - Deteccion de nuevos registros
   - Actualizacion automatica

5. **student-form.js**: Logica del formulario
   - Control de camara web
   - Captura de fotos
   - Envio de formulario
   - Redireccion al dashboard

### Vistas Separadas

#### index.html (Dashboard)
- Vista principal de asistencia
- Muestra ultimos registros
- Tabla de estudiantes con filtros
- Boton para ir a agregar estudiante
- Scripts: config.js, api.js, utils.js, dashboard.js
- Estilos: main.css, dashboard.css

#### add-student.html (Agregar Estudiante)
- Formulario de nuevo estudiante
- Camara web para captura de foto
- Campos: nombre, RUT
- Boton para volver al dashboard
- Scripts: config.js, api.js, utils.js, student-form.js
- Estilos: main.css, students.css

## Flujo de Navegacion

1. Usuario accede a `index.html` (Dashboard)
2. Click en "Agregar Nuevo Estudiante" → navega a `add-student.html`
3. Completa formulario y guarda estudiante
4. Redirige a `index.html?success=true`
5. Dashboard detecta parametro y muestra toast de exito

## Configuracion de la API

La URL de la API se configura automaticamente en `config.js`:

- **Desarrollo**: `http://localhost:8000` (cuando hostname es 'localhost')
- **Produccion**: `https://iotinacap.eastus.cloudapp.azure.com`

## Caracteristicas

### Dashboard (index.html)
- Reloj en tiempo real
- Estadisticas de presentes/ausentes
- Ultimos 10 registros de asistencia
- Tabla con filtros:
  - Busqueda por nombre/RUT
  - Filtro por estado (todos/presentes/ausentes)
- Actualizacion automatica cada 10 segundos
- Notificaciones de nuevos registros
- Indicador de estado de conexion

### Formulario (add-student.html)
- Acceso a camara web
- Captura de foto
- Validacion de campos
- Vista previa de foto capturada
- Redireccion con mensaje de exito

## Uso

### Desarrollo Local

1. Iniciar servidor backend en puerto 8000
2. Abrir `views/index.html` en el navegador
3. El sistema detectara automaticamente que esta en localhost

### Produccion

1. Subir archivos al servidor web
2. La aplicacion se conectara automaticamente a la API de produccion
3. Acceder via `https://iotinacap.eastus.cloudapp.azure.com/web-dashboard/views/index.html`

## Ventajas de la Nueva Estructura

1. **Codigo Limpio**: Cada archivo tiene una responsabilidad clara
2. **Mantenibilidad**: Facil de encontrar y modificar funcionalidades
3. **Reutilizacion**: utils.js y api.js son reutilizables
4. **Escalabilidad**: Facil agregar nuevas vistas
5. **Sin Duplicacion**: Codigo compartido en archivos comunes
6. **Navegacion Clara**: Vistas separadas mejoran UX
7. **Imports Organizados**: Cada vista carga solo lo necesario

## Notas Tecnicas

- Todos los archivos usan rutas relativas
- Los scripts se cargan en orden de dependencias
- No hay dependencias externas (vanilla JS)
- Compatible con navegadores modernos
- Responsive design incluido
