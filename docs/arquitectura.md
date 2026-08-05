# Arquitectura de WishTracker

## Stack

WishTracker es una **SPA (Single Page Application)** construida con:

- **React 19** + **Vite 7** — frontend
- **Tailwind CSS 4** — estilos
- **Supabase** — backend como servicio (BaaS)

## ¿Qué es BaaS?

**BaaS (Backend as a Service)** es un modelo donde el backend completo es provisto por un tercero. En vez de escribir y mantener tu propio servidor, base de datos, sistema de autenticación y almacenamiento de archivos, delegás todo a una plataforma que ya lo tiene resuelto.

En el caso de WishTracker, **Supabase** provee:

| Servicio | Uso en el proyecto |
|----------|-------------------|
| **Autenticación** | Login/registro de usuarios con email y contraseña (`signInWithPassword`, `signUp`) |
| **Base de datos** | PostgreSQL para almacenar productos, con Row Level Security (RLS) por usuario |
| **Storage** | Almacenamiento de comprobantes de compra (PDF, imágenes) en buckets |
| **API REST** | El SDK `@supabase/supabase-js` expone los endpoints automáticamente |

## ¿Por qué no hay backend propio?

El proyecto **no tiene** servidor Node.js, Express, ni ninguna API REST propia. Todo se comunica directamente desde el navegador hacia la API de Supabase usando el SDK cliente.

Esto simplifica el desarrollo:
- No hay que mantener un servidor 24/7
- No hay que escribir controladores, rutas ni middleware
- La autenticación y autorización vienen listas
- La base de datos es PostgreSQL (no SQLite ni Firebase)

## Estructura

```
src/
├── components/     # Componentes React (Login, Sidebar, ComprasView, etc.)
├── context/        # AuthContext (sesión Supabase), ThemeContext (modo oscuro)
├── pages/          # Dashboard
├── utils/          # SweetAlert2, formatCurrency
└── supabase.js     # Cliente Supabase (URL + anon key)
```
