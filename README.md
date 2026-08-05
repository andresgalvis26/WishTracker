# WishTracker

Aplicación para gestionar tu lista de compras y deseos. Construida con React + Vite y Supabase como backend.

## Stack

- **Frontend**: React 19, Vite 7, Tailwind CSS 4
- **Backend**: Supabase (autenticación, base de datos PostgreSQL, almacenamiento de archivos)
- **PWA**: Service worker personalizado para funcionamiento offline

## Requisitos

- Node.js 18+
- Cuenta gratuita en [Supabase](https://supabase.com)

## Configuración

1. Clona el repositorio
   ```bash
   git clone <repo-url>
   cd WishTracker
   ```

2. Instala dependencias
   ```bash
   npm install
   ```

3. Configura las credenciales de Supabase en `src/supebase.js`:
   - `supabaseUrl`: URL de tu proyecto Supabase
   - `supabaseKey`: clave anónima (anon key) de tu proyecto

4. Inicia el servidor de desarrollo
   ```bash
   npm run dev
   ```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build de producción |
| `npm run generate-icons` | Genera los iconos PWA |

## Supabase Keep-Alive

Supabase pausa los proyectos del tier gratuito después de ~7 días de inactividad. Para evitarlo, este repositorio incluye un **GitHub Actions workflow** (`.github/workflows/supabase-keepalive.yml`) que hace una petición automática cada 5 días, manteniendo el proyecto activo sin costo.

### Configuración del secreto

Para que el workflow funcione, debes agregar un secreto en tu repositorio de GitHub:

1. Ve a **Settings → Secrets and variables → Actions → New repository secret**
2. **Name**: `SUPABASE_ANON_KEY`
3. **Secret**: la clave anónima de tu proyecto Supabase
