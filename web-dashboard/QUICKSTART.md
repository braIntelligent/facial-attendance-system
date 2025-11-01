# Quick Start Guide - Web Dashboard

## Inicio Rapido (5 minutos)

### 1. Verificar Pre-requisitos

```bash
# Asegurate de que el backend este corriendo
# Debe estar disponible en:
# - Desarrollo: http://localhost:8000
# - Produccion: https://tu-servidor.example.com
```

### 2. Abrir el Dashboard

**Opcion A: Desarrollo Local**
```bash
# Navega al directorio
cd /Users/matiascataldo/Desktop/facial-attendance-system/web-dashboard/views

# Abre en navegador (Mac)
open index.html

# O arrastra index.html al navegador
```

**Opcion B: Servidor Web**
```bash
# Si tienes Python instalado (servidor simple)
cd /Users/matiascataldo/Desktop/facial-attendance-system/web-dashboard
python3 -m http.server 8080

# Abre en navegador
# http://localhost:8080/views/index.html
```

### 3. Verificar que Funciona

- ✅ Reloj muestra fecha y hora actual
- ✅ Estado muestra "Conectado al servidor"
- ✅ Tabla de estudiantes carga datos
- ✅ Estadisticas muestran numeros correctos

### 4. Agregar Primer Estudiante

1. Click en "Agregar Nuevo Estudiante"
2. Click en "Iniciar Camara"
3. Permitir acceso a la camara
4. Click en "Capturar Foto"
5. Ingresar nombre completo
6. Ingresar RUT (opcional)
7. Click en "Guardar Estudiante"
8. Verificar que aparece en el dashboard

## Navegacion

### Estructura de URLs

**Dashboard**:
- Local: `file:///[ruta]/views/index.html`
- Servidor: `http://localhost:8080/views/index.html`

**Agregar Estudiante**:
- Local: `file:///[ruta]/views/add-student.html`
- Servidor: `http://localhost:8080/views/add-student.html`

### Botones de Navegacion

- **Dashboard → Agregar**: Click en "+ Agregar Nuevo Estudiante"
- **Agregar → Dashboard**: Click en "← Volver al Dashboard"
- **Cancelar formulario**: Click en "Cancelar" (confirma primero)

## Configuracion

### Cambiar URL del Backend

Editar `/Users/matiascataldo/Desktop/facial-attendance-system/web-dashboard/assets/js/config.js`:

```javascript
const CONFIG = {
    API_URL: 'http://tu-servidor:puerto',  // Cambiar aqui
    REFRESH_INTERVAL: 10000,
    MAX_REGISTROS_RECIENTES: 10
};
```

### Cambiar Intervalo de Actualizacion

En el mismo archivo `config.js`:

```javascript
const CONFIG = {
    API_URL: ...,
    REFRESH_INTERVAL: 5000,  // 5 segundos en vez de 10
    MAX_REGISTROS_RECIENTES: 10
};
```

### Cambiar Cantidad de Registros Recientes

En el mismo archivo `config.js`:

```javascript
const CONFIG = {
    API_URL: ...,
    REFRESH_INTERVAL: 10000,
    MAX_REGISTROS_RECIENTES: 20  // Mostrar 20 en vez de 10
};
```

## Solucion de Problemas Comunes

### Error: "Error al conectar con el servidor"

**Causa**: Backend no esta corriendo o URL incorrecta

**Solucion**:
1. Verificar que backend este en puerto 8000
2. Revisar `config.js` tiene la URL correcta
3. Abrir consola del navegador (F12) para ver error exacto

### Error: "No se pudo acceder a la camara"

**Causa**: Permisos de camara denegados o HTTPS requerido

**Solucion**:
1. Dar permisos de camara al navegador
2. En produccion, usar HTTPS (no HTTP)
3. Revisar que la camara no este en uso por otra app

### Error: Estilos no se aplican

**Causa**: Rutas relativas incorrectas

**Solucion**:
1. Verificar que la estructura de carpetas este correcta
2. Abrir desde `views/index.html` (no desde raiz)
3. Limpiar cache del navegador (Ctrl+Shift+R)

### Error: "Estudiante agregado exitosamente" no aparece

**Causa**: Redireccion no incluye parametro `?success=true`

**Solucion**:
1. Verificar que `student-form.js` redirige a `index.html?success=true`
2. Verificar que `dashboard.js` tiene la funcion `verificarMensajeExito()`

## Atajos de Teclado

- `Ctrl + R` o `F5`: Recargar pagina
- `Ctrl + Shift + R`: Recargar sin cache
- `F12`: Abrir DevTools (consola)
- `Ctrl + Shift + C`: Inspeccionar elemento

## Archivos Importantes

```
web-dashboard/
├── views/
│   ├── index.html          ← INICIO AQUI (dashboard)
│   └── add-student.html    ← Formulario de estudiante
├── assets/js/
│   └── config.js           ← CONFIGURACION AQUI
└── README.md               ← Documentacion completa
```

## Siguientes Pasos

1. ✅ Leer [README.md](README.md) para entender la arquitectura
2. ✅ Revisar [TESTING.md](TESTING.md) para probar todas las funcionalidades
3. ✅ Ver [MIGRATION.md](MIGRATION.md) para entender los cambios
4. ✅ Consultar [INDEX.md](INDEX.md) para navegar el codigo

## Soporte

### Consola del Navegador

Abrir con `F12` y revisar:
- **Console**: Errores de JavaScript
- **Network**: Llamadas a la API
- **Application**: LocalStorage, cookies, etc.

### Mensajes de Debug

El codigo incluye `console.log()` para debugging:
- "🚀 Dashboard iniciado"
- "✅ Dashboard cargado"
- "🚀 Formulario de estudiante iniciado"
- "✅ Formulario de estudiante cargado"

Si no ves estos mensajes, hay un error en la carga de scripts.

## Comandos Utiles

### Verificar estructura de archivos
```bash
cd /Users/matiascataldo/Desktop/facial-attendance-system/web-dashboard
tree
```

### Buscar en el codigo
```bash
# Buscar funcion especifica
grep -r "function cargarDatos" assets/js/

# Buscar uso de API
grep -r "CONFIG.API_URL" assets/js/
```

### Ver logs del servidor backend
```bash
# Si el backend esta corriendo con uvicorn
# Ver logs en la terminal donde se ejecuto
```

## Notas Finales

- **No se requiere npm install** - Todo es vanilla JavaScript
- **No se requiere build** - Archivos listos para usar
- **No hay dependencias externas** - Funciona offline (excepto API calls)
- **Compatible con todos los navegadores modernos**

## Links Rapidos

- [Dashboard](views/index.html)
- [Agregar Estudiante](views/add-student.html)
- [Configuracion](assets/js/config.js)
- [Documentacion Completa](README.md)
