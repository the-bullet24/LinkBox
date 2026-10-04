# LinkBox — MVP visual v0.1

Bloc de notas visual para guardar enlaces (Instagram, YouTube, TikTok, Chrome…).
Prototipo para validar la idea y el flujo. **Sin base de datos ni backend**: los datos viven solo en memoria y vuelven a los de demostración al cerrar la app.

Stack: React Native · Expo (SDK 57) · TypeScript · Expo Router.

## Correr el prototipo

```bash
npm install
npx expo start
```

Escanea el QR con **Expo Go** en tu Android. Todo funciona excepto recibir enlaces desde el menú Compartir (ver abajo).

## Qué incluye

- Carpetas: ver, crear, abrir, renombrar y eliminar (⋮ o mantener presionado).
- Enlaces: agregar manualmente, ver como tarjeta, abrir en el navegador, eliminar (⋮ o mantener presionado).
- Máximo 30 enlaces por carpeta, contador `X/30` y mensaje al llegar al límite.
- Plataforma detectada por dominio (Instagram, YouTube, TikTok, Facebook, X, Web).
- Miniatura placeholder (sin scraping ni APIs). Para una real, basta con llenar `link.thumbnail` (ya lo soporta `LinkThumbnail`).
- Pantalla "Guardar enlace" y pantalla de Configuración.

## Share Intent (menú Compartir de Android)

Recibir enlaces desde otras apps necesita código nativo, así que **no funciona en Expo Go**. Está preparado con [`expo-share-intent`](https://github.com/achorein/expo-share-intent):

- `app.json` ya tiene el plugin y el intent filter `text/*`.
- `app/_layout.tsx` envuelve la app en `ShareIntentProvider` (en Expo Go no rompe nada, solo no recibe).
- `app/index.tsx` detecta el enlace compartido y abre `app/save/index.tsx`.

Para probarlo de verdad necesitas un build Android:

```bash
# Opción A: build de desarrollo local (requiere Android Studio / SDK)
npx expo prebuild --platform android
npx expo run:android

# Opción B: EAS (en la nube)
npx eas build --profile development --platform android
```

Luego, en Instagram/YouTube/Chrome → Compartir → **LinkBox**.

Mientras tanto, en **Configuración → "Simular enlace compartido"** abre exactamente la misma pantalla "Guardar enlace" para probar el flujo en Expo Go.

## Estructura

```text
app/                    rutas (Expo Router)
├── _layout.tsx
├── index.tsx           inicio: carpetas
├── folder/[id].tsx     vista de carpeta
├── save/index.tsx      guardar enlace (Compartir)
└── settings/index.tsx
src/
├── components/         FolderCard, LinkCard, modales, botones
├── data/mockData.ts    datos de demostración
├── store/              estado en memoria (Context API)
├── types/index.ts
└── utils/              platform.ts, url.ts
```

## Fuera de alcance (a propósito)

Persistencia, backend, login, búsqueda, etiquetas, scraping de miniaturas, iconos/colores por carpeta, etc.
