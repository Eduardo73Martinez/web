# Componentes UI - Reglas de Comportamiento

## Stack Tecnológico
- **Framework**: React 18 con Vite
- **CSS**: Tailwind CSS v3 con variables CSS para theming
- **Componentes**: shadcn/ui y componentes de 21st.dev
- **Utilidades**: `class-variance-authority`, `tailwind-merge`, `clsx`, `lucide-react`

## Convenciones de Componentes

### Estructura de Archivos
- Los componentes UI se ubican en `src/components/ui/`
- Los componentes de negocio se ubican en `src/components/`
- Utilidades compartidas van en `src/lib/`

### Imports
- Usa el alias `@/` para imports relativos a `src/`
- Importa la función `cn` de `@/lib/utils` para fusionar clases CSS
- Ejemplo: `import { cn } from "@/lib/utils"`

### Patrones de Componentes
- Usa `class-variance-authority` (cva) para variantes de componentes
- Aplica `React.forwardRef` en componentes reutilizables
- Define `displayName` en componentes con forwardRef
- Usa `@radix-ui/react-slot` para componentes que necesitan `asChild`

### Estilos
- Usa las variables CSS definidas en `src/index.css` para colores
- Colores disponibles: `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `popover`, `card`, `border`, `input`, `ring`
- Aplica los directives de Tailwind: `@tailwind base`, `@tailwind components`, `@tailwind utilities`
- Soporta modo claro y oscuro con la clase `.dark`

## Instalación de Componentes

### Preferencia Principal: 21st.dev
- Cuando el usuario solicite un componente UI o layout, **busca primero** en las librerías de 21st.dev
- Usa el comando oficial CLI para agregar componentes directamente al repositorio:
  ```bash
  npx @21st-dev/cli add <scope/component-name>
  ```
- Ejecuta el comando desde el directorio `frontend/`
- Visita [21st.dev](https://21st.dev) para explorar componentes disponibles

### shadcn/ui (Fallback)
- Configura los componentes con `components.json` en la raíz del frontend
- Para agregar un nuevo componente: `npx shadcn@latest add <nombre-componente>`
- Ejecuta el comando desde el directorio `frontend/`
- Usa como alternativa si el componente no está disponible en 21st.dev

## Reglas de Codificación
- No modifiques `components.json` manualmente salvo para cambios de configuración
- Mantén la función `cn` en `src/lib/utils.jsx` sin modificar
- Al crear nuevos componentes, sigue el patrón existente en `src/components/ui/Button.jsx`
- Usa Tailwind CSS para estilos, evita CSS en línea o archivos CSS separados cuando sea posible
