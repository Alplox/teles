# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

Formato basado en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [v0.25]

### Added

- Implementa Shaka Player.
- Nueva opción en el panel de Personalizar para mostrar logotipos de canales en los botones de selección.
- Estilos CSS para la visualización de logos en botones (con soporte para fallos de carga).

### Fixed

- Añadido efecto de desenfoque a las áreas de *letterboxing* (espacios vacíos arriba/abajo) de Shaka Player para una integración visual fluida con el fondo del sitio.

## [v0.24]

### Changed

- Optimiza la carga inicial con renderizado diferido y scripts diferidos

### Fixed

- Se elimina el flash of light theme (FOUC)

## [v0.23]

### Changed

- Remueven la mayor parte de enlaces a sitios externos. #25
- Añade seccion "Características" a README

### Fixed

- Vision unica pierde icono sin señal #22
- .modal-content tiene gap en navegadores chromium #23 (Gap solo se presentaba en Edge)
- Lógica botón compartir configuración actual #24

## [v0.22]

### Refactored

- Traducido `main.js` a inglés: renombra exportaciones (p.ej. `getDefaultChannels`, `loadDefaultChannels`, contenedores de vista), limpia nombres locales, traduce comentarios, añade JSDoc y corrige variables no definidas al cargar listas personalizadas.
- Renombradas funciones de listas personalizadas (`clearChannelListContainers`, `renderPersonalizedListsUI`, `resyncActiveChannelsVisualState`, etc.) para mantener consistencia en inglés y se añadieron descripciones JSDoc.
- Traducido `helperActualizarBotonesFlotantes.js` a Inglés -> `floatingButtonsPosition.js`: renombra funciones (`alternarPosicionBotonesFlotantes` -> `toggleFloatingButtonsPosition`, `clicBotonPosicionBotonesFlotantes` -> `handleFloatingButtonsPositionClick`, `esBotonReposicionar` -> `isRepositionButton`, `actualizarBotonesFlotantes` -> `updateFloatingButtons`), variables, y comentarios. Agrega documentación JSDoc y optimiza el código con constantes congeladas y uso del operador spread.
- Traducido `helperVisionUnica.js` a Inglés -> `singleViewMode.js`: renombra funciones (`activarVisionUnica` -> `activateSingleView`, `desactivarVisionUnica` -> `deactivateSingleView`), variables, y comentarios. Extrae funciones de apoyo reutilizables (`disableGridViewControls`, `enableGridViewControls`, `updateFloatingButtonsForViewMode`, `updateNavigationForViewMode`, `backupActiveChannels`, `restoreBackedUpChannels`, `resetChannelButtonStyles`, `loadFirstSavedChannel`) para una mejor modularidad. Agrega documentación JSDoc completa.
- Traducido `helperSincronizarFiltros.js` a Inglés -> `syncFilters.js`: renombra funciones (`sincronizarCategoriasConPais` -> `syncCategoriesWithCountry`, `sincronizarPaisesConCategoria` -> `syncCountriesWithCategory`), variables (`MENSAJE_NO_DISPONIBLE` -> `UNAVAILABLE_MESSAGE`, `SELECTORES_MENU` -> `MENU_SELECTORS`, etc.), y comentarios. Convierte funciones a estilo de flecha para consistencia. Agrega documentación JSDoc.
- Traducido `helperGenerarBotonesCanales.js` a Inglés -> `channelButtonsGenerator.js`: renombra funciones (`crearBotonesParaCanales` -> `createChannelButtons`, `crearBotonesParaModalCambiarCanal` -> `createButtonsForChangeChannelModal`, `crearBotonesParaVisionUnica` -> `createButtonsForSingleView`), variables, y comentarios. Convierte funciones a estilo de flecha. Agrega documentación JSDoc.
- Traducido `helperAjustarClasesCanalesActivos.js` a Inglés -> `adjustActiveChannelClasses.js`: renombra funciones (`ajustarNumeroDivisionesClaseCol` -> `adjustBootstrapColumnClasses`, `ajustarClaseColTransmisionesPorFila` -> `updateGridColumnConfiguration`), variables, y comentarios. Convierte funciones a estilo de flecha y optimiza la lógica. Agrega documentación JSDoc.
- Traducido `helperCambioOrdenBotones.js` a Inglés -> `channelButtonSorter.js`: renombra funciones (`guardarOrdenOriginal` -> `saveOriginalOrder`, `ordenarBotonesCanalesAscendente` -> `sortChannelButtonsAscending`, `ordenarBotonesCanalesDescendente` -> `sortChannelButtonsDescending`, `restaurarOrdenOriginalBotonesCanales` -> `restoreOriginalChannelButtonsOrder`), variables, y comentarios. Agrega documentación JSDoc.
- Traducido `helperRelacionesFiltros.js` a Inglés -> `filterRelations.js`: renombra funciones (`construirRelaciones` -> `buildRelations`, `obtenerCategoriasPermitidasPorPais` -> `getAllowedCategoriesByCountry`, `obtenerPaisesPermitidosPorCategoria` -> `getAllowedCountriesByCategory`), variables, y comentarios. Agrega documentación JSDoc.
- Traducido `helperFiltroCanales.js` a Inglés -> `channelFilteringHelper.js`: renombra funciones (`filtrarCanalesPorInput` -> `filterChannelsByInput`, `normalizarInput` -> `normalizeInput`, `alertaNoCoincidencias` -> `toggleNoMatchesAlert`), variables, y comentarios. Agrega documentación JSDoc.
- Traducido `helperCrearBotonesPaises.js` a Inglés -> `countryButtonCreator.js`: renombra funciones (`crearBotonesPaises` -> `createCountryButtons`), variables, y comentarios. Agrega documentación JSDoc.
- Traducido `helperOrdenGridVisionUnica.js` a Inglés -> `singleViewGridOrder.js`: renombra funciones (`cargarOrdenVisionUnica` -> `loadSingleViewOrder`, `guardarOrdenPanelesVisionUnica` -> `saveSingleViewPanelsOrder`, `toggleClaseOrdenado` -> `toggleOrderedClass`), variables, y comentarios. Agrega documentación JSDoc.
- Traducido `helperCrearBotonesCategorias.js` a Inglés -> `categoryButtonCreator.js`: renombra funciones (`crearBotonesCategorias` -> `createCategoryButtons`), variables, y comentarios. Agrega documentación JSDoc.
- Traducido `helperOcultarTextoBotonesOverlay.js` a Inglés -> `overlayButtonTextHider.js`: renombra funciones (`hideTextoBotonesOverlay` -> `hideOverlayButtonText`). Agrega documentación JSDoc.
- Traducido `canalesData.js` a Inglés -> `channelManager.js`: renombra funciones (`fetchCargarCanales` -> `fetchLoadChannels`, `guardarBackupCanales` -> `saveChannelBackup`, etc.), variables, y comentarios. Agrega documentación JSDoc.
- Traducido `helperClaseBoton.js` a Inglés -> `buttonClassHelper.js`: renombra funciones (`ajustarClaseBotonCanal` -> `adjustChannelButtonClass`), variables, y comentarios. Agrega documentación JSDoc.
- Traducido `helperGuardarCanales.js` a Inglés -> `channelStorageHelper.js`: renombra funciones (`guardarCanalesEnLocalStorage` -> `saveChannelsToLocalStorage`), variables, y comentarios. Agrega documentación JSDoc.
- Traducido `limpiarRecursosTransmision.js` a Inglés -> `cleanTransmissionResources.js`: renombra funciones (`limpiarRecursosTransmision` -> `cleanTransmissionResources`), variables, y comentarios. Agrega documentación JSDoc.
- Traducido `obtenerCanalesDesdeUrl.js` a Inglés -> `urlChannelParams.js`: renombra funciones (`limpiarParametroCompartidoEnUrl` -> `clearSharedUrlParameter`, `sincronizarParametroCanalesActivos` -> `syncActiveChannelsParameter`, `registrarCambioManualCanales` -> `registerManualChannelChange`, `obtenerCanalesDesdeUrl` -> `getChannelsFromUrl`), variables, y comentarios. Agrega documentación JSDoc.
- Traducido `helperM3U.js` a Inglés -> `m3uHelper.js`: renombra funciones (`validarTextoM3U` -> `validateM3UContent`, `M3U_A_JSON` -> `m3uToJson`), variables, y comentarios. Agrega documentación JSDoc.

### Added

- Audio para alertas de tipo "warning".
- Audio para música ambiente cuando no hay canales activos. Weather Forecast Type Beat by YellowTree -- https://freesound.org/s/693384/ -- License: Attribution 4.0

### Changed

- Estandarizada la persistencia de los botones del overlay usando claves LS_KEY dedicadas.
- Filtros ahora son colapsables y barra de busqueda es visible en todo momento. #17 - https://github.com/Alplox/teles/issues/17
- Ordenar botones canales ahora no realiza manipulacion en el DOM para evitar problemas de rendimiento.

### Removed

- revisarConexion() ya no se muestra alerta si se pierde conexion a internet. (Comportamiento no era el deseado)

### Fixed

- Visibilidad de navbar no retoma estado tras recargar. #18 - https://github.com/Alplox/teles/issues/18
- Overflow señales en modo visión única #20 - https://github.com/Alplox/teles/issues/20

## [v0.21]

### Added

- Incorpora soporte para listas .m3u mediante su URL.
- Campo para pegar listas .m3u manualmente cuando no se puede acceder/cargar su versión URL.
- Posibilidad de compartir enlaces que incluyen la selección actual de canales activos mediante el parámetro `c` en la URL. (No testeado a la hora de publicación)
- Contenedores de botones de canales agrupados por origen. Son secciones colapsables en el modal y el offcanvas de selección de canales, para facilitar la navegación.
- Filtro por categoría de canal en modal, offcanvas, visión única y modal "Cambiar canal", combinable con país y texto.

### Changed

- La restauración de listas personalizadas fijadas ahora recompone los botones y el listado de canales tras recargar para preservar los canales añadidos por el usuario.
- Se redujo el peso del DOM de las listas de canales cargando bajo demanda las listas de "Visión única" y "Cambiar canal".
- Se migró el manejo de clics en botones de canales a delegación de eventos sobre los contenedores principales, reduciendo el número de listeners individuales.
- Se simplificó el cálculo de ancho en las barras de overlay y se eliminó el enfoque automático en inputs de filtro para reducir trabajo de layout en interacciones frecuentes.
- El filtro por país dejó de sobrescribir el texto del buscador y ahora se combina con la búsqueda por nombre y categoría.
- La interfaz de filtros por país y categoría en modal, offcanvas, visión única y "Cambiar canal" se compactó en dos filas de chips horizontales siempre visibles para mejorar la experiencia en móviles.
- Actualiza version bootstrap a v5.3.8
- Se extrajo una función reutilizable para limpiar instancias de reproductores (Video.js, Clappr, OPlayer e iframes) antes de eliminar un canal del DOM, evitando fugas de memoria.
- Se centralizó la configuración de escenarios de botones (grid, cambio y visión única) para respetar la selección múltiple/única incluso con canales agregados vía listas M3U personalizadas.

### Fixed

- Definidas referencias a controles de modo experimental y listas personalizadas para evitar `ReferenceError` al iniciar.
- Inicializada la preferencia de combinar listas personalizadas al cargar la interfaz para eliminar errores `ReferenceError` y mantener sincronizados switch, texto auxiliar y localStorage.
- La restauración automática vuelve a aplicar las listas personalizadas fijadas antes de recrear la interfaz para que los canales añadidos reaparezcan tras recargar.
- Eliminar listas personalizadas ya no falla cuando los canales asociados no están activos; la limpieza ignora transmisiones inexistentes.
- Los filtros de País y Categoría se sincronizan automáticamente, deshabilitando opciones incompatibles para evitar combinaciones sin resultados.
- El textarea de listas manuales impide pegar únicamente URLs o texto sin cabecera `#EXTM3U`, mostrando errores descriptivos antes de procesar la lista.
- Al quitar un canal se limpian los iframes embebidos antes de remover el DOM, evitando que queden peticiones HLS activas.

## [v0.20]

### Added

- Clappr y OPlayer como alternativas a VideoJS para señales m3u8.
- Opción para alternar entre uso de VideoJS, Clappr y OPlayer para señales m3u8.
- Debounce para hideTextoBotonesOverlay (resize global y slider de ancho).
- referrerPolicy = 'strict-origin-when-cross-origin' para señales yt_id, yt_embed y yt_playlist debido a Error 153 con Youtube.

### Changed

- Botón mover en vision única ahora permite mover con clic en cualquier parte de este (no solo icono).
- Mejorado helperBSTooltips para que no intente crear tooltips que ya existen.

## [v0.19]

### Changed

- Actualizaron los archivos README.md y NOTICE.md para mejorar la legibilidad y el formato de enlaces.
- Se pasan funciones a módulos para mejor organización.
- Aplican funciones de comprobación de existencia de elementos y métodos antes de operar sobre ellos en múltiples archivos JS para evitar errores en tiempo de ejecución.

### Added

- Agregaron comprobaciones de existencia de elementos y métodos antes de operar sobre ellos en múltiples archivos JS para evitar errores en tiempo de ejecución.
- Se mejoró la compatibilidad y robustez en la manipulación del DOM, eventos y almacenamiento local.

### Fixed

- Overflow de botones países en modales cambiar canal activo.
- Suspensión de señales m3u8 cargadas con VideoJS de forma correcta, de manera que no sigan en segundo plano tras eliminar elemento del DOM.

## [v0.18]

### Changed

- Refactorizado código JS.
- Combinan señales mismo canal en un solo botón.
- Imágenes previews

### Added

- Opción de modificar señal de canal activo, junto a guardar en almacenamiento local opción seleccionada para futuras cargas.
- Mayor número de comprobaciones para carga canales para evitar errores que dejen inutilizable sitio.
- Opción experimental carga canales IPTV desde <https://github.com/iptv-org/iptv> (por problemas de rendimiento deja como activado manual en offcanvas personalizaciones).
- Más canales, señales, logos a canales (opcional desde código).
- Opción alternar entre vista "cuadricula" y "única", junto a recordar opción seleccionada.
- Opción alternar uso 100% de la altura pantalla en vista "cuadricula"

## [v0.17]

### Changed

- filtroCanales reescrito para tomar en cuenta si se pulsa filtro por país de modo de que el input usuario sea dentro de dicho país activo.
- F_ordenBotones reescrito para abarcar modal dinámico de opción cambiar señal activa, guardando orden original de botones previo a ordenar de forma ascendente/descendente
- div contenedor canales activos utiliza ahora el 100vh
- Rediseño global
- Imágenes manifesto PWA y Preview repositorio (gracias a <https://shots.so/>, <https://pixlr.com/es/express/> y <https://progressier.com/pwa-screenshots-generator>)
- Estructura JS por módulos

### Added

- Botón instalar PWA usando <https://github.com/khmyznikov/pwa-install>
- Alerta ante perdida de conexión internet
- Ocultar texto botones overlay acorde a tamaño div general para evitar overflow en tamaños pequeños
- Botones para carga canales predeterminados
- Efecto de sonido a botones de carga canales predeterminados [CRT turn on notification por Coolshows101sound](https://freesound.org/people/Coolshows101sound/sounds/709461/)
- Iconos a botones de quitar todo canal activo, item navbar créditos y descargo de responsabilidad
- Habilidad de mover botones flotantes
- Habilidad ocultar individualmente botones de overlay canales
- Observer para casos donde solo existan 2 o 1 canal activo se ajuste tamaño columna acorde para abarcar todo el width

### Removed

- archivo js/json con canales (se creo <https://github.com/Alplox/json-teles> para hacer fetch, dejando como respaldo ultimo archivo que existió en repositorio)

### Fixed

- Opción de entrar a pantalla completa (bug <https://github.com/Alplox/teles/issues/1> de si se ingresa con icono ampliar desde algún navegador permanece, pero problema no es único a sitio por lo que se deja ya que globalmente (por lo que vi) no tiene solución) con tecla F11 funcionamiento acorde al esperado.

## [v0.16]

### Changed

- CSS: <a>:focus y <a>:hover
- manifesto PWA
- CSS: .barra-overlay debido a que no estaba bien centrado su contenido
- .barra-overlay se añade tabindex=0 para poder hacer focus con tecla TAB
- Texto: de "Desactivar" a "Quitar" en modal canales (para que sea igual a botón quitar que tienen las señales)
- Separados botones share de barra copiar enlace (para que modal muestre copiar enlace a personas con bloqueadores de publicidad)
- Reescrito archivo "NOTICE.md"
- Alerta tras borrado localStorage
- SVG's logos redes sociales por iconos Bootstrap
- Imágenes ejemplo sitio en README.md, index.html y site.webmanifest acorde a version nueva

#### 📺 Canales

Chile

- [Canal 13](https://www.13.cl/en-vivo)

### Added

- Icono a enlaces externos dentro de señal activa <iframe> para mejor comunicación de que al pulsar abandonará el sitio <i class="bi bi-box-arrow-up-right"></i>
- Sección agradecimientos contribuciones en "README.md"
- Capacidad de reordenar canales con plugin desde grid [SortableJS](https://github.com/SortableJS/Sortable)
- Icono para contribuciones en modal créditos y README.md con [contributors-img](https://github.com/lacolaco/contributors-img)
- Efectos de sonido para alerta de copiado enlace en modal compartir: [button-pressed por Pixabay](https://pixabay.com/sound-effects/button-pressed-38129/), [Cancel/miss chime por Raclure](https://freesound.org/people/Raclure/sounds/405548/)
- Efecto de sonido a botones de quitar todos los canales activos [TV, Shutdown.wav por MATRIXXX_](https://freesound.org/people/MATRIXXX_/sounds/523553/)
- Efecto sonido de fondo a alerta tras borrado localStorage [DefectLineTransformer por blaukreuz](https://freesound.org/people/blaukreuz/sounds/440128/)
- Efecto de sonido a botones de quitar canal [User Interface Clicks and Buttons 1 por original_sound](https://freesound.org/people/original_sound/sounds/493551/)
- Variación rancia <https://alienxproject.github.io/X/>
- "Variación" <https://navezjt.github.io/JCN-TV/>
- Enlace complementario Línea Prevención del Suicidio
- Efecto flicker para fondo tras borrado localStorage <https://codepen.io/frbarbre/pen/BaObOXL>
- Efecto flicker para texto tras borrado localStorage <https://codepen.io/patrickhlauke/pen/YaoBop>
- Tema oscuro/claro, fondos SVG temas generados con <https://wickedbackgrounds.com/app> transformados a css con <https://yoksel.github.io/url-encoder/>
- Opción cambiar/reemplazar canal desde grid
- Habilidad recordar selección de número de canales por fila con localStorage
- Alerta en caso de que búsqueda canales no arroje resultados
- Opción para reordenar botones canales de forma ascendente o descendente
- screenshots para PWA, hechas con Progressier <https://progressier.com>
- Librería isMobile <https://github.com/kaimallea/isMobile>

#### 📺 Canales

Chile

- [Meganoticias 3](https://www.meganoticias.cl/senal-en-vivo/meganoticias/) - [x](https://github.com/HERBERTM3/iptv/blob/f55200534fdab9a503f04b0482ce7307c2767469/hd.m3u)
- [Meganoticias 4](https://www.meganoticias.cl/senal-en-vivo/meganoticias/) - [x](https://github.com/HERBERTM3/iptv/blob/f55200534fdab9a503f04b0482ce7307c2767469/hd.m3u)
- [Canal 13](https://www.13.cl/en-vivo) - [x](https://github.com/HERBERTM3/iptv/blob/f55200534fdab9a503f04b0482ce7307c2767469/hd.m3u)
- [Canal 13 3](https://www.13.cl/en-vivo) - [x](https://github.com/HERBERTM3/iptv/blob/f55200534fdab9a503f04b0482ce7307c2767469/hd.m3u)
- [La Red 2](https://www.lared.cl/senal-online) - [x](https://github.com/HERBERTM3/iptv/blob/f55200534fdab9a503f04b0482ce7307c2767469/hd.m3u)

#### Radios 📻

Chile

- [Radio El Conquistador FM](https://www.elconquistadorfm.net/) - [x](https://github.com/Alplox/teles/pull/3)
- [Radio El Conquistador FM 2](https://www.elconquistadorfm.net/) - [x](https://github.com/Alplox/teles/pull/3)
- [Radio El Conquistador FM 3](https://www.twitch.tv/elconquistadortv)

### Removed

- Archivo bloquean.txt
- Archivo emergencia.html
- Archivo archivo.html
- SVG's logos redes sociales
- Imágenes ejemplo sitio v0.07

#### 📺 Canales

Chile

- [CHV 2](https://www.chilevision.cl/senal-online)

## [v0.15]

### Changed

- Enlace <https://ssd.eff.org/es/playlist/%C2%BFactivista-o-manifestante> por <https://ssd.eff.org/es/module/asistir-una-protesta> debido a error 404

#### 📺 Canales

- Enlace Radio Infinita
- Enlace Radio Carolina TV
- Enlace Radio Romántica TV
- Enlace Radio Radio Genial 100.5 FM
- Enlace Radio El Sembrador
- Enlace Radio Radio Ñuble
- Enlace Radio Alternativa FM
- Enlace canal M3U8 Stgo TV
- Enlace canal M3U8 La Voz De Los Que Sobran
- Enlace canal M3U8 Canal 21
- Enlace canal M3U8 Ñublevision
- Enlace canal M3U8 Ñuble RVT
- Enlace canal M3U8 Canal 33
- Enlace canal M3U8 Contivision
- Enlace canal M3U8 Osorno TV
- Enlace canal IFRAME TV Salud
- Enlace canal YT-ID Canal 26
- Enlace canal M3U8 Cámara de Diputados

### Added

- Icono a enlaces externos para mejor comunicación de que al pulsar abandonará el sitio <i class="bi bi-box-arrow-up-right"></i>

### Removed

- Modal Registros Manifestaciones desarrolladas en Chile
- Modal Denunciar violación DDHH
- Enlaces relacionados COVID-19 junto a "pacomap.live" de Modal Enlaces Complementario
- Sección Proyectos GitHub de Modal Enlaces Complementario
- Sitios:
    Capucha Informativa (no carga)
    ChileOkulto (borro contenido)
    En Punto (última actualización 2021)
    Megáfono Popular (no carga)
    Piensa Prensa (sitio redirige a publicidad)
    Primera Línea Revolucionaria Chile (última actualización 2022)
    Revista ChileLibre (no carga)
    Verdad Ahora (última actualización 2023)
    Radio 19 de abril Cobertura colectiva  (no carga)
    Radio Manque (no carga)
    RadioTV-Liberación (no carga)
- Información útil incendios (canal y modal)
- Enlace Variación por u/sebastianrw <https://whywelove.news/love/country/chile/envivo>

#### 📺 Canales

Chile

- [24 Horas 2](https://www.24horas.cl/envivo/) - [x](https://www.m3u.cl/iptv-chile.php)
- [24 Horas 3](https://www.24horas.cl/envivo/) - [x](https://www.m3u.cl/iptv-chile.php)
- [24 Horas s2](https://www.24horas.cl/envivo/) - [x](https://www.m3u.cl/iptv-chile.php)
- [24 Horas s2 2](https://www.24horas.cl/envivo/) - [x](https://www.m3u.cl/iptv-chile.php)
- [Mega](https://www.mega.cl/) - [x](https://github.com/AINMcl/MonitorTV/blob/05188eeaea9622e986b338f63a46fb189898184f/IPTV/AINM.m3u)
- [T13 3](https://www.t13.cl/)
- [Canal 13](https://www.youtube.com/channel/UCd4D3LfXC_9MY2zSv_3gMgw)
- [Canal 13 2](https://www.13.cl/en-vivo) - [x](https://github.com/AINMcl/AINMcl.github.io/blob/master/MonitorTV/Senal/WEB/Se%C3%B1alCANAL13_IFRAME.html)
- [CHV Noticias 2](https://www.chvnoticias.cl/) - [x](https://pluto.tv/es/live-tv/chilevision-noticias)
- [CHV 2](https://www.chilevision.cl/senal-online) - [x](https://chvv--hofece7009.repl.co/)
- [CHV 3](https://www.chilevision.cl/senal-online) - [x](https://github.com/AINMcl/MonitorTV/blob/05188eeaea9622e986b338f63a46fb189898184f/IPTV/AINM.m3u)
- [Prensa Presidencia](https://prensa.presidencia.cl/streaming.aspx)
- [DerechoFacil](https://www.twitch.tv/derechofacil)
- [Nicolas Copano](https://www.youtube.com/channel/UCVTL17ftpqx3lQ_IaGUNgSg)
- [Nicolas Copano 2](https://www.twitch.tv/copano)
- [ARABTV](https://www.arabtv.cl/)
- [ARABTV 2](https://www.arabtv.cl/) - [x](https://github.com/iptv-org/iptv/blob/master/streams/cl.m3u)
- [Arica TV](https://arica.tv/envivo/)
- [Estaciontv](https://www.estaciontv.cl/site/) - [x](https://www.chileiptv.cl/)
- [Estaciontv 2](https://www.estaciontv.cl/site/) - [x](https://www.m3u.cl/iptv-chile.php)
- [UCV TV 2](https://pucvmultimedios.cl/senal-online-tv.php) - [x](https://github.com/WJS1978/IPTV/blob/56dbbc76e3f1167966459f0d708b514bb792ae9c/iptv.m3u)
- [Contivision 2](http://w.contivision.cl/cvn/envivo.php) - [x](https://m3u.cl/lista-iptv-chile.php)
- [Teletón TV](https://teletontv.cl/)
- [Teletón TV 2](https://teletontv.cl/) - [x](https://www.chileiptv.cl/)
- [Cámara de Diputados 2](http://webtv.camara.cl/)
- [Cámara de Diputados 3](http://webtv.camara.cl/)
- [Convención Constitucional](https://www.convencion.tv/)
- [Convención Constitucional 2](https://www.convencion.tv/) - [x](https://www.m3u.cl/iptv-chile.php)
- [Convención Constitucional 3](https://www.youtube.com/channel/UCRlIWVAxQdAnCl4D4UR9r3Q)
- [Convención Constitucional YT 01](https://youtube.com/channel/UCc3koBbWMyvSyzRbG5eTgvQ)
- [Convención Constitucional YT 02](https://youtube.com/channel/UCKmKUwcjv6HJP7-z9Nnpp2w)
- [Convención Constitucional YT 03](https://youtube.com/channel/UCeIlCkkBplhU0SrWM9B7u7Q)
- [Convención Constitucional YT 04](https://youtube.com/channel/UCkMWMYCPUGzf3UPAxcIaVqA)
- [Convención Constitucional YT 05](https://youtube.com/channel/UChNeKfZ0-wwuOCyUSu6BlcA)
- [Convención Constitucional YT 06](https://youtube.com/channel/UC-HPc8CLoGRSG0dgbzZbDWA)
- [Convención Constitucional YT 07](https://youtube.com/channel/UC9p2Hsom7SXdro9FhN4K59w)
- [Convención Constitucional YT 08](https://youtube.com/channel/UCFkkF0LKUOUOcQEwG4nTrHw)
- [Convención Constitucional YT 09](https://youtube.com/channel/UCEK7dK0jllE0uXMhEQTV6og)
- [Convención Constitucional YT 10](https://youtube.com/channel/UC1qhPKBTpfhjVcTMzmM8mGw)
- [Convención Constitucional YT 11](https://youtube.com/channel/UCRVinYIynLNcn18wHjmI5Vg)
- [Convención Constitucional YT 12](https://youtube.com/channel/UCJerNR157sjR83jMChSocPQ)
- [Convención Constitucional YT 13](https://youtube.com/channel/UCxI0u9BUvXbGHrv200cgFZg)
- [Convención Constitucional YT 14](https://youtube.com/channel/UCxAECnUReRnEwkFThbjtH2Q)
- [Convención Constitucional YT 15](https://youtube.com/channel/UCTGMQgIdFvz3qlD9mKb8v9w)
- [Tribunal Constitucional de Chile](https://www.youtube.com/channel/UCZaI-1N1oaGb-U8K2VNztjg)
- [TV Educa Chile](https://www.tvn.cl/envivo/tveducachile/) - [x](https://www.m3u.cl/iptv-chile.php)
- [PuntajeNacional Chile](https://www.youtube.com/channel/UCCY6xIXHmGBGZUgUYxtfKSg)
- [Gobierno de Chile](https://www.gob.cl/)
- [COVID-19 Chile](https://bing.com/covid/local/chile)

Internacionales 🌍
Argentina

- [América TV](https://www.youtube.com/channel/UC6NVDkuzY2exMOVFw4i9oHw)
- [El Siete TV](https://www.youtube.com/channel/UC64ZNqX0FQHabP8iIkmnR3A)
- [A24](https://www.youtube.com/channel/UCR9120YBAqMfntqgRTKmkjQ)
- [Información Periodistica](https://ip.digital/vivo) - [x](https://github.com/iptv-org/iptv/blob/master/streams/ar.m3u)
- [IP Noticias](https://www.youtube.com/channel/UC1bBjOZieJWHbsFA0LwjjJA)

Colombia

- [Noticias Caracol](https://www.youtube.com/channel/UC2Xq2PK-got3Rtz9ZJ32hLQ)
- [RED MÁS Noticias](https://www.youtube.com/channel/UCpcvsK0UAI3MIHsjjj3CgMg)

Perú

- [Nacional TV](https://ntvperu.pe/senal-en-vivo/)
- [UCI](https://uci.pe/envivo)
- [Nativa](https://www.youtube.com/channel/UCdl1ygFwPa6lUdNYPLjoAGg)
- [Cable Visión Perú](https://www.cablevisionperu.pe/?page_id=1938)
- [ATV](https://www.atv.pe/envivo-atv)
- [ATV Más](https://www.atv.pe/envivo-atvmas)
- [Congreso República del Perú](https://www.youtube.com/channel/UCsKiP5cZCYh9YhPGrI6GrkQ)
- [Justicia TV](https://www.youtube.com/channel/UCwsURxTXqGqijgu98ndod3A)

Venezuela

- [teleSUR tv](https://www.youtube.com/channel/UCbHFKMtqLYkIBRiPHJwxu_w)
- [VPItv](https://www.youtube.com/channel/UCVFiIRuxJ2GmJLUkHmlmj4w)

México

- [MILENIO](https://www.youtube.com/channel/UCFxHplbcoJK9m70c4VyTIxg)

España

- [CNN en Español](https://www.youtube.com/channel/UC_lEiu6917IJz03TnntWUaQ)

Brasil

- [CNN Brasil](https://www.youtube.com/channel/UCvdwhh_fDyWccR42-rReZLw)

Estados Unidos

- [ABC7](https://www.youtube.com/channel/UCVxBA3Cbu3pm8w8gEIoMEog)
- [CNN US](https://us.cnn.com/) - [x](https://github.com/iptv-org/iptv/blob/master/streams/us.m3u)
- [CNBC EU](https://www.cnbc.com/live-tv/) - [x](https://vidgrid.tk.gg/)
- [C-SPAN 1](https://www.c-span.org/networks/?channel=c-span) - [x](https://vidgrid.tk.gg/)
- [C-SPAN 2](https://www.c-span.org/networks/?channel=c-span) - [x](https://vidgrid.tk.gg/)
- [C-SPAN 3](https://www.c-span.org/networks/?channel=c-span) - [x](https://vidgrid.tk.gg/)
- [Fox Business](https://www.youtube.com/channel/UCCXoCcu9Rp7NPbTzIvogpZg)
- [LiveNOW from FOX](https://www.youtube.com/channel/UCJg9wBPyKMNA5sRDnvzmkdg)
- [NBCLA](https://www.youtube.com/channel/UCSWoppsVL0TLxFQ2qP_DLqQ)
- [NBC Now (Live Event)](https://www.nbcnews.com/now)
- [NBC Now](https://www.nbcnews.com/now)
- [PBS America](https://www.pbsamerica.co.uk/) - [x](https://vidgrid.tk.gg/)
- [Record News](https://www.youtube.com/channel/UCuiLR4p6wQ3xLEm15pEn1Xw)
- [Sky News](https://www.youtube.com/channel/UCoMdktPbSTixAyNGwb-UYkQ)
- [The Sun](https://www.youtube.com/channel/UCIzXayRP7-P0ANpq-nD-h5g)

Francia

- [euronews (in English) 2](https://www.euronews.com/live) - [x](https://github.com/Free-IPTV/Countries/blob/master/UK01_UNITED_KINGDOM.m3u)
- [FRANCE 24 French](https://www.france24.com/fr/direct) - [x](https://github.com/iptv-org/iptv/blob/master/streams/fr.m3u)
- [LCI](https://www.tf1info.fr/direct/) - [x](https://github.com/iptv-org/iptv/blob/master/streams/fr.m3u)

Alemania

- [DW Español](https://www.youtube.com/channel/UCT4Jg8h03dD0iN3Pb5L0PMA)
- [DW Deutsch](https://www.youtube.com/channel/UCMIgOXM2JEQ2Pv2d0_PVfcg)

Rusia

- [5 канал](https://www.youtube.com/channel/UCkyrSWEcjZKpIwMxiPfOcgg)
- [Москва 24](https://www.youtube.com/channel/UCIme7og-uTpdRXRgm0zzA2A)
- [Россия 24](https://ok.ru/videoembed/3574052691599?nochat=1&autoplay=1) - [x](https://xn--b1agj9af.xn--80aswg/video/rossija-24/)
- [РБК](https://www.youtube.com/channel/UCWAK-dRtTEjnQnD96L6UMsQ)
- [RT America](https://www.youtube.com/channel/UCczrL-2b-gYK3l4yDld4XlQ)
- [RT Arabic](https://www.youtube.com/channel/UCsP3Clx2qtH2mNZ6KolVoZQ)
- [RT Español](https://www.youtube.com/channel/UC2mtXUpAYLYJIZ2deSPhlqw)
- [RT en vivo](https://www.youtube.com/channel/UCEIhICHOQOonjE6V0SLdrHQ)
- [RT France](https://www.youtube.com/channel/UCqEVwTnDzlzKOGYNFemqnYA)
- [RT News](https://www.youtube.com/channel/UCpwvZwUam-URkxB7g4USKpg)
- [RT UK](https://www.youtube.com/channel/UC_ab7FFA2ACk2yTHgNan8lQ)
- [Телеканал Дождь](https://www.youtube.com/channel/UCdubelOloxR3wzwJG9x8YqQ)
- [Україна 24](https://www.youtube.com/channel/UCMp5Buw-6LpbbV9r9Sl_5yg)

Ucrania

- [34 телеканал](https://www.youtube.com/channel/UCAxGITqXFNmV7PNCU82D_MA)
- [Апостроф TV](https://www.youtube.com/channel/UC0lnIB2qcArjFJPtq79WGZA)

China

- [民視直播 FTVN Live 53](https://www.youtube.com/channel/UClIfopQZlkkSpM1VgCFLRJA)
- [三立LIVE新聞](https://www.youtube.com/channel/UC2TuODJhC03pLgd6MpWP0iw)
- [中天電視](https://www.youtube.com/channel/UC5l1Yto5oOIgRXlI4p4VKbw)
- [CGTN Europe](https://www.youtube.com/channel/UCj0TppyxzQWm9JbMg3CP8Rg)

Hong Kong

- [蘋果動新聞 HK Apple Daily](https://www.youtube.com/channel/UCeqUUXaM75wrK5Aalo6UorQ)

Japón

- [ANNnewsCH](https://www.youtube.com/channel/UCGCZAYq5Xxojl_tSXcVJhiQ)
- [NHK WORLD-JAPAN](https://www.youtube.com/channel/UCSPEjw8F2nQDtmUKPFNF7_A)

Corea del Sur

- [MBCNEWS](https://www.youtube.com/channel/UCF4Wxdo3inmxP-Y59wXDsFw)

Nigeria

- [TVC News Nigeria](https://www.youtube.com/channel/UCgp4A6I8LCWrhUzn-5SbKvA)

India

- [IndiaTV](https://www.youtube.com/channel/UCttspZesZIDEwwpVIgoZtWQ)
- [Republic World](https://www.youtube.com/channel/UCwqusr8YDwM-3mEYTDeJHzw)

Reino Unido

- [GBNews](https://www.youtube.com/channel/UC0vn8ISa4LKMunLbzaXLnOQ)

Radios 📻
Chile

- [Biobio TV 2](https://www.biobiochile.cl/biobiotv/) - [x](https://m3u.cl/lista-iptv-chile.php)
- [ADN 3](http://tv.adnradio.cl/) - [x](https://github.com/iptv-org/iptv/blob/master/streams/cl.m3u)
- [ADN 4](http://tv.adnradio.cl/) - [x](https://github.com/iptv-org/iptv/blob/master/streams/cl.m3u)
- [ADN 5](http://tv.adnradio.cl/) - [x](https://m3u.cl/lista-iptv-chile.php)
- [Carolina TV 2](https://www.carolina.cl/tv/) - [x](https://www.chileiptv.cl/)
- [Carolina TV 3](https://www.carolina.cl/tv/) - [x](https://github.com/iptv-org/iptv/blob/master/streams/cl.m3u)
- [FM Tiempo](https://www.fmtiempo.cl/)
- [FM Tiempo 2](https://www.fmtiempo.cl/) - [x](https://www.chileiptv.cl/)
- [Alegría TV](https://www.alegriafm.cl/) - [x](https://www.chileiptv.cl/)
- [Alegría TV 2](https://www.alegriafm.cl/) - [x](https://github.com/iptv-org/iptv/blob/master/streams/cl.m3u)
- [Romántica TV 2](https://www.romantica.cl/romantica-tv/) - [x](https://www.chileiptv.cl/)
- [Mi Radio es Más](https://www.youtube.com/channel/UCflUbt1g29kPG-H9SV5QIyw)
- [Radio María Chile](https://www.youtube.com/channel/UClMwb2kCYemWyDIZ2dYttKA)

Perú

- [PBO](https://www.youtube.com/channel/UCgR0st4ZLABi-LQcWNu3wnQ)
- [Radio Santa Rosa](https://www.youtube.com/channel/UCIGV0oiNkdK2-tnf10DNp2A)

Música 🎵

- [IMUC Chile](https://www.youtube.com/channel/UCIIDtZoaK9UZi4FaGMmL_hw)
- [naxos japan](https://www.youtube.com/channel/UCwP6-81HmoDyC3nfBAyGPXQ)
- [the bootleg boy](https://www.youtube.com/channel/UC0fiLCwTmAukotCXYnqfj0A)
- [the bootleg boy 2](https://www.youtube.com/channel/UCwkTfp14Sj7o6q9_8ADJpnA)
- [Abao en Tokio](https://www.youtube.com/channel/UC84whx2xxsiA1gXHXXqKGOA)

Cámaras 📷

- [Providencia, Ledrium](https://www.youtube.com/channel/UCTDewuGhfwGv6JRNnqa-yXw)
- [glaseado.cl, Huayquique](https://www.glaseado.cl/surf-cams/huayquique/)
- [glaseado.cl,Las Urracas](https://www.glaseado.cl/surf-cams/las-urracas/)
- [glaseado.cl, La Punta](https://www.glaseado.cl/surf-cams/la-punta/)
- [Av Angamos](https://www.youtube.com/channel/UCP9nvEUj8EN-wuOQajPQbAw)
- [Av La Marina](https://www.youtube.com/channel/UCP9nvEUj8EN-wuOQajPQbAw)
- [Washington DC LIVE Cam & US Capitol](https://www.youtube.com/channel/UCRj7u6fmW8RYQl98hcwbwng)
- [Las Vegas, Treasure Island](https://www.youtube.com/channel/UCRj7u6fmW8RYQl98hcwbwng)
- [San Diego, Down Town + Airport](https://www.youtube.com/channel/UCRj7u6fmW8RYQl98hcwbwng)
- [Paris, EIFFEL Tower](https://www.youtube.com/channel/UCRj7u6fmW8RYQl98hcwbwng)
- [Steadycamline, Jerusalem](https://www.youtube.com/channel/UC1byT4dOeBAZwVqQ309iAuA)

Espacio 🔭

- [NASA ISS Live Stream](https://www.youtube.com/watch?v=EEIk7gwjgIM)
- [Space Videos](https://www.youtube.com/channel/UCakgsb0w7QB0VHdnCc-OVEA)
- [NASASpaceflight](https://www.youtube.com/channel/UCSUu1lih2RifWkKtDOJdsBA)
- [NASASpaceflight](https://www.youtube.com/channel/UCSUu1lih2RifWkKtDOJdsBA)
- [Earth view from ISS](https://www.youtube.com/watch?v=XBPjVzSoepo)
- [LabPadre](https://www.youtube.com/channel/UCFwMITSkc1Fms6PoJoh1OUQ)
- [Multi-cam Ucrania, Zabby](https://www.youtube.com/channel/UCxc2Kkmuc8-BXVEQ82ChVow)
- [Multi-cam Ucrania, Sloth On Meth](https://www.youtube.com/channel/UCkO2xL-Fx_tYXXxuuAv_j6A)

Varios

- [COVID-19 Dashboard](https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6)
- [COVID-19 Live](https://www.youtube.com/channel/UCDGiCfCZIV5phsoGiPwIcyQ)

## [v0.14]

### Changed

- Código JavaScript reducido con el socio ChatGPT-3.5

### Added

#### 📺 Canales

Chile

- [CHV 4](https://www.chilevision.cl/senal-online) - [x](https://www.viendotele.cl/assets-tele/chv.html)

### Changed

#### 📺 Canales

Chile

- [CHV 2](https://www.chilevision.cl/senal-online) - [x](https://chvv--hofece7009.repl.co/)

## [v0.13]

### Changed

- Enlace a sitio de Pottersys; <http://pslabs.cl/tele.html> -> <https://www.viendotele.cl/>
- Señales por defecto

### Added

#### 📺 Canales

Chile

- [Meganoticias 3](https://www.meganoticias.cl/senal-en-vivo/meganoticias/) - [x](https://github.com/AINMcl/MonitorTV/)
- [CHV Noticias 3](https://www.chvnoticias.cl/senal-online/)
- [CHV Noticias 4](https://www.chvnoticias.cl/senal-online/)
- [T13 4](https://www.t13.cl/)

## [v0.12]

### Changed

- Cambio versión Bootstrap Icons de 1.9.0 a 1.10.4
- Rediseño leve, enfoque en usar iconos externos librería Bootstrap Icons y no emojis para mejor compatibilidad

#### 📺 Canales

Chile

- 24 Horas s3 paso a ser tvn 2

### Removed

- Carpeta svg icons

## [v0.11]

### Changed

- Cambios semanticos en temas de nombrado funciones y caracteristicas listado canales (camelCase basicamente)

### Added

- Filtro canales por bandera pais dentro de modal.

#### 📺 Canales

Chile

- [TVN 2](https://www.tvn.cl/) - [x](https://github.com/AINMcl/MonitorTV/)
- [CHV Noticias 2](https://www.chvnoticias.cl/) - [x](https://pluto.tv/es/live-tv/chilevision-noticias)
- [Mega 2](https://www.mega.cl/) - [x](https://www.m3u.cl/iptv-chile.php)
- [La Red](https://www.lared.cl/senal-online) - [x](https://www.m3u.cl/iptv-chile.php)
- [Canal 13 3](https://www.13.cl/en-vivo) - [x](https://github.com/AINMcl/MonitorTV/)

### Removed

#### 📺 Canales

Chile

- [TVN 2](https://www.tvn.cl/) - [x](https://github.com/AINMcl/MonitorTV/blob/master/IPTV/AINM.m3u)
- [TVN 3](https://ok.ru/videoembed/3440915652202?nochat=1&autoplay=1) - [x](https://www.chilenotas.com/tvn-en-vivo/)
- [Mega 2](https://ok.ru/videoembed/3440906608234?nochat=1&autoplay=1) - [x](https://www.chilemetros.com/mega-en-vivo/)
- [CHV 4](https://ok.ru/videoembed/3440896777834?nochat=1&autoplay=1) - [x](https://www.chilemetros.com/chilevision-en-vivo/)
- [La Red](https://www.lared.cl/senal-online) - [x](https://www.cxtvlive.com/live-tv/la-red)
- [La Red 2](https://www.lared.cl/senal-online) - [x](https://github.com/AINMcl/MonitorTV/blob/master/IPTV/AINM.m3u)
- [Canal 13 3](https://ok.ru/videoembed/3440918732394?nochat=1&autoplay=1) - [x](https://www.chilemetros.com/canal-13-en-vivo/)

Ucrania

- [Типичный Киев](https://www.youtube.com/channel/UC26WRsO361Xd0nSPni4wQhg)
- [Ukraine News](https://www.youtube.com/channel/UC0qYC_KgtfIEgpmJTSOimGw)
- [Obolonsky District Kiev Kyiv](https://www.youtube.com/channel/UCNrGOnduIS9BXIRmDcHasZA)
- [kаховка.het](https://www.youtube.com/channel/UCpY5H5S7P8t7EWHtsTXQhjQ)
- [Politischios.gr](https://www.youtube.com/channel/UClEiTusa-SX5NmpsWIRgCDQ)
- [Multi-cam Ucrania, Livestream Events](https://www.youtube.com/channel/UCrjyygMS1KNuL10AT5AIcBQ)
- [Multi-cam Ucrania, VBM](https://www.youtube.com/channel/UCPCnfZNOj8925ID963Bn9Tg)
- [Multi-cam Ucrania, BLVKRVFT](https://www.youtube.com/channel/UC9Gy7ZpwAFgB1BIVniUmrYA)

## [v0.10]

### Changed

- Migrado repositorio "tele" a "teles" debido a DMCA (<https://github.com/github/dmca/blob/master/2022/06/2022-06-06-corus.md> gracias GitHub por no tomar en cuenta mi respuesta a pesar de haber hecho los pasos que solicitaban, fue una buena y grata experiencia 10/10)

## [v0.09]

### Added

- Mención a <https://flagpedia.net/> en archivo NOTICE.md
- Botón para alternar a pantalla completa
- Botón para quitar señal desde grid

#### 📺 Canales

Chile

- [TVN 3](https://ok.ru/videoembed/3440915652202?nochat=1&autoplay=1) - [x](https://www.chilenotas.com/tvn-en-vivo/) [Revivio sitio offline por DMCA]
- [Mega 2](https://ok.ru/videoembed/3440906608234?nochat=1&autoplay=1) - [x](https://www.chilemetros.com/mega-en-vivo/)
- [Canal 13 3](https://ok.ru/videoembed/3440918732394?nochat=1&autoplay=1) - [x](https://www.chilemetros.com/canal-13-en-vivo/) [Revivio sitio offline por DMCA]
- [CHV 4](https://ok.ru/videoembed/3440896777834?nochat=1&autoplay=1) - [x](https://www.chilemetros.com/chilevision-en-vivo/)
- [Gobierno de Chile](https://www.gob.cl/)
- [Contivision](http://w.contivision.cl/cvn/envivo.php)

Argentina

- [Canal 26](https://www.diario26.com/canal26_en_vivo)

Peru

- [Onda Digital TV 2](https://ondadigitaltv.com) - [x](https://raw.githubusercontent.com/iptv-org/iptv/master/streams/pe.m3u)

Canadá

- [Global News](https://globalnews.ca/live/national/) - [x](https://vidgrid.tk.gg/)

Estados Unidos

- [Bloomberg US](https://www.bloomberg.com/) - [x](https://vidgrid.tk.gg/)
- [Bloomberg Europe](https://www.bloomberg.com/europe) - [x](https://vidgrid.tk.gg/)
- [Bloomberg QuickTake](https://www.bloomberg.com/) - [x](https://vidgrid.tk.gg/)
- [Cheddar](https://cheddar.com/live) - [x](https://vidgrid.tk.gg/)
- [CBSN](https://www.cbsnews.com/live/) - [x](https://vidgrid.tk.gg/)
- [CNBC EU](https://www.cnbc.com/live-tv/) - [x](https://vidgrid.tk.gg/)
- [C-SPAN 1](https://www.c-span.org/networks/?channel=c-span) - [x](https://vidgrid.tk.gg/)
- [C-SPAN 2](https://www.c-span.org/networks/?channel=c-span) - [x](https://vidgrid.tk.gg/)
- [C-SPAN 3](https://www.c-span.org/networks/?channel=c-span) - [x](https://vidgrid.tk.gg/)
- [Fox News Now](https://video.foxnews.com/v/6174103160001)
- [NBC Now (Live Event)](https://www.nbcnews.com/now)
- [NBC Now](https://www.nbcnews.com/now)
- [PBS America](https://www.pbsamerica.co.uk/) - [x](https://vidgrid.tk.gg/)

Francia

- [euronews (in English) 2](https://www.euronews.com/live) - [x](https://github.com/Free-IPTV/Countries/blob/master/UK01_UNITED_KINGDOM.m3u)

China

- [CGTN](https://www.cgtn.com/) - [x](https://vidgrid.tk.gg/)

Japón

- [NHK WORLD-JAPAN](https://www.youtube.com/channel/UCSPEjw8F2nQDtmUKPFNF7_A)
- [NHK World](https://www3.nhk.or.jp/nhkworld/en/live/) - [x](https://vidgrid.tk.gg/)

Catar

- [Al Jazeera English 2](https://www.aljazeera.com/live/) - [x](https://vidgrid.tk.gg/)

Música

- [College Music](https://www.youtube.com/channel/UCWzZ5TIGoZ6o-KtbGCyhnhg)
- [Naciones Unidas](https://www.youtube.com/channel/UC5O114-PQNYkurlTg6hekZw)

### Changed

- Banderas países ahora provienen dinámicamente desde <https://flagcdn.com> (Gracias a sapear los proyectos de @martinsantibanez/tele-react y @AINMcl/MonitorTV)
- UCI 2 -> Nativa

### Removed

- Carpeta archivos SVG de banderas países
- Licencia "CSS Range Slider – with Fill"

#### 📺 Canales

Chile

- [24 Horas 7](https://www.twitch.tv/24horas_tvn) - [x](https://github.com/AINMcl/MonitorTV/blob/05188eeaea9622e986b338f63a46fb189898184f/IPTV/AINM.m3u)
- [Mega](https://www.mega.cl/) - [x](https://www.m3u.cl/iptv-chile.php)
- [T13 4](https://www.t13.cl/) - [x](https://github.com/AINMcl/MonitorTV/blob/05188eeaea9622e986b338f63a46fb189898184f/IPTV/AINM.m3u)
- [Canal 13 3](https://www.13.cl/en-vivo) - [x](https://github.com/AINMcl/MonitorTV/blob/05188eeaea9622e986b338f63a46fb189898184f/IPTV/AINM.m3u)
- [La Red](https://www.lared.cl/senal-online)
- [La Red 2](https://www.lared.cl/senal-online) - [x](https://raw.githubusercontent.com/Televito/TDT-Mundo/main/IPTV)
- [La Red 4](https://www.lared.cl/senal-online) - [x](https://m3u.cl/lista-iptv-chile.php)
- [La Red 6](https://www.lared.cl/senal-online) - [x](https://github.com/WJS1978/IPTV/blob/56dbbc76e3f1167966459f0d708b514bb792ae9c/iptv.m3u)
- [La Red 7](https://www.lared.cl/senal-online) - [x](https://github.com/iptv-org/iptv/blob/master/channels/cl.m3u)
- [La Red 8](https://www.lared.cl/senal-online) - [x](https://github.com/iptv-org/iptv/blob/master/channels/cl.m3u)
- [TV+ s2](https://www.chilevision.cl/senal-online) - [x](https://m3u.cl/lista-iptv-chile.php)

Ucrania

- [Multi-cam Ucrania, Think UnBoxing](https://www.youtube.com/channel/UC9gZNwBbScfFKHipRhlkjmA)
- [Multi-cam Ucrania, JnMadness](https://www.youtube.com/channel/UCa4j52YYLqhmhxwG_ryhFwg)
- [Multi-cam Ucrania, Planet Viral](https://www.youtube.com/channel/UCs0rWQqjVIfsLHgZxt-Oduw)
- [Multi-cam Ucrania, Live Moments](https://www.youtube.com/channel/UCe5k7sBfXZ5rHpJXUi9BA9A)

## Fixed

- Código dejaba de ejecutarse correctamente al intentar cargar canales desde localStorage que ya no se encontraban en listado activo

## [v0.08]

### Added

- Añadidas licencias pwabuilder y pwa-update a "NOTICE.md"
- Añadido proyecto github <https://github.com/marcosins/convencion-chile> a listado enlaces complementarios
- Creado archivo "características.md"
- Creado archivo "changelog.md"

#### 📺 Canales

- [La Red 6](https://www.lared.cl/senal-online) - [x](https://github.com/WJS1978/IPTV/blob/56dbbc76e3f1167966459f0d708b514bb792ae9c/iptv.m3u)
- [UCV TV 2](https://pucvmultimedios.cl/senal-online-tv.php) - [x](https://github.com/WJS1978/IPTV/blob/56dbbc76e3f1167966459f0d708b514bb792ae9c/iptv.m3u)
- [La Red 7](https://www.lared.cl/senal-online) - [x](https://github.com/iptv-org/iptv/blob/master/channels/cl.m3u)
- [La Red 8](https://www.lared.cl/senal-online) - [x](https://github.com/iptv-org/iptv/blob/master/channels/cl.m3u)
- [Antofagasta TV 3](https://www.antofagasta.tv/) - [x](https://github.com/iptv-org/iptv/blob/master/channels/cl.m3u)
- [ARABTV](https://www.arabtv.cl/)
- [ARABTV 2](https://www.arabtv.cl/) - [x](https://github.com/iptv-org/iptv/blob/master/channels/cl.m3u)
- [Arica TV](https://arica.tv/envivo/)
- [Atacama TV](http://atacamatelevision.com/)
- [Atacama TV 2](http://atacamatelevision.com/) - [x](https://github.com/iptv-org/iptv/blob/master/channels/cl.m3u)
- [Convención Constitucional 3](https://www.youtube.com/channel/UCRlIWVAxQdAnCl4D4UR9r3Q)
- [Convención Constitucional YT 01](https://youtube.com/channel/UCc3koBbWMyvSyzRbG5eTgvQ)
- [Convención Constitucional YT 02](https://youtube.com/channel/UCKmKUwcjv6HJP7-z9Nnpp2w)
- [Convención Constitucional YT 03](https://youtube.com/channel/UCeIlCkkBplhU0SrWM9B7u7Q)
- [Convención Constitucional YT 04](https://youtube.com/channel/UCkMWMYCPUGzf3UPAxcIaVqA)
- [Convención Constitucional YT 05](https://youtube.com/channel/UChNeKfZ0-wwuOCyUSu6BlcA)
- [Convención Constitucional YT 06](https://youtube.com/channel/UC-HPc8CLoGRSG0dgbzZbDWA)
- [Convención Constitucional YT 07](https://youtube.com/channel/UC9p2Hsom7SXdro9FhN4K59w)
- [Convención Constitucional YT 08](https://youtube.com/channel/UCFkkF0LKUOUOcQEwG4nTrHw)
- [Convención Constitucional YT 09](https://youtube.com/channel/UCEK7dK0jllE0uXMhEQTV6og)
- [Convención Constitucional YT 10](https://youtube.com/channel/UC1qhPKBTpfhjVcTMzmM8mGw)
- [Convención Constitucional YT 11](https://youtube.com/channel/UCRVinYIynLNcn18wHjmI5Vg)
- [Convención Constitucional YT 12](https://youtube.com/channel/UCJerNR157sjR83jMChSocPQ)
- [Convención Constitucional YT 13](https://youtube.com/channel/UCxI0u9BUvXbGHrv200cgFZg)
- [Convención Constitucional YT 14](https://youtube.com/channel/UCxAECnUReRnEwkFThbjtH2Q)
- [Convención Constitucional YT 15](https://youtube.com/channel/UCTGMQgIdFvz3qlD9mKb8v9w)

#### 📻 Radios

- [Alegría TV 2](https://www.alegriafm.cl/) - [x](https://github.com/iptv-org/iptv/blob/master/channels/cl.m3u)
- [Alternativa FM](https://www.alternativafm.cl/p/alternativa-tv.html) - [x](https://github.com/iptv-org/iptv/blob/master/channels/cl.m3u)

### Changed

- Arreglado efecto boton canales tras clic (":focus" heredado de Bootstrap pasaba a formar parte de animación "pulsate-2")
- Animación botón canales menos distractora ("pulsate-3")
- Reemplazado "|" de manifesto por "-" para compatibilidad titulo con windows
- Personalizaciones ahora son accesibles mediante navbar igualmente
- Posición alerta pwa-update movida sobre botón flotante no detrás
- Cambio sintaxis scripts de snake_case a camelCase
- Renombradas variables para que sean más descriptivas
- TVN 3 => TVN 2
- Canal 13 4 => Canal 13 3

### Removed

- Quitado mensaje (provisorio) de sugerencia ante css no actualizándose

#### 📺 Canales

- [Canal 13 3](https://ok.ru/videoembed/3076941553258?nochat=1&autoplay=1) - [x](https://www.chilemetros.com/canal-13-en-vivo/) [sitio offline por DMCA, transmitian señal tntsport]
- [TVN 2](https://ok.ru/videoembed/3076940701290?nochat=1&autoplay=1) - [x](https://www.chilenotas.com/tvn-en-vivo/) [sitio offline por DMCA, transmitian señal tntsport]

## [v0.07]

### Added

- Añadida librería Workbox (sitio ahora funciona como PWA) y solucionado problema de carga presente en primer lanzamiento #5
- Añadido botón limpiar todos los canales activos

#### 📺 Canales

- [La Red 5](https://www.lared.cl/senal-online) - [x](https://github.com/AINMcl/MonitorTV/blob/master/IPTV/AINM.m3u)
- [TVN 3](https://www.tvn.cl/) - [x](https://github.com/AINMcl/MonitorTV/blob/master/IPTV/AINM.m3u)
- [Mega 2](https://www.mega.cl/) - [x](https://github.com/AINMcl/MonitorTV/blob/05188eeaea9622e986b338f63a46fb189898184f/IPTV/AINM.m3u)
- [CHV 3](https://www.chilevision.cl/senal-online) - [x](https://github.com/AINMcl/MonitorTV/blob/05188eeaea9622e986b338f63a46fb189898184f/IPTV/AINM.m3u)
- [Canal 13 4](https://www.13.cl/en-vivo) - [x](https://github.com/AINMcl/MonitorTV/blob/05188eeaea9622e986b338f63a46fb189898184f/IPTV/AINM.m3u)
- [T13 4](https://www.t13.cl/) - [x](https://github.com/AINMcl/MonitorTV/blob/05188eeaea9622e986b338f63a46fb189898184f/IPTV/AINM.m3u)
- [24 Horas 7](https://www.twitch.tv/24horas_tvn) - [x](https://github.com/AINMcl/MonitorTV/blob/05188eeaea9622e986b338f63a46fb189898184f/IPTV/AINM.m3u)
- [TV+](https://www.chilevision.cl/senal-online) - [x](https://m3u.cl/lista-iptv-chile.php)
- [TV+ s2](https://www.chilevision.cl/senal-online) - [x](https://m3u.cl/lista-iptv-chile.php)
- [Osorno TV](https://www.osornotv.cl/envivo.html) - [x](https://m3u.cl/lista-iptv-chile.php)
- [LCI](https://www.tf1info.fr/direct/) - [x](https://raw.githubusercontent.com/iptv-org/iptv/master/channels/fr.m3u)
- [FRANCE 24 French](https://www.france24.com/fr/direct) - [x](https://raw.githubusercontent.com/iptv-org/iptv/master/channels/fr.m3u)
- [Euronews (magyarul)](https://www.youtube.com/channel/UUC4Ct8gIf9f0n4mdyGsFiZRA)
- [Información Periodistica](https://ip.digital/vivo) - [x](https://raw.githubusercontent.com/iptv-org/iptv/master/channels/ar.m3u)
- [IP Noticias](https://www.youtube.com/channel/UC1bBjOZieJWHbsFA0LwjjJA) (suele deshabilitar visualización en sitios externos a youtube)
- [ABC News](https://abcnews.go.com/Live) - [x](https://raw.githubusercontent.com/eviltizzy/TizTV/master/Tiz_M3U)
- [ABC NEWS AU](https://www.abc.net.au/news/) - [x](https://raw.githubusercontent.com/eviltizzy/TizTV/master/Tiz_M3U)
- [Carolina TV 3](https://www.carolina.cl/tv/) - [x](https://github.com/iptv-org/iptv/blob/master/channels/cl.m3u)
- [TV+ 2](https://www.chilevision.cl/senal-online)
- [Municipalidad Osorno](https://www.youtube.com/channel/UCD7sqegDNyZxmdnCj6xqH6g)
- [glaseado.cl, Huayquique](https://www.glaseado.cl/surf-cams/huayquique/)
- [glaseado.cl,Las Urracas](https://www.glaseado.cl/surf-cams/las-urracas/)
- [glaseado.cl, La Punta](https://www.glaseado.cl/surf-cams/la-punta/)
- [Washington DC LIVE Cam & US Capitol](https://www.youtube.com/channel/UCRj7u6fmW8RYQl98hcwbwng)
- [Las Vegas, Treasure Island](https://www.youtube.com/channel/UCRj7u6fmW8RYQl98hcwbwng)
- [San Diego, Down Town + Airport](https://www.youtube.com/channel/UCRj7u6fmW8RYQl98hcwbwng)
- [Paris, EIFFEL Tower](https://www.youtube.com/channel/UCRj7u6fmW8RYQl98hcwbwng)

### Changed

- Modal aviso legal ahora se desactiva con localStorage, eliminada la necesidad de crear cookie
- Mediante localStorage ahora canales activos persisten tras recargar el sitio
- Cambio colores para mejorar contrastes
- Rediseñado panel personalización (sidepanel)
- Reescrito descargo de responsabilidad para adaptarse mejor en caso de hacer fork al repositorio
- Archivos svg extraídos de código html, ahora se utilizan como imágenes
- Enlace mención primer favicon paso a hacer referencia a commit original

### Deprecated

- Librerías bootstrap y videojs eliminadas de archivos proyecto, vuelven a cargan mediante CDN

### Removed

- Primer favicon
- Archivo todo.txt
- Archivo html de tips votaciones

## [v0.06]

### Added

#### 📺 Canales

- [T13 3](https://www.t13.cl/)
- [Ñuble RTV](https://canalrtv.cl/)

### Changed

- Reducido código canales.js
- Reducido código styles.css
- Reescrito código creación canales (aumenta legibilidad igual)
- Reescrito descargo de responsabilidad a modo de definir alcance proyecto
- Renombrado scripts.js -> main.js
- Renombrada carpeta images -> img
- Diseño botones canales
- Añadido enlace repositorio en el cual esta inspirado el proyecto (<https://github.com/PotterSys/canales-tele>) a archivo readme (junto a ir a dar su debida estrellita, se me disculpa "PotterSys" no había cachao que tenias la página en un repositorio igual)
- Añadidos enlaces stackoverflow que se han utilizado para que sea más fácil comprender código
- Tag "< a >" traen por defecto "rel=noopener" por lo que fue eliminado (<https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types/noopener>)
- Renombrado ChilledCow -> Lofi Girl
- Renombrado Cámara de Diputados Señal Youtube -> Cámara de Diputados YT
- Ideada manera de avisar sobre posibles errores de carga de CSS en caso de que sitio se actualice pero el archivo CSS no (ya que me paso)
- Botones canales ahora se generan con grid para que tenga un tamaño igualitario
- Reescrito código para interior botones canales

### Removed

#### 📺 Canales

- [31 minutos - Todos los episodios](https://www.youtube.com/playlist?list=PLVI9tQggdGtFXgCwpjTM_d2pdH6ABeRFL)
- [Diego y Glot - Temporada 1](https://www.youtube.com/watch?v=J3cLcZ1QhFE&list=PLnDONcPxnlq2s8zwIuJt8_JI4Tf3amd6u)
- [Los Pulentos - Temporada 1](https://www.youtube.com/playlist?list=PLnDONcPxnlq2gZlH-OAXCnIeyPwMpQuUb)
- [Villa Dulce - Temporada 1](https://www.youtube.com/playlist?list=PLnDONcPxnlq1V8zLL54a6luAy4Wp6ldK3)
  - [Ya no se permitía visualización fuera de Youtube]

## [v0.05]

### Added

#### 📺 Canales

- [Canal 13 3](https://ok.ru/videoembed/3076941553258?nochat=1&autoplay=1) - [x](https://www.chilemetros.com/canal-13-en-vivo/)

#### 📻 Radios

- [Carolina TV 3](https://www.carolina.cl/tv/) - [x](https://github.com/iptv-org/iptv/blob/master/channels/cl.m3u)

### Changed

- Bootstrap V4.6.0 > 5.1.3
- Creado sidebar con opciones de configuración del sitio (últimamente he accedido a la pagina desde el teléfono y creo que queda mejor que sean accesibles sin obstruir el contenido que se intenta ajustar)
- Pasados algunos scripts a vanilla js para comenzar a desechar jQuery (quedaron 2 que no supe como traducir ¯_(ツ)_/¯)
- Cambios diseño generales
- Habemus filtro! (gg jQuery)
- Botón nombre transmisiones on/off funciona de pana ahora
- Imágenes previews actualizadas
- CSS reescrito bajo uso de nesting y separado (un poco mejor) por secciones

### Deprecated

- Librería Popper (viene incorporado dentro de librería Bootstrap)
- Librería jQuery

### Removed

- Eliminadas imágenes de versiones anteriores

## [v0.04]

### Added

- Variación por martinsantibanez (<https://github.com/martinsantibanez/tele-react>)

#### 📺 Canales

- [CHV Noticias](https://www.youtube.com/channel/UCRsUoZYC1ULUspipMRnMhwg)
- [Puranoticia TV](https://puranoticia.pnt.cl/)
- [Ñublevision](https://nublevision.cl/)

#### 📰 📻 Prensa alternativa

| Enlace/Nombre                                                                                                                                               | Twitter                                        | Facebook                                                                                     | Instagram                                                          | Fuente                                                                                                         |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------|----------------------------------------------------------------------------------------------|--------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| [Canal 3 La Victoria](https://canal3lavictoria.cl/)                                                                                                         | [Twitter](https://twitter.com/tv_piola)        | ❌                                                                                            | [Instagram](https://www.instagram.com/canal3lavictoria/)           | [X](https://15mpedia.org/wiki/Lista_de_medios_de_comunicaci%C3%B3n_alternativos_de_Chile)                      |
| [Capucha Informativa](https://capuchainformativa.org/)                                                                                                      | [Twitter](https://twitter.com/capucha_informa) | [Facebook](https://www.facebook.com/capuchainformativa)                                      | [Instagram](https://instagram.com/capucha_informa)                 | ❌                                                                                                              |
| [ChileOkulto](https://chileokulto.com/)                                                                                                                     | [Twitter](https://twitter.com/Chileokulto)     | [Facebook](https://www.facebook.com/ChileokultoCL/)                                          | [Instagram](https://www.instagram.com/chile.okulto/)               | [X](https://www.ciperchile.cl/2021/03/23/el-ruidoso-silencio-de-los-medios-tradicionales/)                     |
| [El Ciudadano](https://www.elciudadano.com/)                                                                                                                | [Twitter](https://twitter.com/El_Ciudadano)    | [Facebook](https://www.facebook.com/PeriodicoElCiudadano)                                    | [Instagram](https://www.instagram.com/el.ciudadano/)               | [X](https://www.ciperchile.cl/2021/03/23/el-ruidoso-silencio-de-los-medios-tradicionales/)                     |
| [El Desconcierto](https://www.eldesconcierto.cl/)                                                                                                           | [Twitter](https://twitter.com/eldesconcierto)  | [Facebook](https://www.facebook.com/eldesconciertocl/)                                       | [Instagram](https://www.instagram.com/eldesconcierto/)             | [X](https://www.ciperchile.cl/2021/03/23/el-ruidoso-silencio-de-los-medios-tradicionales/)                     |
| [El Dínamo](https://www.eldinamo.cl/)                                                                                                                       | [Twitter](https://twitter.com/el_dinamo)       | [Facebook](https://www.facebook.com/el.dinamo)                                               | [Instagram](https://www.instagram.com/el_dinamo/)                  | [X](https://www.ciperchile.cl/2021/03/23/el-ruidoso-silencio-de-los-medios-tradicionales/)                     |
| [El Líbero](https://ellibero.cl/)                                                                                                                           | [Twitter](https://twitter.com/elliberocl)      | [Facebook](https://www.facebook.com/ElLibero)                                                | [Instagram](https://www.instagram.com/elliberocl/)                 | [X](https://www.ciperchile.cl/2021/03/23/el-ruidoso-silencio-de-los-medios-tradicionales/)                     |
| [ElObservatodo.cl](https://www.elobservatodo.cl/)                                                                                                           | [Twitter](https://twitter.com/elobservatodo)   | [Facebook](https://www.facebook.com/elobservatodo.cl/)                                       | [Instagram](https://www.instagram.com/elobservatodo.cl/)           | [X](https://www.ciperchile.cl/2021/03/23/el-ruidoso-silencio-de-los-medios-tradicionales/)                     |
| [El Periscopio.c](https://www.elperiscopio.cl/)                                                                                                             | [Twitter](https://twitter.com/GrupoPeriscopio) | [Facebook](https://www.facebook.com/periscopiochile/)                                        | [Instagram](https://www.instagram.com/elperiscopionoticias/)       | [X](https://www.ciperchile.cl/2021/03/23/el-ruidoso-silencio-de-los-medios-tradicionales/)                     |
| [En Punto](https://enpuntoprensa.cl/)                                                                                                                       | [Twitter](https://twitter.com/EnPuntoPrensa)   | [Facebook](https://www.facebook.com/EnPuntoPrensa)                                           | [Instagram](https://www.instagram.com/enpuntoprensa/)              | ❌                                                                                                              |
| [El Universal Chile](https://eluniversal.cl/)                                                                                                               | [Twitter](https://twitter.com/ElUniversalCL)   | [Facebook](https://www.facebook.com/ElUniversalCL)                                           | ❌                                                                  | ❌                                                                                                              |
| [Gamba](https://www.gamba.cl/)                                                                                                                              | [Twitter](https://twitter.com/gamba_cl)        | [Facebook](https://www.facebook.com/gambanoticias/)                                          | [Instagram](https://www.instagram.com/gamba.cl/)                   | [X](https://www.ciperchile.cl/2021/03/23/el-ruidoso-silencio-de-los-medios-tradicionales/)                     |
| [Interferencia.cl](https://interferencia.cl/)                                                                                                               | [Twitter](https://twitter.com/InterferenciaCL) | [Facebook](https://www.facebook.com/InterferenciaChile)                                      | [Instagram](https://www.instagram.com/interferencia.cl/)           | [X](https://www.ciperchile.cl/2021/03/23/el-ruidoso-silencio-de-los-medios-tradicionales/)                     |
| [La Izquierda Diario Chile](https://www.laizquierdadiario.cl/)                                                                                              | [Twitter](https://twitter.com/lid_chile)       | [Facebook](https://www.facebook.com/Laizquierdadiariochile/)                                 | [Instagram](https://www.instagram.com/laizquierdadiariocl/)        | [X](https://www.ciperchile.cl/2021/03/23/el-ruidoso-silencio-de-los-medios-tradicionales/)                     |
| [Mapuexpress](https://www.mapuexpress.org/)                                                                                                                 | [Twitter](https://twitter.com/mapuexpress)     | [Facebook](https://www.facebook.com/Mapuexpress.org/)                                        | [Instagram](https://instagram.com/mapuexpress/)                    | [X](https://www.ciperchile.cl/2021/03/23/el-ruidoso-silencio-de-los-medios-tradicionales/)                     |
| [Megafono Popular](https://megafonopopular.cl/)                                                                                                             | [Twitter](https://twitter.com/MegafonoPopular) | ❌                                                                                            | [Instagram](https://www.instagram.com/megafonopopular/)            | [X](https://15mpedia.org/wiki/Lista_de_medios_de_comunicaci%C3%B3n_alternativos_de_Chile)                      |
| [Primera Línea Revolucionaria Chile](https://plrchile.com/)                                                                                                 | [Twitter](https://twitter.com/primeralineare1) | [Facebook](https://www.facebook.com/PrimeraLineaRevolucionaria/)                             | [Instagram](https://www.instagram.com/primeralinearevolucionaria/) | ❌                                                                                                              |
| [Puranoticia.cl](https://puranoticia.pnt.cl/)                                                                                                               | [Twitter](https://twitter.com/puranoticia)     | [Facebook](https://www.facebook.com/puranoticiaweb/)                                         | [Instagram](https://www.instagram.com/puranoticia_chile/)          | [X](https://www.ciperchile.cl/2021/03/23/el-ruidoso-silencio-de-los-medios-tradicionales/)                     |
| [Revista De Frente](https://www.revistadefrente.cl/)                                                                                                        | [Twitter](https://twitter.com/DeFrente_cl)     | [Facebook](https://www.facebook.com/DeFrente.cl)                                             | [Instagram](https://www.instagram.com/revistadefrente.cl/)         | [X](https://15mpedia.org/wiki/Lista_de_medios_de_comunicaci%C3%B3n_alternativos_de_Chile)                      |
| [Revista ChileLibre](https://chilelibre.cl/)                                                                                                                | [Twitter](https://twitter.com/ChileLibre4)     | [Facebook](https://www.facebook.com/ChileLibre4/)                                            | [Instagram](https://www.instagram.com/chilelibre4/)                | [X](https://15mpedia.org/wiki/Lista_de_medios_de_comunicaci%C3%B3n_alternativos_de_Chile)                      |
| [Verdad Ahora](https://verdadahora.cl/)                                                                                                                     | [Twitter](https://twitter.com/VerdadAhoraCl)   | [Facebook](https://www.facebook.com/VerdadAhoraOficial/)                                     | ❌                                                                  | [X](https://www.ciperchile.cl/2021/03/23/el-ruidoso-silencio-de-los-medios-tradicionales/)                     |
| [Viaconectados](http://viaconectados.cl/)                                                                                                                   | [Twitter](https://twitter.com/viaconectados)   | [Facebook](https://www.facebook.com/Viaconectados/)                                          | [Instagram](https://www.instagram.com/viaconectados/)              | ❌                                                                                                              |
| [Radio La Base](http://radiolabase.cl/)                                                                                                                     | [Twitter](https://twitter.com/radiolabase)     | [Facebook](https://www.facebook.com/radiolabase/)                                            | [Instagram](https://www.instagram.com/radiolabase/)                | ❌                                                                                                              |
| [RadioTV-Liberación](https://radioliberacionprimeralinea.net/)                                                                                              | [Twitter](https://twitter.com/RadioTVLiberaci) | [Facebook](https://www.facebook.com/radiotvliberacion/)                                      | [Instagram](https://www.instagram.com/radiotvliberacion/)          | ❌                                                                                                              |

(Había algunas que son toxicas a cagar, pero la idea al ser no tener prensa exclusiva de una inclinación política (a pesar de que sean """medios de prensa""" manejados por un puro wn publicando puteadas como si fueran noticias) las añadí igual)

### Changed

- Cambio sintaxis scripts para mejor legibilidad
- Nuevas imágenes de ejemplo
- Incorporado "sistema" de versiones
- Medios de prensa "alternativos" en orden alfabético (hasta cierto punto)

## [v0.03]

### Added

- Añadida variación Perú por SanguiNET <https://github.com/SanguiNET/tele>
- Lenguaje español a videojs

### Changed

- Listado canales cambio de formato (por mi sanidad mental) para una más fácil edición
<https://gist.github.com/joyrexus/16041f2426450e73f5df9391f7f7ae5f>
- Actualizado README listado canales
- Actualizado enlace variación por AINMcl <https://github.com/AINMcl/MonitorTV> (cambio "monitores" a "MonitorTV")
- Tabla versiones creadas separada de enlaces encontrados sin relacion al proyecto
- JS canales reducido en un par de líneas
- Al fin me di el tiempo de automatizar la creación de reproductores videojs para los canales m3u8
- Cambio sintaxis variables (var => let) y renombradas algunas igualmente
- Re-organizada estructura archivos proyecto
- Separado canales del resto de scripts
- Biblioteca bootstrap (solo css) ahora dentro de archivos proyecto
- Librerías externas (principales ya que los iframe no) ahora son llamadas desde dentro del repositorio y no de manera externa a otros servidores
- Cambio menor en modal créditos
- Canales tienen un svg de sus banderitas acorde al país donde se origina la transmisión (no todos)
- Actualizado tag href (+nofollow noreferrer)
- Mejora en cuanto a tamaño responsivo con el uso de "clamp" (borrando media queries)
- Solucionado filtro de búsqueda. Ahora permite tildes y letra ñ.
- Cambio posición "nombre-barra" (me molestaba cuando quería leer las noticias que ponen en la barrita más pequeña)
- wena wena

### Removed

- Quitado Font Awesome para iconos, reemplazado con SVG's puros
