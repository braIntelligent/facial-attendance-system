# Indice de Archivos - Web Dashboard

## Vistas HTML (views/)

### index.html (118 lineas)
**Proposito**: Dashboard principal de asistencia
**Muestra**:
- Header con reloj y estadisticas
- Ultimos 10 registros de asistencia
- Tabla de estudiantes con filtros
- Navegacion a formulario de agregar estudiante

**Scripts utilizados**:
- config.js
- api.js
- utils.js
- dashboard.js

**Estilos utilizados**:
- main.css
- dashboard.css

### add-student.html (81 lineas)
**Proposito**: Formulario para agregar nuevo estudiante
**Muestra**:
- Header con titulo
- Formulario con camara web
- Campos: nombre, RUT
- Navegacion de vuelta al dashboard

**Scripts utilizados**:
- config.js
- api.js
- utils.js
- student-form.js

**Estilos utilizados**:
- main.css
- students.css

---

## JavaScript (assets/js/)

### config.js (9 lineas)
**Proposito**: Configuracion centralizada
**Exporta**: Objeto `CONFIG`

**Contenido**:
- `API_URL`: URL del backend (auto-detecta localhost vs produccion)
- `REFRESH_INTERVAL`: Intervalo de actualizacion (10 segundos)
- `MAX_REGISTROS_RECIENTES`: Cuantos registros mostrar (10)

**Usado por**: dashboard.js, student-form.js, api.js

### api.js (48 lineas)
**Proposito**: Cliente API centralizado
**Exporta**: 3 funciones async

**Funciones**:
- `getStudents()`: GET /api/estudiantes
- `getAttendanceToday()`: GET /api/asistencia/hoy
- `addStudent(formData)`: POST /api/estudiantes/nuevo

**Usado por**: dashboard.js, student-form.js

### utils.js (107 lineas)
**Proposito**: Funciones utilitarias comunes
**Exporta**: 4 funciones

**Funciones**:
- `actualizarReloj()`: Actualiza fecha y hora en header
- `mostrarToast(mensaje, tipo)`: Muestra notificaciones temporales
- `actualizarEstadoConexion(online)`: Actualiza indicador de conexion
- `reproducirSonidoRegistro()`: Reproduce beep de notificacion

**Usado por**: dashboard.js, student-form.js

### dashboard.js (239 lineas)
**Proposito**: Logica del dashboard de asistencia
**Usado en**: index.html

**Estado**:
- `estudiantes`: Array de estudiantes
- `asistencias`: Array de asistencias del dia
- `filtroActivo`: 'todos' | 'presentes' | 'ausentes'
- `busqueda`: String de busqueda

**Funciones principales**:
- `cargarDatos()`: Fetch estudiantes y asistencias
- `renderizarListaAsistencia()`: Renderiza tabla con filtros
- `renderizarUltimosRegistros()`: Renderiza ultimos 10 registros
- `actualizarEstadisticas()`: Actualiza contadores
- `verificarNuevosRegistros()`: Detecta y notifica nuevos registros
- `verificarMensajeExito()`: Muestra toast si viene de ?success=true

**Event Listeners**:
- Input de busqueda
- Radio buttons de filtro

**Timers**:
- Reloj: cada 1 segundo
- Datos: cada 10 segundos

### student-form.js (225 lineas)
**Proposito**: Logica del formulario de agregar estudiante
**Usado en**: add-student.html

**Estado**:
- `streamActivo`: MediaStream de la camara web

**Elementos del DOM**:
- Form, video, canvas, foto preview
- Botones: iniciar camara, capturar, guardar, cancelar
- Inputs: nombre, RUT

**Funciones principales**:
- `iniciarWebcam()`: Solicita y activa camara web
- `detenerWebcam()`: Detiene camara y limpia formulario
- `tomarFoto()`: Captura frame del video al canvas
- `guardarEstudiante(e)`: Envia FormData con foto al backend
- `cancelarFormulario()`: Confirma y vuelve al dashboard

**Flujo**:
1. Iniciar camara → solicita permiso → muestra video
2. Capturar foto → detiene video → muestra preview
3. Llenar formulario → validar campos
4. Guardar → enviar a API → redirigir con exito

---

## CSS (assets/css/)

### main.css (334 lineas)
**Proposito**: Estilos globales compartidos
**Usado en**: index.html, add-student.html

**Contenido**:
- Variables CSS (:root)
- Reset y base styles
- Header y info cards
- Navegacion (nav-button)
- Estado de conexion
- Secciones (.seccion)
- Botones (.btn-*)
- Toast notifications
- Footer
- Scrollbar personalizada
- Media queries responsive

### dashboard.css (155 lineas)
**Proposito**: Estilos especificos del dashboard
**Usado en**: index.html

**Contenido**:
- Ultimos registros (.ultimos-registros)
- Registro item (.registro-item)
- Filtros (.filtros, .input-buscar)
- Tabla de asistencia (table, thead, tbody)
- Estados (.estado-badge, .presente, .ausente)
- Media queries responsive

### students.css (102 lineas)
**Proposito**: Estilos del formulario de estudiante
**Usado en**: add-student.html

**Contenido**:
- Grid del formulario (.form-grid)
- Columna de camara (.form-col-camara)
- Contenedor de camara (.camara-container)
- Video y foto preview
- Columna de datos (.form-col-datos)
- Form grupos (.form-grupo)
- Acciones del form (.form-acciones)
- Media queries responsive

---

## Documentacion (*.md)

### README.md
**Contenido**:
- Estructura del proyecto
- Arquitectura y responsabilidades
- Flujo de navegacion
- Configuracion de la API
- Caracteristicas principales
- Instrucciones de uso
- Ventajas de la estructura

### MIGRATION.md
**Contenido**:
- Comparacion OLD vs NEW
- Desglose de archivos
- Migracion de funcionalidades
- Tabla de mapeo de codigo
- Ventajas de la migracion

### TESTING.md
**Contenido**:
- Checklist de pruebas funcionales
- Pruebas de dashboard
- Pruebas de formulario
- Manejo de errores
- Responsive design
- Compatibilidad de navegadores
- Flujos completos de usuario

### INDEX.md (este archivo)
**Contenido**:
- Indice completo del proyecto
- Descripcion de cada archivo
- Proposito y contenido
- Referencias cruzadas

---

## Estadisticas del Proyecto

### Archivos
- HTML: 2 archivos (199 lineas)
- JavaScript: 5 archivos (628 lineas)
- CSS: 3 archivos (591 lineas)
- Documentacion: 4 archivos

### Total
- **10 archivos de codigo** (1,418 lineas)
- **4 archivos de documentacion**

### Estructura Antigua (comparacion)
- HTML: 1 archivo (155 lineas)
- JavaScript: 1 archivo (490 lineas)
- CSS: 1 archivo (549 lineas)
- Total: 3 archivos (1,194 lineas)

### Diferencia
- +224 lineas de codigo (por separacion y documentacion inline)
- +4 archivos de documentacion
- Mejor organizacion y mantenibilidad

---

## Flujo de Dependencias

```
index.html
├── main.css
├── dashboard.css
├── config.js
├── api.js (usa config.js)
├── utils.js
└── dashboard.js (usa config.js, api.js, utils.js)

add-student.html
├── main.css
├── students.css
├── config.js
├── api.js (usa config.js)
├── utils.js
└── student-form.js (usa config.js, api.js, utils.js)
```

---

## Referencias Rapidas

### Para agregar nueva funcionalidad al dashboard:
1. Modificar `dashboard.js`
2. Actualizar estilos en `dashboard.css` si es necesario
3. Agregar elementos HTML en `index.html`

### Para agregar nueva funcionalidad al formulario:
1. Modificar `student-form.js`
2. Actualizar estilos en `students.css` si es necesario
3. Agregar elementos HTML en `add-student.html`

### Para agregar nuevo endpoint de API:
1. Agregar funcion en `api.js`
2. Usar la funcion en `dashboard.js` o `student-form.js`

### Para agregar nueva utilidad global:
1. Agregar funcion en `utils.js`
2. Usar desde cualquier archivo

### Para cambiar configuracion:
1. Modificar `config.js`
2. Los cambios se reflejan en toda la aplicacion

---

## Navegacion del Codigo

**Inicio**: `views/index.html`
**Formulario**: `views/add-student.html`

**Core JS**:
- Config: `assets/js/config.js`
- API: `assets/js/api.js`
- Utils: `assets/js/utils.js`

**Features JS**:
- Dashboard: `assets/js/dashboard.js`
- Formulario: `assets/js/student-form.js`

**Estilos Globales**: `assets/css/main.css`
**Estilos Dashboard**: `assets/css/dashboard.css`
**Estilos Formulario**: `assets/css/students.css`
