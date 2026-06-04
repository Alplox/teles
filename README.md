# ¿Qué es teles?

**teles** es una aplicación web gratuita y de código abierto que te permite disfrutar de canales de televisión en vivo de forma rápida y sencilla. Ideal para acceder a noticias internacionales, deportes y entretenimiento desde cualquier dispositivo.

## Enlace teles

🔗 Enlace: <https://alplox.github.io/teles/>

## Tabla de contenido

- [¿Qué es teles?](#qué-es-teles)
- [Enlace teles](#enlace-teles)
- [Imágenes](#imágenes)
- [Características](#características)
- [Inicio rápido](#inicio-rápido)
- [Stack técnico](#stack-técnico)
- [Canales disponibles](#canales-disponibles-junto-a-su-origen)
- [Preguntas frecuentes](#preguntas-frecuentes)
- [Cómo contribuir](#cómo-contribuir)
- [Descargo de responsabilidad](#descargo-de-responsabilidad)
- [Estadísticas](#estadísticas)

## Imágenes

[![Visión cuadricula](/assets/img/previews/example-teles-grid-view-v0-32.webp)](/assets/img/previews/example-teles-grid-view-v0-32.webp)
[![Visión única](/assets/img/previews/example-teles-single-view-v0-32.webp)](/assets/img/previews/example-teles-single-view-v0-32.webp)
[![Visión libre](/assets/img/previews/example-teles-free-view-v0-32.webp)](/assets/img/previews/example-teles-free-view-v0-32.webp)
[![Temas](/assets/img/previews/example-teles-v0-32.webp)](/assets/img/previews/example-teles-v0-32.webp)
[![Personalizar](/assets/img/previews/example-teles-customization-v0-32.webp)](/assets/img/previews/example-teles-customization-v0-32.webp)
[![Canales](/assets/img/previews/example-teles-channels-v0-32.webp)](/assets/img/previews/example-teles-channels-v0-32.webp)
[![Ejemplo PWA](/assets/img/previews/example-teles-pwa.webp)](/assets/img/previews/example-teles-pwa.webp)

## Características

[↑ Volver arriba ↑](#tabla-de-contenido)

- 📺 **Canales de televisión en vivo** - Acceso a múltiples canales de noticias y otros en streaming
- 🌍 **Filtrado por país** - Visualiza canales por región geográfica
- 📂 **Importación de listas M3U** - Carga tus propias listas de canales en formato M3U
- 🎨 **Temas personalizables** - Elige entre tema claro, oscuro
- 📱 **PWA instalable** - Descarga "teles" como aplicación en tu dispositivo
- 🔍 **Búsqueda y filtrado** - Encuentra canales rápidamente por nombre, país o categorías (Noticias, Deportes, etc.)
- 💾 **Almacenamiento local** - Tus preferencias se guardan automáticamente en tu dispositivo
- 📡 **Múltiples reproductores** - Soporta VideoJS, OPlayer, Clappr y Shaka Player
- 🔒 **Código abierto** - Contribuye y/o verifica el código

## Inicio rápido

[↑ Volver arriba ↑](#tabla-de-contenido)

### 1. Acceder a la aplicación

Visita [teles](https://alplox.github.io/teles/) en tu navegador favorito. No necesitas crear una cuenta ni descargar nada.

### 2. (Opcional) Instalar como aplicación

- **Escritorio**: Click en el botón de instalación en la barra de direcciones del navegador
- **Móvil (iOS)**: Abre en Safari → Compartir → Agregar a pantalla de inicio
- **Móvil (Android)**: Abre en Chrome → Menú ⋮ → Instalar aplicación

### 3. Importar tus propios canales

1. Ve a **Personalizar** en la aplicación
2. Carga un archivo M3U con tus canales
3. Los canales se sincronizarán automáticamente

### 4. Personalizar tu experiencia

- Selecciona tu tema (claro, oscuro)
- Elige tu reproductor multimedia preferido para señales m3u8
- Filtra por nombre, país o categorías

## Stack técnico

[↑ Volver arriba ↑](#tabla-de-contenido)

- **Frontend**: JavaScript y CSS vanilla + Bootstrap 5
- **Reproductores**: VideoJS, OPlayer, Clappr, Shaka Player
- **Almacenamiento**: LocalStorage
- **PWA**: Service Worker para funcionalidad offline
- **Datos**: JSON dinámico desde [json-teles](https://github.com/Alplox/json-teles)

## Canales disponibles junto a su origen

[↑ Volver arriba ↑](#tabla-de-contenido)

Ver lista completa en el repositorio de datos: [json-teles](https://github.com/Alplox/json-teles)

## Preguntas frecuentes

[↑ Volver arriba ↑](#tabla-de-contenido)

**¿Por qué algunos canales no funcionan?**

- Los enlaces provienen de fuentes públicas. Si una fuente se cae, el canal no funcionará. Intenta con otra señal u otro reproductor.

**¿Funciona sin internet?**

- Sí, una vez instalada como PWA, puedes acceder a la interfaz sin conexión. Los canales requieren internet para cargarse y reproducirse.

**¿Cómo reporto un canal caído?**

- Abre un issue en [json-teles](https://github.com/Alplox/json-teles/issues) con el nombre del canal y reproductor que usaste.

**¿Puedo agregar mis propios canales?**

- Sí, importa un archivo M3U en la sección Personalizar. También puedes contribuir al repositorio [json-teles](https://github.com/Alplox/json-teles).

## Cómo contribuir

[↑ Volver arriba ↑](#tabla-de-contenido)

Toda contribución es bienvenida 😊

### Pasos para contribuir

1. **Fork el repositorio**

   ```bash
   git clone https://github.com/TU_USUARIO/teles.git
   cd teles
   ```

2. **Abre el proyecto localmente**
   - Abre `index.html` en tu navegador o usa un servidor local

3. **Haz tus cambios**
   - Mantén la estructura de archivos existente
   - Sigue el estilo de código del proyecto
   - Prueba en múltiples navegadores

4. **Envía un Pull Request**
   - Describe claramente qué cambios realizas
   - Incluye capturas si es un cambio visual

### Estructura del proyecto

```
├── index.html              # Archivo principal
├── assets/
│   ├── css/              # Estilos
│   ├── js/
│   │   ├── main.js       # Punto de entrada
│   │   ├── helpers/      # Funciones auxiliares
│   │   ├── utils/        # Utilidades
│   │   └── constants/    # Configuraciones
│   ├── img/              # Imágenes y previews
│   └── sounds/           # Archivos de audio
└── [Docs adicionales]
```

### Áreas donde puedes contribuir

- 🐛 **Reportar bugs** - Abre un issue detallando el problema
- ✨ **Nuevas características** - Sugiere ideas o implementalas
- 🌐 **Traducciones** - (TODO) Ayuda a traducir la interfaz
- 📝 **Documentación** - Mejora README y comentarios de código
- 🎨 **Diseño** - Propón mejoras visuales

## Descargo de responsabilidad

[↑ Volver arriba ↑](#tabla-de-contenido)

- "teles" es un proyecto de código abierto gratuito que permite gestionar canales de televisión de libre acceso por Internet.
- “teles” no decodifica transmisiones. Los enlaces que figuran en este proyecto son procesados desde diferentes sitios públicos con libre distribución/acceso.
- "teles" no posee ningún tipo de monetización, en consecuencia, no se lucra de ninguna forma o medio.
- El proyecto cuenta con reproductores multimedia, los que no corresponden a una retransmisión de los canales ni implica la decodificación de éstos.
- No se es propietario, ni responsable de ninguno de los contenidos emitidos por parte de cada canal.
- “teles” no ofrece canales de pago bajo ninguna modalidad.
- En este proyecto no se almacena ninguna transmisión.
- El proyecto tanto como sus mantenedores no asumen responsabilidad alguna respecto a los derechos de propiedad intelectual que se puedan ver infringidos por terceros o por cualquier usuario.
- El usuario por defecto tiene la capacidad de dirigirse al sitio oficial de cada transmisión en todo momento.
- Si posees los derechos de algún canal y deseas que sea retirado, [contáctanos](https://github.com/Alplox/json-teles/issues).

## Estadísticas

[↑ Volver arriba ↑](#tabla-de-contenido)

### Contribuidores

[![Contributors](https://contrib.rocks/image?repo=Alplox/teles)](https://github.com/Alplox/teles/graphs/contributors)

### Historial de Stars

<a href="https://www.star-history.com/?repos=Alplox%2Fteles&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=Alplox/teles&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=Alplox/teles&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=Alplox/teles&type=date&legend=top-left" />
 </picture>
</a>

---

**[Repositorio original (RIP)](https://github.com/Alplox/tele)** | **[MIT License](/LICENSE)** | **[Reconocimientos](/ACKNOWLEDGMENTS.md)**
