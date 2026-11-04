# GuppyLog

App móvil para acuaristas: registra tus acuarios, cambios de agua y parámetros, recibe recordatorios y consulta un compendio de peces y enfermedades. Hecha con React Native y Expo. Todos los datos se guardan en el teléfono.

## Funciones

- Varios acuarios con nombre, volumen, tipo, fecha de inicio y foto.
- Registro de cambios de agua (porcentaje o litros, acondicionador, notas).
- Registro de parámetros (temperatura, pH, amoníaco, nitritos, nitratos, GH, KH y salinidad en marinos), con aviso cuando un valor sale del rango ideal para el tipo de acuario.
- Recordatorios repetidos con notificaciones locales. Registrar un cambio de agua o un test reinicia el recordatorio correspondiente.
- Compendio: 24 peces comunes de agua dulce y 12 enfermedades con descripción, síntomas, causa, tratamiento y prevención. Agua salada: próximamente.
- Ajustes: modo oscuro, 4 colores de acento, español o inglés, °C/°F, litros/galones, y respaldo para exportar e importar los datos.

## Probar la app

Requisitos: Node 20 o superior y la app **Expo Go** en tu teléfono (App Store o Google Play).

```bash
npm install
npx expo start
```

Escanea el código QR con la cámara (iPhone) o con Expo Go (Android). El teléfono y la computadora deben estar en la misma red Wi‑Fi; si no, usa `npx expo start --tunnel`.

## Comandos útiles

```bash
npm run typecheck   # revisa los tipos de TypeScript
npm run lint        # revisa el estilo del código
npx expo-doctor     # revisa la configuración y versiones de Expo
```

## Estructura

```
src/
  app/            pantallas (Expo Router: cada archivo es una ruta)
    (tabs)/       Acuarios, Recordatorios, Compendio, Ajustes
    aquarium/     formulario, detalle, cambio de agua, parámetros, recordatorio
    library/      fichas de peces y enfermedades
  components/     componentes de interfaz reutilizables
  data/           contenido del compendio (peces y enfermedades, en español e inglés)
  lib/            base de datos SQLite, tema, idioma, parámetros, recordatorios
```

## Publicar

Las versiones para tiendas se generan con EAS (`npx eas-cli@latest build`). Antes de publicar faltan el ícono, la pantalla de inicio definitiva y las fotos del compendio.
