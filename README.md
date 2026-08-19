# WorkLink Frontend

Aplicación web frontend de **WorkLink**, una plataforma diseñada para conectar freelancers, clientes y empresas dentro de un mismo entorno digital.

El sistema permite explorar perfiles profesionales, publicar y consultar vacantes, gestionar servicios, postulaciones, solicitudes de contratación, contratos, mensajería, notificaciones, reseñas y diferentes funciones según el rol del usuario.

El frontend está desarrollado con **React + TypeScript + Vite**, utilizando **Tailwind CSS v4** como sistema principal de estilos y consumiendo una API REST desarrollada de manera independiente.

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

## Roles del sistema

WorkLink maneja diferentes tipos de usuario, cada uno con funciones específicas:

- **Cliente**
  - Explorar freelancers.
  - Consultar servicios.
  - Enviar solicitudes de contratación.
  - Gestionar contratos.
  - Comunicarse mediante mensajería.
  - Consultar notificaciones.
  - Publicar reseñas cuando corresponda.

- **Freelancer**
  - Administrar su perfil profesional.
  - Publicar servicios.
  - Administrar portafolio.
  - Gestionar disponibilidad.
  - Consultar vacantes.
  - Enviar postulaciones.
  - Gestionar solicitudes y contratos.
  - Utilizar mensajería y notificaciones.
  - Consultar reseñas recibidas.

- **Empresa**
  - Administrar su perfil empresarial.
  - Publicar y administrar vacantes.
  - Consultar postulaciones recibidas.
  - Revisar perfiles de candidatos.
  - Comunicarse con freelancers.
  - Gestionar solicitudes y contratos.
  - Consultar notificaciones y reseñas.

- **Administrador**
  - Gestionar usuarios.
  - Gestionar freelancers y empresas.
  - Supervisar vacantes y servicios.
  - Consultar solicitudes.
  - Supervisar chats.
  - Administrar reseñas.
  - Consultar reportes.
  - Gestionar configuraciones administrativas.

## Funcionalidades principales

El frontend se encuentra dividido en módulos independientes para facilitar el mantenimiento y escalabilidad del proyecto.

Entre las principales funcionalidades se encuentran:

- Registro e inicio de sesión.
- Autenticación con JWT.
- Verificación en dos pasos.
- Recuperación y cambio de contraseña.
- Gestión de perfiles.
- Exploración pública de freelancers.
- Perfil público de freelancers.
- Gestión de servicios.
- Gestión de portafolio.
- Gestión de disponibilidad.
- Exploración pública de vacantes.
- Publicación y administración de vacantes.
- Postulaciones a vacantes.
- Gestión de postulaciones recibidas.
- Solicitudes de contratación.
- Gestión de contratos.
- Sistema de mensajería entre usuarios.
- Sistema de notificaciones.
- Sistema de reseñas y calificaciones.
- Chatbot integrado.
- Panel administrativo.
- Tema claro y oscuro.

## Scripts

- `npm run dev`: inicia el entorno de desarrollo con Vite.
- `npm run build`: ejecuta TypeScript y genera el build de producción.
- `npm run preview`: sirve localmente el build generado.
- `npm run lint`: valida el código utilizando ESLint.

## Instalación

Instala las dependencias del proyecto:

```bash
npm install
