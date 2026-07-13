# Arquitectura del Proyecto (Frontend Médico)

Este documento define la estructura, reglas y buenas prácticas que rigen el desarrollo de este Medical CRM/SaaS. Todas las incorporaciones de nuevos módulos y funcionalidades deben seguir estrictamente estas especificaciones para garantizar un crecimiento ordenado y libre de regresiones.

---

## 1. Estructura de Directorios (Nuxt 4)

El proyecto adopta la estructura oficial de directorios propuesta por **Nuxt 4**, donde el código de la aplicación se concentra dentro del folder `app/` para separarlo del servidor de backend local (Nitro) y los tipos de TypeScript.

```text
├── app/                      # Código principal del cliente
│   ├── assets/               # Archivos estáticos, SCSS y CSS globales
│   ├── composables/          # Estado compartido y utilidades reactivas del cliente
│   ├── layouts/              # Plantillas de diseño de páginas (default, public)
│   ├── middleware/           # Interceptores globales y locales de enrutamiento
│   ├── pages/                # Controladores de vistas y enrutamiento basado en archivos
│   ├── app.vue               # Componente principal de entrada
│   └── error.vue             # Vista de manejo de errores global (404, 500)
├── server/                   # Backend de Nuxt (Nitro Server engine)
│   └── api/                  # Endpoints del servidor local Nuxt
│       ├── auth/             # Controladores de inicio y cierre de sesión
│       └── proxy/            # Pasarela proxy segura hacia el backend principal
├── types/                    # Declaraciones de tipos globales de TypeScript
├── nuxt.config.ts            # Configuración general de Nuxt, modulos y compilador
└── package.json              # Dependencias y scripts del proyecto
```

---

## 2. Autenticación y Control de Acceso (RBAC)

La sesión se almacena de forma segura en cookies encriptadas de servidor mediante `nuxt-auth-utils`.

### Protección de Rutas (Middleware Global)
El middleware en [auth.global.ts](file:///Ubuntu-24.04/home/alanmar/alan/medical-frontend/app/middleware/auth.global.ts) evalúa de manera automática las páginas bajo las siguientes reglas:
1. **Rutas Privadas:** Cualquier ruta que inicie con `/app` requiere que el usuario esté autenticado. De lo contrario, se le redirige a `/login`.
2. **Rutas de Invitado:** Rutas públicas como `/login` o `/register` redirigen automáticamente al panel `/app/dashboard` si la sesión ya está activa.
3. **Control de Permisos (RBAC):** Las páginas pueden declarar permisos obligatorios a través de los metadatos de Vue Router (`meta.permissions`). El middleware comprobará que el usuario cuente con los permisos necesarios utilizando el composable `useAuth()`. Si el usuario carece de acceso, es redirigido al dashboard.

*Ejemplo de configuración de permisos en una página:*
```vue
<script lang="ts" setup>
definePageMeta({
  permissions: ['patients:create', 'patients:write']
});
</script>
```

---

## 3. Consumo de API (Capa Proxy Segura B4F)

Para evitar exponer tokens de autenticación o la URL del backend de AdonisJS en el navegador del cliente, se implementa una pasarela proxy en el servidor local de Nitro.

### El Servidor Proxy
El endpoint catch-all [server/api/proxy/[...path].all.ts](file:///Ubuntu-24.04/home/alanmar/alan/medical-frontend/server/api/proxy/%5B...path%5D.all.ts) captura cualquier petición cliente dirigida a `/api/proxy/*`:
- Valida la sesión del usuario.
- Extrae el Bearer token cifrado en la cookie del servidor.
- Modifica la cabecera original e inyecta `Authorization: Bearer <token>`.
- Reenvía de forma transparente la petición al backend de AdonisJS (`http://localhost:3001/api/*`).

### Los Composables del Cliente
Para consumir los datos del backend, **nunca** uses `$fetch` o `useFetch` planos apuntando directamente al API de AdonisJS. En su lugar, usa el composable centralizado [useApi.ts](file:///Ubuntu-24.04/home/alanmar/alan/medical-frontend/app/composables/useApi.ts):

* **`fetchApi` (Imperativo):** Diseñado para eventos interactivos del usuario (clicks de botón, envíos de formularios, etc.).
* **`useFetchApi` (Reactivo):** Diseñado para cargas de datos iniciales en páginas con soporte de Server-Side Rendering (SSR).

*Ejemplo de carga reactiva:*
```vue
<script lang="ts" setup>
const { useFetchApi } = useApi();
const { data: patients, pending, error } = useFetchApi('/patients');
</script>
```

*Ejemplo de acción imperativa:*
```vue
<script lang="ts" setup>
const { fetchApi } = useApi();

async function savePatient(formData) {
  try {
    await fetchApi('/patients', {
      method: 'POST',
      body: formData
    });
  } catch (err) {
    // Manejo de errores
  }
}
</script>
```

---

## 4. Lineamientos de Diseño e UI (Quasar)

El apartado visual se rige estrictamente bajo las pautas del sistema de diseño corporativo definido en [quasar_variables.scss](file:///Ubuntu-24.04/home/alanmar/alan/medical-frontend/app/assets/css/quasar_variables.scss) y el archivo de estilos globales [main.scss](file:///Ubuntu-24.04/home/alanmar/alan/medical-frontend/app/assets/css/main.scss).

1. **Variables de Color obligatorias:**
   - **`primary` (#0f172a):** Slate oscuro corporativo. Usar en encabezados principales y secciones destacadas (como seguridad o layouts privados).
   - **`secondary` (#0284c7):** Azul médico. Utilizado para acciones principales (CTA), links activos y botones de guardado.
   - **`accent` (#0ea5e9):** Azul brillante. Empleado en tags secundarios, badges y micro-indicadores.
   - **`positive`, `negative`, `warning`, `info`:** Colores de estado semánticos estándar.

2. **Evitar Clases de Estilo Customizadas:**
   - No definas clases de CSS para márgenes, paddings, fondos estándar, flexbox, o alineación.
   - Utiliza las clases utilitarias integradas en Quasar:
     - Flex: `row`, `column`, `items-center`, `justify-between`, `q-gutter-md`.
     - Spacing: `q-pa-md`, `q-py-xl`, `q-mb-md`, `q-mr-sm`.
     - Shadows: `shadow-1` hasta `shadow-3`.
     - Bordes: `rounded-borders`.

---

## 5. Reglas para Incorporar Nuevos Módulos

Al crear un nuevo módulo (por ejemplo, `Pacientes` o `Citas`):

1. **Vistas/Páginas:**
   - Crea un folder dentro de `app/pages/app/` (ej. `app/pages/app/patients/index.vue`, `app/pages/app/patients/[id].vue`).
   - Define metadatos de permisos en la cabecera con `definePageMeta`.
2. **Tipado:**
   - Declara las interfaces del dominio (ej. `interface Patient`) dentro de archivos `.d.ts` bajo la carpeta `types/` (ej. `types/patients.d.ts`).
3. **Consumo de API:**
   - Implementa un composable específico para la lógica del módulo en `app/composables/` (ej. `usePatients.ts`).
   - Dentro de dicho composable, encapsula las llamadas al backend delegando a `useApi()`.
