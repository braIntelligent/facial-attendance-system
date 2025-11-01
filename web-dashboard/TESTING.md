# Guia de Pruebas - Web Dashboard

## Pre-requisitos

1. Servidor backend corriendo en puerto 8000
2. Navegador moderno (Chrome, Firefox, Safari, Edge)
3. Camara web disponible (para agregar estudiantes)

## Pruebas Funcionales

### 1. Dashboard Principal (index.html)

#### Carga Inicial
- [ ] Abrir `views/index.html`
- [ ] Verificar que carga sin errores en consola
- [ ] El reloj muestra fecha y hora correcta
- [ ] Se actualiza cada segundo
- [ ] Muestra "Conectando..." y luego "Conectado al servidor"
- [ ] Estadisticas muestran numeros correctos

#### Lista de Asistencia
- [ ] Tabla carga estudiantes correctamente
- [ ] Columnas: Estado, Nombre, RUT, Hora de Ingreso
- [ ] Estados muestran "Presente" (verde) o "Ausente" (rojo)
- [ ] Hora de ingreso muestra formato correcto

#### Busqueda y Filtros
- [ ] Escribir nombre en buscador filtra la tabla
- [ ] Buscar por RUT funciona
- [ ] Filtro "Todos" muestra todos
- [ ] Filtro "Presentes" muestra solo presentes
- [ ] Filtro "Ausentes" muestra solo ausentes
- [ ] Combinacion de busqueda + filtro funciona

#### Ultimos Registros
- [ ] Muestra ultimos 10 registros
- [ ] Formato correcto: nombre, dispositivo, hora
- [ ] Se actualiza con nuevos registros

#### Actualizacion Automatica
- [ ] Esperar 10 segundos
- [ ] Datos se actualizan automaticamente
- [ ] Timestamp de "Ultima actualizacion" cambia
- [ ] Sin recargar la pagina completa

#### Deteccion de Nuevos Registros
- [ ] Registrar asistencia desde Raspberry Pi
- [ ] Esperar hasta 10 segundos
- [ ] Toast aparece con nombre del estudiante
- [ ] Sonido de notificacion se reproduce
- [ ] Registro aparece en "Ultimos Registros"

#### Navegacion
- [ ] Click en "Agregar Nuevo Estudiante"
- [ ] Navega a `add-student.html`

### 2. Formulario de Estudiante (add-student.html)

#### Carga Inicial
- [ ] Abrir `views/add-student.html` directamente
- [ ] Abrir desde dashboard (boton de navegacion)
- [ ] Pagina carga sin errores
- [ ] Header muestra titulo correcto
- [ ] Boton "Volver al Dashboard" visible

#### Camara Web
- [ ] Click en "Iniciar Camara"
- [ ] Navegador solicita permiso de camara
- [ ] Video preview se muestra correctamente
- [ ] Boton cambia a "Capturar Foto"
- [ ] Boton "Guardar Estudiante" esta deshabilitado

#### Captura de Foto
- [ ] Click en "Capturar Foto"
- [ ] Video se detiene
- [ ] Foto capturada se muestra en preview
- [ ] Boton "Iniciar Camara" reaparece
- [ ] Boton "Guardar Estudiante" se habilita

#### Validacion de Formulario
- [ ] Intentar guardar sin nombre → Error "El nombre es obligatorio"
- [ ] Intentar guardar sin foto → Error "Debe capturar una foto"
- [ ] Nombre vacio no permite submit

#### Guardar Estudiante
- [ ] Ingresar nombre completo
- [ ] Ingresar RUT (opcional)
- [ ] Capturar foto
- [ ] Click en "Guardar Estudiante"
- [ ] Boton muestra "Guardando..."
- [ ] Toast: "Estudiante agregado"
- [ ] Redirige a dashboard

#### Mensaje de Exito en Dashboard
- [ ] Despues de guardar, redirige a `index.html?success=true`
- [ ] Toast aparece: "Estudiante agregado exitosamente"
- [ ] Parametro se limpia de la URL
- [ ] Nuevo estudiante aparece en la lista

#### Cancelar Formulario
- [ ] Click en "Cancelar"
- [ ] Confirmar dialogo aparece
- [ ] Aceptar → vuelve al dashboard
- [ ] Cancelar → permanece en formulario

#### Navegacion
- [ ] Click en "Volver al Dashboard"
- [ ] Navega a `index.html`

### 3. Manejo de Errores

#### Sin Conexion al Backend
- [ ] Detener servidor backend
- [ ] Recargar dashboard
- [ ] Indicador muestra "Sin conexion" (rojo)
- [ ] Toast: "Error al conectar con el servidor"

#### Error al Guardar Estudiante
- [ ] Backend devuelve error (ej: estudiante duplicado)
- [ ] Toast muestra el mensaje de error
- [ ] Formulario no se limpia
- [ ] Usuario puede reintentar

### 4. Responsive Design

#### Desktop (1920x1080)
- [ ] Layout correcto
- [ ] Header muestra 4 columnas de info
- [ ] Formulario muestra 2 columnas (camara | datos)

#### Tablet (768x1024)
- [ ] Header ajusta a 2 columnas
- [ ] Tabla scrolleable horizontalmente si es necesario
- [ ] Formulario mantiene 2 columnas

#### Mobile (375x667)
- [ ] Header ajusta a 2 filas
- [ ] Filtros en columna vertical
- [ ] Formulario cambia a 1 columna
- [ ] Camara se centra
- [ ] Botones se centran

### 5. Compatibilidad de Navegadores

- [ ] Chrome (ultima version)
- [ ] Firefox (ultima version)
- [ ] Safari (ultima version)
- [ ] Edge (ultima version)

### 6. Pruebas de Integracion

#### Flujo Completo: Agregar Estudiante
1. [ ] Abrir dashboard
2. [ ] Click "Agregar Nuevo Estudiante"
3. [ ] Permitir acceso a camara
4. [ ] Iniciar camara
5. [ ] Capturar foto
6. [ ] Ingresar nombre y RUT
7. [ ] Guardar estudiante
8. [ ] Verificar toast de exito
9. [ ] Verificar redireccion a dashboard
10. [ ] Verificar estudiante en lista

#### Flujo Completo: Registro de Asistencia
1. [ ] Estudiante registra asistencia en Raspberry Pi
2. [ ] Esperar hasta 10 segundos
3. [ ] Dashboard muestra notificacion
4. [ ] Estudiante aparece como "Presente"
5. [ ] Registro aparece en "Ultimos Registros"
6. [ ] Hora de ingreso correcta

## Pruebas de Rendimiento

### Carga de Datos
- [ ] 10 estudiantes → carga instantanea
- [ ] 100 estudiantes → carga rapida (<1s)
- [ ] 1000 estudiantes → carga aceptable (<3s)

### Actualizacion
- [ ] Polling cada 10 segundos no causa lag
- [ ] Filtros responden instantaneamente
- [ ] Busqueda es fluida (sin delays)

## Checklist de Archivos

### JavaScript
- [ ] `config.js` - CONFIG global accesible
- [ ] `api.js` - Funciones fetch disponibles
- [ ] `utils.js` - Funciones utilitarias funcionan
- [ ] `dashboard.js` - Dashboard se inicializa
- [ ] `student-form.js` - Formulario se inicializa

### CSS
- [ ] `main.css` - Estilos globales aplicados
- [ ] `dashboard.css` - Estilos de tabla aplicados
- [ ] `students.css` - Estilos de formulario aplicados

### HTML
- [ ] `index.html` - Todos los scripts cargados
- [ ] `add-student.html` - Todos los scripts cargados

## Errores Comunes

### No carga estudiantes
- Verificar que backend este corriendo
- Revisar URL en `config.js`
- Revisar consola del navegador

### Camara no funciona
- Verificar permisos del navegador
- HTTPS requerido en produccion
- Revisar consola para errores

### Estilos no se aplican
- Verificar rutas relativas en HTML
- Limpiar cache del navegador
- Revisar consola para 404 errors

## Resultado Esperado

- ✅ Todas las pruebas pasan
- ✅ Sin errores en consola
- ✅ Navegacion fluida entre vistas
- ✅ Datos se actualizan correctamente
- ✅ Responsive en todos los dispositivos
- ✅ Compatible con todos los navegadores

## Reportar Issues

Si encuentras algun problema:

1. Descripcion del error
2. Pasos para reproducir
3. Navegador y version
4. Screenshots (si aplica)
5. Errores de consola
