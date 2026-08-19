# WorkLink Frontend

Aplicación web frontend de **WorkLink**, una plataforma diseñada para conectar freelancers, clientes y empresas dentro de un mismo entorno digital.

WorkLink permite explorar perfiles profesionales, publicar y consultar vacantes, gestionar servicios, postulaciones, solicitudes de contratación, contratos, mensajería, notificaciones, reseñas y diferentes funcionalidades según el rol del usuario.

El frontend está desarrollado con **React + TypeScript + Vite**, utilizando **Tailwind CSS v4** como sistema principal de estilos y consumiendo una API REST desarrollada con Laravel.

---

## Demo

La aplicación web se encuentra desplegada en Vercel:

https://worklink-frontend-wyyl-beta.vercel.app/

---

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS v4
- Axios
- Heroicons
- React Icons
- SweetAlert2
- React Markdown
- Remark GFM

---

## Arquitectura general

WorkLink utiliza una arquitectura cliente-servidor.

El frontend web funciona como cliente y consume los servicios proporcionados por el backend mediante una API REST.

```text
Usuario
   ↓
React + TypeScript
   ↓
Axios
   ↓
API REST
   ↓
Backend Laravel
   ↓
MySQL
```

La comunicación entre frontend y backend se realiza mediante HTTP/HTTPS y el intercambio de información se maneja principalmente en formato JSON.

---

## Roles del sistema

WorkLink maneja cuatro tipos principales de usuario:

- Cliente
- Freelancer
- Empresa
- Administrador

Cada rol cuenta con funcionalidades específicas dentro de la plataforma.

---

## Cliente

El usuario con rol `cliente` puede:

- Explorar freelancers.
- Consultar perfiles profesionales.
- Consultar servicios.
- Enviar solicitudes de contratación.
- Gestionar contratos.
- Comunicarse con freelancers mediante mensajería.
- Consultar notificaciones.
- Consultar y generar reseñas cuando corresponda.
- Administrar su información personal.

---

## Freelancer

El usuario con rol `freelancer` puede:

- Crear y administrar su perfil profesional.
- Publicar servicios.
- Editar y eliminar servicios.
- Administrar su portafolio.
- Gestionar su disponibilidad.
- Explorar vacantes.
- Consultar el detalle de una vacante.
- Postularse a vacantes.
- Consultar sus postulaciones.
- Gestionar solicitudes de contratación.
- Gestionar contratos.
- Comunicarse mediante mensajería.
- Consultar notificaciones.
- Consultar reseñas y calificaciones.
- Administrar su cuenta y seguridad.

---

## Empresa

El usuario con rol `empresa` puede:

- Crear y administrar su perfil empresarial.
- Publicar vacantes.
- Editar y administrar vacantes.
- Consultar postulaciones recibidas.
- Revisar perfiles de candidatos.
- Aceptar o rechazar postulaciones.
- Comunicarse con freelancers mediante mensajería.
- Gestionar solicitudes de contratación.
- Gestionar contratos.
- Consultar notificaciones.
- Consultar reseñas.
- Administrar su cuenta y seguridad.

---

## Administrador

El usuario con rol `admin` cuenta con un panel administrativo independiente.

Entre sus principales funciones se encuentran:

- Gestión de usuarios.
- Gestión de freelancers.
- Gestión de empresas.
- Gestión de vacantes.
- Gestión de servicios.
- Gestión de solicitudes.
- Supervisión de conversaciones.
- Gestión de reseñas.
- Consulta de reportes.
- Configuración administrativa.

---

# Funcionalidades principales

El frontend de WorkLink cuenta con los siguientes módulos:

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Recuperación de contraseña.
- Restablecimiento de contraseña.
- Autenticación en dos pasos.
- Gestión de seguridad de cuenta.
- Gestión de perfiles.
- Exploración pública de freelancers.
- Detalle público de freelancer.
- Gestión de servicios.
- Gestión de portafolio.
- Gestión de disponibilidad.
- Exploración pública de vacantes.
- Detalle público de vacantes.
- Gestión de vacantes empresariales.
- Postulaciones a vacantes.
- Gestión de postulaciones recibidas.
- Solicitudes de contratación.
- Gestión de contratos.
- Sistema de mensajería.
- Sistema de notificaciones.
- Sistema de reseñas.
- Chatbot integrado.
- Panel administrativo.
- Tema claro y oscuro.
- Descarga de la aplicación Android.

---

# Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado:

1. **Node.js**
2. **npm**
3. **Git**

Se recomienda utilizar una versión reciente y estable de Node.js.

---

# Clonar el proyecto

```bash
git clone <url-del-repositorio> worklink_frontend

cd worklink_frontend
```

---

# Instalar dependencias

```bash
npm install
```

---

# Variables de entorno

El frontend utiliza variables de entorno para definir la URL del backend.

Crea un archivo:

```text
.env
```

y agrega:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Para producción puede utilizarse:

```env
VITE_API_URL=https://tu-backend.com/api
```

Las variables de Vite que deben ser accesibles desde el frontend deben comenzar con:

```text
VITE_
```

No deben almacenarse contraseñas, claves privadas ni secretos sensibles dentro del frontend.

---

# Scripts

## Desarrollo

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará en consola la dirección local de la aplicación.

Generalmente:

```text
http://localhost:5173
```

---

## Build de producción

```bash
npm run build
```

Este comando ejecuta la validación de TypeScript y posteriormente genera el build optimizado mediante Vite.

```text
TypeScript
   ↓
Validación
   ↓
Vite
   ↓
Build de producción
```

Los archivos generados se almacenan en:

```text
dist/
```

---

## Vista previa del build

```bash
npm run preview
```

Permite ejecutar localmente la versión generada para producción.

---

## ESLint

```bash
npm run lint
```

Valida las reglas configuradas de ESLint y ayuda a detectar errores y problemas de calidad en el código.

---

# Comunicación con el backend

WorkLink consume una API REST desarrollada con Laravel.

La configuración principal de Axios se encuentra dentro de:

```text
src/api/
```

La arquitectura utilizada permite centralizar la configuración de las solicitudes HTTP.

El flujo general es:

```text
Componente
    ↓
Hook
    ↓
Service
    ↓
Axios
    ↓
API REST
    ↓
Laravel
```

Siempre que sea posible, las peticiones HTTP deben realizarse mediante servicios y no directamente desde los componentes visuales.

---

# Autenticación

WorkLink utiliza autenticación basada en JWT.

Después de iniciar sesión, el backend proporciona un token utilizado para realizar solicitudes protegidas.

El frontend administra:

- Sesión del usuario.
- Token JWT.
- Información del usuario autenticado.
- Rol principal.
- Rutas privadas.
- Rutas públicas.
- Redirecciones según el rol.
- Cierre de sesión.
- Expiración de sesión.
- Autenticación en dos pasos.

---

# Autenticación en dos pasos

WorkLink cuenta con soporte para autenticación de dos factores.

El flujo general es:

```text
Inicio de sesión
      ↓
Credenciales correctas
      ↓
¿2FA habilitado?
      ↓
Código de verificación
      ↓
Verificación
      ↓
Sesión iniciada
```

El sistema también permite:

- Habilitar 2FA.
- Verificar el código.
- Deshabilitar 2FA.
- Reenviar códigos.
- Mantener la redirección original después del proceso de autenticación.

---

# Recuperación de contraseña

El sistema cuenta con flujo de recuperación de contraseña.

Incluye:

```text
Olvidé mi contraseña
        ↓
Correo electrónico
        ↓
Solicitud de recuperación
        ↓
Token / código
        ↓
Nueva contraseña
```

También existe un flujo de cambio seguro de contraseña para usuarios autenticados.

---

# Enfoque de estilos

WorkLink utiliza principalmente un enfoque **Tailwind-first**.

La interfaz se construye utilizando clases de Tailwind directamente dentro de los componentes JSX/TSX.

Ejemplo:

```tsx
<div className="rounded-xl border border-border bg-surface p-5 shadow-card">
  <h2 className="text-xl font-semibold text-text">
    WorkLink
  </h2>

  <p className="text-text-muted">
    Conectando talento con oportunidades.
  </p>
</div>
```

---

# Tokens globales

Los tokens globales del sistema se encuentran en:

```text
src/index.css
```

y están definidos principalmente dentro de:

```css
@theme
```

---

## Colores oficiales

Los principales colores de WorkLink son:

```css
--color-primary
--color-secondary

--color-primary-strong
--color-secondary-strong
```

Los colores base son:

```css
--color-background
--color-surface
--color-border

--color-text
--color-text-muted
```

---

## Estados

El sistema incluye tokens para representar diferentes estados:

```css
--color-success
--color-warning
--color-danger
--color-info
```

Estos pueden utilizarse mediante Tailwind:

```text
text-success
text-warning
text-danger
text-info

bg-success/10
bg-warning/10
bg-danger/10
bg-info/10
```

---

# Uso de tokens con Tailwind

Los componentes deben consumir los tokens mediante utilidades como:

```text
bg-primary
bg-secondary

bg-background
bg-surface

text-text
text-text-muted
text-primary

border-border

shadow-soft
shadow-card
```

Se recomienda evitar colores hardcodeados cuando ya exista un token global equivalente.

Por ejemplo, preferir:

```text
bg-surface
```

en lugar de:

```text
bg-white
```

cuando el componente deba responder correctamente al tema claro y oscuro.

---

# Tema oscuro

WorkLink cuenta con soporte para modo claro y oscuro.

El tema oscuro se controla mediante la clase:

```css
.dark
```

Esta clase modifica los tokens principales:

- Fondo.
- Superficie.
- Texto.
- Texto secundario.
- Bordes.
- Sombras.

Esto permite que los componentes utilicen los mismos nombres de clases sin tener que duplicar estilos.

Ejemplo:

```tsx
<div className="bg-surface text-text border-border">
  Contenido
</div>
```

El componente se adapta automáticamente a ambos temas.

---

# Tipografía

La tipografía principal definida para WorkLink es:

```css
--font-sans: "Poppins", "Segoe UI", sans-serif;
```

La interfaz debe mantener consistencia tipográfica utilizando el sistema global.

---

# Radios y sombras

El sistema define radios reutilizables:

```css
--radius-sm
--radius-md
--radius-lg
--radius-xl
--radius-2xl
```

También se incluyen sombras:

```css
--shadow-soft
--shadow-card
```

Estas permiten mantener consistencia visual entre tarjetas, modales, formularios y paneles.

---

# Iconografía

WorkLink utiliza principalmente:

- `@heroicons/react`
- `react-icons`

Para elementos de interfaz se recomienda utilizar iconos en lugar de emojis.

Los iconos deben utilizarse principalmente en:

- Botones.
- Navegación.
- Filtros.
- Estados vacíos.
- Alertas.
- Acciones.
- Tarjetas.
- Formularios.
- Modales.

Heroicons es la librería principal para mantener consistencia visual.

React Icons puede utilizarse cuando se necesite un icono de marca o algún icono no disponible en Heroicons.

---

# Alertas

WorkLink utiliza **SweetAlert2** para mostrar:

- Mensajes de éxito.
- Errores.
- Advertencias.
- Confirmaciones.
- Acciones destructivas.

Siempre que sea posible se deben utilizar los servicios compartidos de alertas en lugar de llamar directamente a SweetAlert2 desde todos los componentes.

---

# Markdown

El proyecto incluye:

- `react-markdown`
- `remark-gfm`

Estas dependencias se utilizan principalmente para mostrar respuestas con contenido Markdown, especialmente en módulos como el chatbot.

---

# Estructura del proyecto

La aplicación utiliza una arquitectura modular.

```text
src/
├── api/
│
├── context/
│
├── modules/
│   ├── admin/
│   ├── applications/
│   ├── auth/
│   ├── availability/
│   ├── briefcase/
│   ├── chatbot/
│   ├── contractRequests/
│   ├── contracts/
│   ├── dashboard/
│   ├── freelancers/
│   ├── home/
│   ├── jobs/
│   ├── messages/
│   ├── notifications/
│   ├── profile/
│   ├── reviews/
│   ├── services/
│   └── vacancies/
│
├── routes/
│
├── shared/
│
├── App.tsx
├── index.css
└── main.tsx
```

---

# Organización de módulos

Cada módulo puede utilizar una estructura similar a:

```text
module/
├── components/
├── hooks/
├── models/
├── pages/
└── services/
```

No todos los módulos necesitan obligatoriamente todas las carpetas.

---

## Components

Contiene componentes visuales reutilizables pertenecientes al módulo.

Ejemplo:

```text
components/
├── FreelancerCard.tsx
├── FreelancerFilters.tsx
└── FreelancerHeader.tsx
```

---

## Hooks

Contiene lógica reutilizable, estados y coordinación entre servicios y componentes.

Los hooks deben iniciar con:

```text
use
```

Ejemplo:

```text
useFreelancers
useMessages
useContractRequests
useApplications
```

---

## Models

Contiene interfaces, tipos y modelos de TypeScript utilizados por el módulo.

Ejemplo:

```text
models/
├── freelancer.ts
├── vacancy.ts
└── application.ts
```

---

## Pages

Contiene las vistas principales asociadas a rutas.

Ejemplo:

```text
pages/
├── FreelancersPage.tsx
└── FreelancerDetailPage.tsx
```

---

## Services

Contiene funciones responsables de comunicarse con el backend.

Ejemplo:

```text
services/
├── freelancerService.ts
└── vacancyService.ts
```

Los componentes no deben contener lógica HTTP compleja cuando esta pueda mantenerse dentro de un servicio.

---

# Contextos globales

Los estados que deben estar disponibles en varias partes de la aplicación se administran mediante contextos.

Entre ellos se encuentran funciones relacionadas con:

- Autenticación.
- Usuario actual.
- Sesión.
- Login mediante modal.
- Redirecciones después de autenticación.

---

# Rutas

La configuración principal se encuentra en:

```text
src/routes/
```

WorkLink diferencia entre:

- Rutas públicas.
- Rutas privadas.
- Rutas administrativas.
- Rutas accesibles con o sin sesión.

---

# Rutas públicas

Entre las principales rutas públicas se encuentran:

```text
/
```

```text
/freelancers
```

```text
/freelancers/:profileId
```

```text
/vacantes
```

```text
/vacantes/:vacancyId
```

Estas rutas pueden utilizarse para explorar información sin necesidad de iniciar sesión.

---

# Rutas de autenticación

```text
/login
```

```text
/register
```

```text
/verify-2fa
```

```text
/forgot-password
```

```text
/reset-password
```

---

# Dashboard

El dashboard principal utiliza:

```text
/dashboard
```

Entre sus rutas se encuentran:

```text
/dashboard/perfil
```

```text
/dashboard/servicios
```

```text
/dashboard/portafolio
```

```text
/dashboard/disponibilidad
```

```text
/dashboard/vacantes
```

```text
/dashboard/postulaciones
```

```text
/dashboard/solicitudes
```

```text
/dashboard/contratos
```

```text
/dashboard/mensajes
```

```text
/dashboard/notificaciones
```

```text
/dashboard/resenas
```

El acceso a cada sección depende del rol del usuario.

---

# Rutas administrativas

El panel administrativo utiliza:

```text
/admin
```

Entre sus principales rutas se encuentran:

```text
/admin/usuarios
```

```text
/admin/empresas
```

```text
/admin/freelancers
```

```text
/admin/vacantes
```

```text
/admin/servicios
```

```text
/admin/solicitudes
```

```text
/admin/chats
```

```text
/admin/resenas
```

```text
/admin/reportes
```

```text
/admin/configuracion
```

Estas rutas están restringidas al rol:

```text
admin
```

---

# Protección de rutas

WorkLink cuenta con componentes para controlar el acceso según autenticación y rol.

Entre ellos se utilizan:

```text
PrivateRoute
PublicRoute
```

Las rutas privadas pueden recibir roles permitidos.

Ejemplo conceptual:

```tsx
<PrivateRoute
  allowedRoles={[
    "freelancer",
    "empresa",
  ]}
>
  <Componente />
</PrivateRoute>
```

Esto evita que un usuario acceda mediante URL a módulos que no corresponden a su tipo de cuenta.

---

# Mensajería

WorkLink incluye un sistema de comunicación entre usuarios.

Entre los principales flujos se encuentran:

```text
Cliente → Freelancer
```

```text
Freelancer → Empresa
```

```text
Empresa → Freelancer
```

La aplicación permite abrir directamente una conversación utilizando el identificador del usuario destinatario.

Ejemplo:

```text
/dashboard/mensajes?user=25
```

El módulo de mensajes permite:

- Consultar conversaciones.
- Abrir conversaciones.
- Enviar mensajes.
- Cargar mensajes anteriores.
- Controlar estados de carga.
- Gestionar mensajes no leídos.
- Acceder directamente a una conversación desde otros módulos.

---

# Vacantes y postulaciones

Las empresas pueden publicar vacantes y los freelancers pueden postularse.

Flujo general:

```text
Empresa
   ↓
Publica vacante
   ↓
Freelancer
   ↓
Consulta vacante
   ↓
Envía postulación
   ↓
Empresa revisa candidato
   ↓
Acepta o rechaza
```

El sistema también permite establecer comunicación entre empresa y freelancer durante el proceso.

---

# Solicitudes y contratos

WorkLink cuenta con módulos separados para:

```text
Solicitudes de contratación
```

y:

```text
Contratos
```

Estos módulos permiten dar seguimiento al proceso de contratación entre los diferentes usuarios de la plataforma.

---

# Notificaciones

El sistema incluye un módulo de notificaciones para informar al usuario sobre eventos importantes.

El frontend permite:

- Consultar notificaciones.
- Visualizar estados de lectura.
- Navegar hacia módulos relacionados.
- Mostrar indicadores dentro de la interfaz.

---

# Reseñas

Los usuarios pueden consultar reseñas y calificaciones asociadas a perfiles y procesos concluidos.

El sistema utiliza las reseñas para ayudar a construir la reputación de los usuarios dentro de WorkLink.

---

# Chatbot

WorkLink incluye un chatbot integrado en la interfaz.

El chatbot puede funcionar para:

- Visitantes.
- Usuarios autenticados.

El contenido generado puede visualizarse utilizando Markdown.

El widget se mantiene disponible desde diferentes secciones de la plataforma.

---

# Responsive Design

La interfaz está diseñada para adaptarse a diferentes tamaños de pantalla.

Debe funcionar correctamente en:

- Teléfonos.
- Tablets.
- Laptops.
- Monitores de escritorio.

Tailwind permite administrar breakpoints mediante:

```text
sm:
md:
lg:
xl:
```

Ejemplo:

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  ...
</div>
```

---

# Convenciones

## Código

- Variables en inglés.
- Funciones en inglés.
- Interfaces y tipos en inglés.
- Componentes en PascalCase.
- Hooks con prefijo `use`.
- Comentarios preferentemente en español.
- Textos visibles para el usuario en español.

---

## Componentes

Los componentes deben mantenerse enfocados en presentación e interacción.

La lógica compleja debe moverse, cuando corresponda, a:

```text
hooks/
```

o:

```text
services/
```

---

## Servicios

Las llamadas HTTP deben mantenerse principalmente dentro de:

```text
services/
```

Esto ayuda a evitar duplicación de código.

---

## Tipos

Los modelos e interfaces de las respuestas de la API deben mantenerse sincronizados con el backend.

Se recomienda evitar:

```ts
any
```

cuando pueda definirse un tipo específico.

---

## Estilos

- Utilizar Tailwind principalmente en JSX/TSX.
- Preferir tokens globales.
- Evitar hardcodear colores cuando exista un token.
- Mantener compatibilidad con modo oscuro.
- Mantener diseños responsive.
- Reutilizar patrones existentes antes de crear estilos nuevos.

---

## Iconos

- Preferir Heroicons.
- Utilizar React Icons cuando se necesiten iconos adicionales o de marca.
- Evitar emojis como elementos de interfaz.
- Mantener tamaños y estilos consistentes.

---

# Recomendaciones para contribuir

Antes de realizar un commit se recomienda ejecutar:

```bash
npm run lint
```

y:

```bash
npm run build
```

Esto permite detectar:

- Errores de TypeScript.
- Imports incorrectos.
- Problemas de compilación.
- Problemas detectados por ESLint.

---

# Despliegue

El frontend está preparado para funcionar como una SPA desplegada de manera independiente del backend.

Actualmente se utiliza:

```text
React
   ↓
Vite Build
   ↓
Vercel
   ↓
HTTPS
   ↓
Laravel API
```

La URL del backend debe configurarse mediante:

```env
VITE_API_URL=
```

---

# Buenas prácticas

- Mantener los módulos separados por funcionalidad.
- Mantener componentes pequeños cuando sea posible.
- Evitar duplicar lógica entre páginas.
- Utilizar hooks para lógica reutilizable.
- Utilizar services para consumo de API.
- Mantener los tipos sincronizados con Laravel.
- Proteger correctamente las rutas.
- Verificar el rol antes de mostrar acciones sensibles.
- Utilizar tokens globales.
- Mantener soporte para tema oscuro.
- Mantener interfaces responsive.
- No almacenar secretos en el frontend.
- Ejecutar lint y build antes de desplegar.
- Actualizar este README cuando cambie la arquitectura global.

---

# WorkLink

**Conectando talento con oportunidades.**