# 🦅 HALCON — Sistema de Gestión de Pedidos

> Aplicación web para la administración del ciclo de vida de pedidos de una distribuidora de materiales de construcción. Incluye portal público de rastreo para clientes y panel administrativo con control de acceso por roles.

---

## 📋 Tabla de Contenidos

- [Vista previa](#-vista-previa)
- [Características](#-características)
- [Tecnologías utilizadas](#-tecnologías-utilizadas)
- [Requisitos previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Cómo correr el proyecto](#-cómo-correr-el-proyecto)
- [Ver en celular](#-ver-en-celular)
- [Usuarios de prueba](#-usuarios-de-prueba)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Roles y permisos](#-roles-y-permisos)
- [Ciclo de vida de un pedido](#-ciclo-de-vida-de-un-pedido)
- [Scripts disponibles](#-scripts-disponibles)

---

## 🖥 Vista previa

| Portal Público | Dashboard Interno |
|---|---|
| Consulta de pedidos sin login | Panel con estadísticas y tabla de pedidos |

---

## ✨ Características

- 🌐 **Portal público** — los clientes consultan el estado de su pedido con su número de cliente y número de factura, sin necesidad de registro
- 🔐 **Autenticación** — acceso seguro para empleados con usuario y contraseña
- 👥 **Control de acceso por roles** — cada departamento solo ve y hace lo que le corresponde
- 📦 **Gestión completa de pedidos** — creación, edición, cambios de estado y eliminación lógica
- 📸 **Subida de fotos** — evidencia de carga y entrega por parte del personal de Ruta
- 🔍 **Búsqueda y filtros** — por número de factura, número de cliente, fecha y estado
- 🗃 **Pedidos archivados** — papelera con opción de restaurar o editar
- 👤 **Administración de usuarios** — el Admin crea usuarios y asigna roles

---

## 🛠 Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| [React](https://react.dev/) | 18+ | Librería principal de UI |
| [Vite](https://vitejs.dev/) | 5+ | Bundler y servidor de desarrollo |
| Node.js | 18+ | Entorno de ejecución |
| npm | 9+ | Gestor de paquetes |
| CSS-in-JS | — | Estilos inline con variables CSS |

---

## 📦 Requisitos previos

Antes de instalar el proyecto necesitas tener instalado en tu computadora:

### 1. Node.js y npm

Node.js incluye npm automáticamente.

**Windows / Mac / Linux:**
1. Ve a [https://nodejs.org](https://nodejs.org)
2. Descarga la versión **LTS** (la recomendada, lado izquierdo)
3. Ejecuta el instalador y sigue los pasos (siguiente, siguiente, instalar)
4. Al terminar, verifica la instalación abriendo una terminal y corriendo:

```bash
node --version
```
```bash
npm --version
```

Deberías ver algo como `v20.11.0` y `10.2.4`. Si aparece un número, está correctamente instalado.

> **¿Qué es una terminal?**
> - **Windows:** Presiona `Win + R`, escribe `cmd` y da Enter. O busca "Símbolo del sistema" en el menú inicio.
> - **Mac:** Abre `Spotlight` con `Cmd + Espacio`, escribe `Terminal` y da Enter.
> - **Linux:** `Ctrl + Alt + T`

### 2. Git (opcional, para clonar el repositorio)

1. Ve a [https://git-scm.com](https://git-scm.com)
2. Descarga e instala la versión para tu sistema operativo
3. Verifica con:

```bash
git --version
```

---

## 🚀 Instalación

### Paso 1 — Obtener el código

**Opción A: Clonar con Git**
```bash
git clone https://github.com/tu-usuario/halcon.git
```

**Opción B: Descargar ZIP**
1. En GitHub haz clic en el botón verde **Code**
2. Selecciona **Download ZIP**
3. Extrae el archivo en una carpeta de tu elección

---

### Paso 2 — Crear el proyecto Vite

Abre una terminal en la carpeta donde quieres trabajar y corre:

```bash
npm create vite@latest halcon -- --template react
```

Cuando te pregunte, selecciona:
- **Framework:** React
- **Variant:** JavaScript

---

### Paso 3 — Entrar a la carpeta del proyecto

```bash
cd halcon
```

---

### Paso 4 — Instalar dependencias

```bash
npm install
```

> Este comando descarga todas las librerías necesarias. Puede tardar un minuto la primera vez. Se crea una carpeta `node_modules` — esto es normal.

---

### Paso 5 — Reemplazar el archivo principal

1. Abre la carpeta `halcon` en tu explorador de archivos
2. Navega a `src/`
3. Abre el archivo `App.jsx`
4. **Borra todo su contenido**
5. Copia y pega el contenido del archivo `halcon_app.jsx` de este repositorio
6. Guarda el archivo

También puedes hacerlo desde la terminal si tienes el archivo descargado:

```bash
# Desde la raíz del proyecto
cp /ruta/al/archivo/halcon_app.jsx src/App.jsx
```

---

### Paso 6 — Limpiar estilos globales (opcional pero recomendado)

Abre `src/index.css` y borra todo su contenido para evitar conflictos de estilos.

```bash
# Vaciar el archivo desde terminal
> src/index.css
```

---

## ▶️ Cómo correr el proyecto

Una vez instalado, corre este comando desde la carpeta `halcon`:

```bash
npm run dev
```

Verás en la terminal algo como:

```
  VITE v5.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Abre tu navegador y ve a:

```
http://localhost:5173
```

¡La aplicación estará corriendo!

> Para detener el servidor presiona `Ctrl + C` en la terminal.

---

## 📱 Ver en celular

Para ver la aplicación desde tu celular, ambos dispositivos deben estar conectados a la **misma red WiFi**.

### Paso 1 — Correr con host expuesto

```bash
npm run dev -- --host
```

La terminal mostrará:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.XX:5173/
```

### Paso 2 — Abrir en el celular

Toma la dirección **Network** (la que tiene la IP, no `localhost`) y escríbela en el navegador de tu celular.

### ¿Cómo saber tu IP si no aparece?

**Windows:**
```bash
ipconfig
```
Busca la línea **Dirección IPv4** bajo tu adaptador WiFi.

**Mac / Linux:**
```bash
ifconfig | grep "inet "
```

---

## 👤 Usuarios de prueba

La aplicación incluye usuarios precargados para probar cada rol:

| Usuario | Contraseña | Rol | Permisos principales |
|---|---|---|---|
| `admin` | `admin123` | Admin | Gestión de usuarios, acceso total |
| `cmendoza` | `ventas123` | Ventas | Crear y editar pedidos |
| `lramirez` | `alma123` | Almacén | Cambiar estado a En Proceso / En Ruta |
| `jsoto` | `compras123` | Compras | Consulta de pedidos |
| `matorres` | `ruta123` | Ruta | Subir fotos, marcar como Entregado |

> El portal público (rastreo de clientes) no requiere login. Usa los datos de pedidos de prueba:
> - **# Cliente:** `C-101` / **# Factura:** `F-0001`
> - **# Cliente:** `C-102` / **# Factura:** `F-0002`

---

## 📁 Estructura del proyecto

```
halcon/
├── public/                 # Archivos estáticos
├── src/
│   ├── App.jsx             # ← Toda la aplicación vive aquí
│   ├── main.jsx            # Punto de entrada de React
│   └── index.css           # Estilos globales (puede quedar vacío)
├── index.html              # HTML base
├── vite.config.js          # Configuración de Vite
├── package.json            # Dependencias y scripts
└── README.md               # Este archivo
```

---

## 🔐 Roles y permisos

| Acción | Admin | Ventas | Almacén | Compras | Ruta |
|---|:---:|:---:|:---:|:---:|:---:|
| Ver todos los pedidos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Crear pedido | ❌ | ✅ | ❌ | ❌ | ❌ |
| Editar pedido | ❌ | ✅ | ❌ | ❌ | ❌ |
| Cambiar a En Proceso | ❌ | ❌ | ✅ | ❌ | ❌ |
| Cambiar a En Ruta | ❌ | ❌ | ✅ | ❌ | ❌ |
| Subir foto de carga | ❌ | ❌ | ❌ | ❌ | ✅ |
| Subir evidencia de entrega | ❌ | ❌ | ❌ | ❌ | ✅ |
| Marcar como Entregado | ❌ | ❌ | ❌ | ❌ | ✅ |
| Archivar pedido | ✅ | ✅ | ❌ | ❌ | ❌ |
| Restaurar pedido | ✅ | ✅ | ❌ | ❌ | ❌ |
| Gestionar usuarios | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🔄 Ciclo de vida de un pedido

```
Cliente llama
      ↓
[Ventas] Crea el pedido → Estado: ORDENADO
      ↓
[Almacén] Prepara materiales → Estado: EN PROCESO
      ↓
[Almacén] Carga la unidad → Estado: EN RUTA
      ↓
[Ruta] Sube foto de carga
      ↓
[Ruta] Entrega y sube foto de evidencia → Estado: ENTREGADO
      ↓
[Cliente] Consulta en portal público y ve foto de entrega
```

> ⚠️ Los estados son **secuenciales y no se pueden saltar**. Cada transición solo puede hacerla el rol correspondiente.

---

## 📜 Scripts disponibles

Desde la carpeta raíz del proyecto:

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:5173` |
| `npm run dev -- --host` | Inicia el servidor accesible desde otros dispositivos en la red |
| `npm run build` | Genera la versión de producción en la carpeta `dist/` |
| `npm run preview` | Previsualiza la build de producción localmente |

---

## 🐛 Problemas comunes

**`npm: command not found`**
→ Node.js no está instalado o no se agregó al PATH. Reinstala desde [nodejs.org](https://nodejs.org).

**Puerto 5173 en uso**
→ Vite usará el siguiente disponible automáticamente (5174, 5175...). Revisa la URL que aparece en la terminal.

**La página aparece en blanco**
→ Abre la consola del navegador (`F12` → pestaña Console) y revisa si hay errores. Lo más común es que `src/App.jsx` no se guardó correctamente.

**No puedo acceder desde el celular**
→ Verifica que ambos dispositivos estén en la misma red WiFi y que usaste `npm run dev -- --host`.

---

## 📄 Licencia

Este proyecto es de uso interno para **Halcon Materiales de Construcción**.
