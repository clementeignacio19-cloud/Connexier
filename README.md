# Connexier PWA

Sincroniza Google Calendar y Outlook en una sola app instalable.

## Estructura
```
connexier/
├── index.html        ← App principal
├── manifest.json     ← Config PWA (nombre, iconos, colores)
├── sw.js             ← Service Worker (offline + caché)
├── css/
│   └── app.css       ← Estilos premium dark mode
├── js/
│   └── app.js        ← Lógica de la app
└── icons/
    ├── icon-192.png  ← Icono app
    └── icon-512.png  ← Icono splash
```

---

## Desplegar en Vercel (gratis, 5 minutos)

### Opción A — Sin código (recomendado)
1. Ve a https://vercel.com y crea cuenta gratis
2. Arrastra la carpeta `connexier/` al dashboard de Vercel
3. Vercel genera un link tipo `connexier.vercel.app` en segundos

### Opción B — Con GitHub
1. Sube la carpeta a un repositorio en github.com
2. En Vercel → "New Project" → importa el repositorio
3. Deploy automático en cada cambio

### Opción C — Vercel CLI
```bash
npm i -g vercel
cd connexier
vercel
```

---

## Instalar en el celular

### iPhone / Safari
1. Abre `connexier.vercel.app` en Safari
2. Toca el botón Compartir (cuadrado con flecha ↑)
3. Selecciona "Agregar a pantalla de inicio"
4. ¡Listo! Connexier aparece como app nativa

### Android / Chrome
1. Abre la URL en Chrome
2. Toca el banner "Instalar" que aparece automáticamente
3. O ve al menú ⋮ → "Agregar a pantalla de inicio"

---

## Próximos pasos (APIs reales)

Para sincronizar de verdad con Google y Outlook necesitas:

### Google Calendar API
1. Ir a https://console.cloud.google.com
2. Crear proyecto → habilitar "Google Calendar API"
3. Crear credenciales OAuth 2.0
4. Agregar en `js/app.js` las llamadas a la API

### Microsoft Graph API (Outlook)
1. Ir a https://portal.azure.com
2. Registrar una aplicación → permisos `Calendars.ReadWrite`
3. Obtener `client_id` y configurar redirect URI
4. Usar MSAL.js para autenticación

### Librería recomendada
- `googleapis` (npm) para Google
- `@microsoft/microsoft-graph-client` para Outlook

---

Hecho con ♥ por Clemente · Connexier v1.0
