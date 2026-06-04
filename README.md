# Barracuda Front

Aplicacion frontend administrativa para restaurante, construida con React + TypeScript + Vite, usando Tailwind CSS v4 como sistema principal de estilos.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS v4
- Lucide React
- SweetAlert2

## Scripts

- `npm run dev`: inicia entorno de desarrollo.
- `npm run build`: genera build de produccion.
- `npm run preview`: sirve build local.
- `npm run lint`: valida reglas de ESLint.

## Enfoque de Estilos (Tailwind-first)

Este proyecto sigue un enfoque **Tailwind-first**:

- La UI se compone principalmente con clases de Tailwind en JSX.
- `src/style/index.css` se usa para definir **tokens globales** (variables de tema), no para reemplazar Tailwind con clases de componentes.
- Los componentes deben consumir tokens via utilidades Tailwind como:
  - `bg-primary`
  - `text-text`
  - `text-text-muted`
  - `border-border`
  - `bg-surface`

## Variables Globales CSS

Las variables globales viven en `src/style/index.css` dentro de `@theme`.

### Grupos de tokens

- Colores de marca: `--color-primary`, `--color-secondary`
- Colores de estado: `--color-success`, `--color-warning`, `--color-danger`, `--color-info`
- Escala neutral: `--color-background`, `--color-surface`, `--color-border`, `--color-muted`
- Tipografia: `--font-sans`, `--font-mono`
- Radios, sombras, espaciado y escala de texto

### Como extender tokens

1. Agrega el token en `@theme` de `src/style/index.css`.
2. Usa la utilidad Tailwind asociada directamente en JSX.
3. Evita hardcodear colores (`bg-gray-*`, `text-blue-*`, etc.) cuando exista token global equivalente.

## Estructura del Proyecto


## Convenciones

- Variables, funciones y tipos: en ingles.
- Comentarios: en espanol.
- Estilos de componentes: Tailwind en JSX.
- Tokens globales: definidos en `index.css`.

## Rutas Actuales


## Recomendaciones de Escalado

- Mantener consistencia visual agregando tokens antes de usar nuevos colores.
- Reutilizar patrones de Tailwind por modulo antes de crear abstracciones innecesarias.
- Documentar en este README cada nueva convencion global.
