/* 
Guía rápida:

    'nombre': {                   (Nombre objeto/canal, no repetir entre señales debe ser único (sin espacios))
        'nombre': 'nombre'        (Nombre del canal a mostrar en botón y barra que dirige a su origen cuando esta activo)

tipos de enlaces posibles [Recordar utilizar solo enlaces https si se aloja en GitHub y solo 1 tipo por canal/señal]:

        'iframe_url': 'url'        (contenido que va dentro de un iframe (un embed directo))
        'm3u8_url': 'url'          (para enlaces ".m3u8", no listas ".m3u". Solo canales individuales)
        'yt_id': 'url'             (ID referente a un canal de Youtube [https://www.youtube.com/channel/"yt_id"]. NO REQUIERE 'fuente' DEBIDO A REDUNDANCIA)
        'yt_embed': 'url'          (se usa para 1 video directamente [https://www.youtube.com/watch?v="yt_embed"])
        'yt_playlist': 'url'       (... [https://www.youtube.com/playlist?list="yt_playlist"])

        'fuente': 'url'           ("fuente" es el enlace de origen de la señal, a modo de transparencia y libertad de abandonar la página si solo se quiere continuar con dicha señal, si se extrae una señal ya sea tipo "iframe" o "m3u8" de www.pagina-ejemplo.cl debe de ponerse www.pagina-ejemplo.cl en "fuente". Si no se obtiene señal desde el emisor oficial como tal, se utiliza el sitio del emisor sobre el de terceros (ejemplo: saque canal de una lista IPTV, por lo que pongo el sitio del canal, no la lista IPTV. Ya que eso va en el listado de canales en archivo README))
        'pais': 'nombre país'     (nombre país es en base a ISO 3166, https://flagcdn.com/en/codes.json (Recomendable en minúsculas))
        'alt_icon': 'icono bootstrap'  (este concepto de icono alternativo se usa mayoritariamente para señales que no pertenece a un país en específico tanto como para quizás segmentar por tipo de señal, si es un canal o una radio. No es obligatorio)
    }

by Alplox 
https://github.com/Alplox/teles
*/

const listaCanalesViejo = {
//Votaciones
    /* 'tips': {
        'nombre': '🗳️ Tips Votaciones',
        'iframe_url': 'https://alplox.github.io/teles/assets/js/archivo.html',
        'fuente': 'https://alplox.github.io/teles/',
        'pais': 'cl'
    },
    'decidechile': {
        'nombre': '🗳️ decidechile.cl',
        'iframe_url': 'https://live.decidechile.cl/',
        'fuente': 'https://live.decidechile.cl/',
        'pais': 'cl'
    },
    'servelelecciones': {
        'nombre': '🗳️ servelelecciones.cl',
        'iframe_url': 'https://servelelecciones.cl/#/votacion/elecciones_constitucion/global/19001',
        'fuente': 'https://servelelecciones.cl/#/votacion/elecciones_constitucion/global/',
        'pais': 'cl'
    },
    'servel': {
        'nombre': '🗳️ Servicio Electoral de Chile',
        'yt_id': 'UCB8s6rETjmWgXrp_BxyXqdg',
        'pais': 'cl'
    }, */
// CHILE
    '24-horas': {
        'nombre': '24 horas',
        'yt_id': 'UCTXNz3gjAypWp3EhlIATEJQ',
        'pais': 'cl'
    },   
    '24-horas-2': {
        'nombre': '24 horas 2',
        'iframe_url': 'https://mdstrm.com/live-stream/57d1a22064f5d85712b20dab?jsapi=true&autoplay=true&volume=0',
        'fuente': 'https://www.24horas.cl/envivo/',
        'pais': 'cl'
    },
    '24-horas-3': {
        'nombre': '24 horas 3',
        'iframe_url': 'https://mdstrm.com/live-stream/57d1a22064f5d85712b20dab?jsapi=true&autoplay=true&controls=true&volume=0&mute=true&player=57f4e28f9c53768535d65782&access_token=&custom.preroll=&custom.overlay=',
        'fuente': 'https://www.24horas.cl/envivo/',
        'pais': 'cl'
    },
    '24-horas-4': {
        'nombre': '24 horas 4',
        'iframe_url': 'https://player.twitch.tv/?channel=24horas_tvn&parent=alplox.github.io',
        'fuente': 'https://www.twitch.tv/24horas_tvn',
        'pais': 'cl'
    },
    'tvn': {
        'nombre': 'TVN',
        'yt_id': 'UCaVaCaiG6qRzDiJDuEGKOhQ',
        'pais': 'cl'
    },
    'tvn-2': {
        'nombre': 'TVN 2',
        'm3u8_url': 'https://mdstrm.com/live-stream-playlist-v/555c9a91eb4886825b07ee7b.m3u8',
        'fuente': 'https://www.24horas.cl/envivo/',
        'pais': 'cl'
    },
    'meganoticias': {
        'nombre': 'Meganoticias',
        'yt_id': 'UCkccyEbqhhM3uKOI6Shm-4Q',
        'pais': 'cl'
    },
    'meganoticias-2': {
        'nombre': 'Meganoticias 2',
        'iframe_url': 'https://player.twitch.tv/?channel=meganoticiascl&parent=alplox.github.io',
        'fuente': 'https://www.twitch.tv/meganoticiascl',
        'pais': 'cl'
    },
    'meganoticias-3': {
        'nombre': 'Meganoticias 3',
        'iframe_url': 'https://mdstrm.com/live-stream/561430ae330428c223687e1e?autoplay=true&volume=0',
        'fuente': 'https://www.meganoticias.cl/senal-en-vivo/meganoticias/',
        'pais': 'cl'
    },
    'meganoticias-4': {
        'nombre': 'Meganoticias 4',
        'iframe_url': 'https://rudo.video/live/mega?volume=0&mute=1',
        'fuente': 'https://www.meganoticias.cl/senal-en-vivo/meganoticias/',
        'pais': 'cl'
    },
    'mega': {
        'nombre': 'Mega',
        'm3u8_url': 'https://unlimited1-cl-isp.dps.live/mega/mega.smil/playlist.m3u8',
        'fuente': 'https://www.mega.cl/',
        'pais': 'cl'
    },
    't13': {
        'nombre': 'T13',
        'yt_id': 'UCsRnhjcUCR78Q3Ud6OXCTNg',
        'pais': 'cl'
    },
    't13-2': {
        'nombre': 'T13 2',
        'iframe_url': 'https://player.twitch.tv/?channel=t13envivo&parent=alplox.github.io',
        'fuente': 'https://www.twitch.tv/t13envivo',
        'pais': 'cl'
    },
    't13-3': {
        'nombre': 'T13 3',
        'm3u8_url': 'https://redirector.rudo.video/hls-video/10b92cafdf3646cbc1e727f3dc76863621a327fd/t13/t13.smil/playlist.m3u8',
        'fuente': 'https://www.t13.cl/en-vivo',
        'pais': 'cl'
    },
    't13-4': {
        'nombre': 'T13 4',
        'iframe_url': 'https://rudo.video/live/t13?volume=0&mute=1',
        'fuente': 'https://www.t13.cl/en-vivo',
        'pais': 'cl'
    },
    'canal-13': {
        'nombre': 'Canal 13',
        'iframe_url': 'https://rudo.video/live/c13?volume=0&mute=1',
        'fuente': 'https://www.13.cl/en-vivo',
        'pais': 'cl'
    },
    'canal-13-2': {
        'nombre': 'Canal 13 2',
        'm3u8_url': 'https://jireh-hls-live-video.dpsgo.com/hls-video/10b92cafdf3646cbc1e727f3dc76863621a327fd/c13/playlist.m3u8',
        'fuente': 'https://www.13.cl/en-vivo',
        'pais': 'cl'
    },
    'canal-13-3': {
        'nombre': 'Canal 13 3',
        'm3u8_url': 'https://dai.google.com/linear/hls/pa/event/bFL1IVq9RNGlWQaqgiFuNw/stream/529d29eb-8117-44d3-9e21-cdfd68c3c097:MRN2/master.m3u8',
        'fuente': 'https://www.13.cl/en-vivo',
        'pais': 'cl'
    },
    'cnn-cl': {
        'nombre': 'CNN Chile',
        'yt_id': 'UCpOAcjJNAp0Y0fhznRrXIJQ',
        'pais': 'cl'
    },
    'chv-noticias': {
        'nombre': 'CHV Noticias',
        'yt_id': 'UCRsUoZYC1ULUspipMRnMhwg',
        'pais': 'cl'
    },
    'chv-noticias-2': {
        'nombre': 'CHV Noticias 2',
        'm3u8_url': 'https://redirector.rudo.video/hls-video/10b92cafdf3646cbc1e727f3dc76863621a327fd/chvn/chvn.smil/playlist.m3u8?DVR',
        'fuente': 'https://www.chvnoticias.cl/senal-online/',
        'pais': 'cl'
    },
    'chv-noticias-3': {
        'nombre': 'CHV Noticias 3',
        'iframe_url': 'https://rudo.video/live/chvn?volume=0&mute=1',
        'fuente': 'https://www.chvnoticias.cl/senal-online/',
        'pais': 'cl'
    },
    'chv': {
        'nombre': 'CHV',
        'yt_id': 'UC8EdTmyUaFIfZvVttJ9lgIA',
        'pais': 'cl'
    },
    'chv-2': {
        'nombre': 'CHV 2',
        'm3u8_url': 'https://scl.edge.grupoz.cl/transmision/live/playlist.m3u8',
        'fuente': 'https://www.chilevision.cl/senal-online',
        'pais': 'cl'
    },
    'la-red': {
        'nombre': 'La Red',
        'm3u8_url': 'https://unlimited1-cl-isp.dps.live/lared/lared.smil/playlist.m3u8',
        'fuente': 'https://www.lared.cl/senal-online',
        'pais': 'cl'
    },
    'la-red-2': {
        'nombre': 'La Red 2',
        'iframe_url': 'https://rudo.video/live/lared?volume=0&mute=1',
        'fuente': 'https://www.lared.cl/senal-online',
        'pais': 'cl'
    },
// RADIOS
    'cooperativa': {
        'nombre': 'Radio Cooperativa',
        'iframe_url': 'https://rudo.video/live/coopetv?volume=0&mute=1',
        'fuente': 'http://programas.cooperativa.cl/showalairelibre/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'bbtv': {
        'nombre': 'Radio Biobio TV',
        'iframe_url': 'https://rudo.video/live/bbtv?volume=0&mute=1',
        'fuente': 'https://www.biobiochile.cl/biobiotv/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'adn': {
        'nombre': 'Radio ADN',
        'iframe_url': 'https://rudo.video/live/adntv?volume=0&mute=1',
        'fuente': 'http://tv.adnradio.cl/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'adn-2': {
        'nombre': 'Radio ADN 2',
        'yt_id': 'UCczkrFICr0xEgDsk51zZojA',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'duna': {
        'nombre': 'Radio Duna',
        'iframe_url': 'https://rudo.video/live/dunatv?volume=0&mute=1',
        'fuente': 'https://www.duna.cl/tv/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'infinita': {
        'nombre': 'Radio Infinita',
        'iframe_url': 'https://mdstrm.com/live-stream/63a066e54ed536087960b550?autoplay=true&player=63af7b6cc5048f0846557764',
        'fuente': 'http://www.infinita.cl/home/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'universo': {
        'nombre': 'Radio Universo',
        'iframe_url': 'https://redirector.dps.live/universo/aac/icecast.audio',
        'fuente': 'https://www.universo.cl/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'radio-ae': {
        'nombre': 'Radio AE Radio DuocUC',
        'iframe_url': 'https://live.grupoz.cl/3e3852b5c1ea7821ab9cdfadbbe735f2?sound=0',
        'fuente': 'https://www.aeradio.cl/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'carolina-tv': {
        'nombre': 'Radio Carolina TV',
        'iframe_url': 'https://mdstrm.com/live-stream/63a06468117f42713374addd?autoplay=true&player=63af7b6cc5048f0846557764',
        'fuente': 'https://www.carolina.cl/tv/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'romantica-tv': {
        'nombre': 'Radio Romántica TV',
        'iframe_url': 'https://mdstrm.com/live-stream/63a0674c1137d408b45d4821?autoplay=true&player=63af7b6cc5048f0846557764',
        'fuente': 'https://www.romantica.cl/romantica-tv/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'radio-genial': {
        'nombre': 'Radio Genial 100.5 FM',
        'm3u8_url': 'https://v1.tustreaming.cl:19360/genialtv/genialtv.m3u8',
        'fuente': 'https://radiogenial.cl/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'radio-la-clave': {
        'nombre': 'Radio La Clave',
        'iframe_url': 'https://rudo.video/live/laclavetv?volume=0&mute=1',
        'fuente': 'https://radiolaclave.cl/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'radio-el-conquistador': {
        'nombre': 'Radio El Conquistador FM',
        'm3u8_url': 'https://redirector.rudo.video/hls-video/931b584451fa6dd1313ee66efbfd5802e3f3bcea/elconquistadortv/elconquistadortv.smil/playlist.m3u8',
        'fuente': 'https://www.elconquistadorfm.net/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },  
    'radio-el-conquistador-2': {
        'nombre': 'Radio El Conquistador FM 2',
        'iframe_url': 'https://rudo.video/live/elconquistadortv?volume=0&mute=1',
        'fuente': 'https://www.elconquistadorfm.net/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    }, 
    'radio-el-conquistador-3': {
        'nombre': 'Radio El Conquistador FM 3',
        'iframe_url': 'https://player.twitch.tv/?channel=elconquistadortv&parent=alplox.github.io',
        'fuente': 'https://www.twitch.tv/elconquistadortv',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    }, 
    'radio-folclor-chile': {
        'nombre': 'Radio Folclor de Chile',
        'yt_id': 'UC0Hl8kJe8Xwv8g63Q4qefQg',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'sembrador': {
        'nombre': 'Radio El Sembrador',
        'm3u8_url': 'https://tv.streaming-chile.com:1936/elsembrador/elsembrador/playlist.m3u8',
        'fuente': 'https://tv.radioelsembrador.cl/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'radio-nuble': {
        'nombre': 'Radio Ñuble',
        'm3u8_url': 'https://live.tvcontrolcp.com:1936/rnuble/rnuble/playlist.m3u8',
        'fuente': 'https://radionuble.cl/v1/',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'alternativa-fm': {
        'nombre': 'Radio Alternativa FM',
        'm3u8_url': 'https://5eaccbab48461.streamlock.net:1936/8216/8216/playlist.m3u8',
        'fuente': 'https://www.alternativafm.cl/p/alternativa-tv.html',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
// canales generales
    'stgo-tv': {
        'nombre': 'Stgo TV',
        'm3u8_url': 'https://stv4.janus.cl/playlist/stream.m3u8',
        'fuente': 'https://www.santiagotelevision.cl/',
        'pais': 'cl'
    },
    'tv-mas': {
        'nombre': 'TV+',
        'm3u8_url': 'https://mdstrm.com/live-stream-playlist/5c0e8b19e4c87f3f2d3e6a59.m3u8',
        'fuente': 'https://www.tvmas.tv/',
        'pais': 'cl'
    },
    'tv-mas-2': {
        'nombre': 'TV+ 2',
        'iframe_url': 'https://mdstrm.com/live-stream/5c0e8b19e4c87f3f2d3e6a59?autoplay=true&volume=0',
        'fuente': 'https://www.tvmas.tv/',
        'pais': 'cl'
    },
    'voz-sobran': {
        'nombre': 'La Voz De Los Que Sobran',
        'iframe_url': 'https://rudo.video/live/lvdlqs?volume=0&mute=1',
        'fuente': 'https://lavozdelosquesobran.cl/',
        'pais': 'cl'
    },
    'puranoticia': {
        'nombre': 'Puranoticia TV',
        'm3u8_url': 'https://pnt.janusmedia.tv/hls/pnt.m3u8',
        'fuente': 'https://puranoticia.pnt.cl/',
        'pais': 'cl'
    },
    'holvoet-tv': {
        'nombre': 'Holvoet TV',
        'iframe_url': 'https://rudo.video/live/holvoettv?volume=0&mute=1',
        'fuente': 'https://holvoet.cl/en-vivo/',
        'pais': 'cl'
    },
    'holvoet-tv-2': {
        'nombre': 'Holvoet TV 2',
        'm3u8_url': 'https://unlimited1-cl-isp.dps.live/holvoettv/holvoettv.smil/playlist.m3u8',
        'fuente': 'https://holvoet.cl/en-vivo/',
        'pais': 'cl'
    },
    'antofagasta-tv': {
        'nombre': 'Antofagasta TV',
        'm3u8_url': 'https://unlimited6-cl.dps.live/atv/atv.smil/atv/livestream2/playlist.m3u8',
        'fuente': 'https://www.antofagasta.tv/',
        'pais': 'cl'
    },
    'antofagasta-tv-2': {
        'nombre': 'Antofagasta TV 2',
        'm3u8_url': 'https://unlimited1-cl-isp.dps.live/atv/atv.smil/playlist.m3u8',
        'fuente': 'https://www.antofagasta.tv/',
        'pais': 'cl'
    },
    'antofagasta-tv-3': {
        'nombre': 'Antofagasta TV 3',
        'm3u8_url': 'https://unlimited6-cl.dps.live/atv/atv.smil/playlist.m3u8',
        'fuente': 'https://www.antofagasta.tv/',
        'pais': 'cl'
    },
    'atacama-tv': {
        'nombre': 'Atacama TV',
        'm3u8_url': 'https://v2.tustreaming.cl/atacamatv/index.m3u8',
        'fuente': 'http://atacamatelevision.com/',
        'pais': 'cl'
    },
    'atacama-tv-2': {
        'nombre': 'Atacama TV 2',
        'm3u8_url': 'https://v2.tustreaming.cl/atacamatv/tracks-v1a1/mono.m3u8',
        'fuente': 'http://atacamatelevision.com/',
        'pais': 'cl'
    },
    'canal-9': {
        'nombre': 'Canal 9',
        'iframe_url': 'https://rudo.video/live/c9?volume=0&mute=1',
        'fuente': 'https://www.canal9.cl/en-vivo/',
        'pais': 'cl'
    },
    'canal-9-2': {
        'nombre': 'Canal 9 2',
        'm3u8_url': 'https://unlimited6-cl.dps.live/c9/c9.smil/c9/livestream1/chunks.m3u8',
        'fuente': 'https://www.canal9.cl/en-vivo/',
        'pais': 'cl'
    },
    'tvu': {
        'nombre': 'TVU',
        'iframe_url': 'https://rudo.video/live/tvu?volume=0&mute=1',
        'fuente': 'https://www.tvu.cl/',
        'pais': 'cl'
    },
    'tvu-2': {
        'nombre': 'TVU 2',
        'm3u8_url': 'https://unlimited6-cl.dps.live/tvu/tvu.smil/playlist.m3u8',
        'fuente': 'https://www.tvu.cl/',
        'pais': 'cl'
    },
    'canal-21': {
        'nombre': 'Canal 21',
        'm3u8_url': 'https://tls-cl.cdnz.cl/canal21tv/live/playlist.m3u8',
        'fuente': 'https://www.canal21tv.cl/wp/en-vivo/',
        'pais': 'cl'
    },
    'canal-21-2': {
        'nombre': 'Canal 21 2',
        'm3u8_url': 'https://tls-cl.cdnz.cl/canal21tv/live/playlist.m3u8',
        'fuente': 'https://www.canal21tv.cl/wp/en-vivo/',
        'pais': 'cl'
    },
    'nublevision': {
        'nombre': 'Ñublevision',
        'm3u8_url': 'https://v1.tustreaming.cl/nubletv/index.m3u8',
        'fuente': 'https://nublevision.cl/',
        'pais': 'cl'
    },
    'nuble-RTV': {
        'nombre': 'Ñuble RVT',
        'm3u8_url': 'https://paneltv.online:1936/8050/8050/playlist.m3u8',
        'fuente': 'https://canalrtv.cl/',
        'pais': 'cl'
    },
    'pinguino-tv': {
        'nombre': 'Pingüino TV',
        'iframe_url': 'https://elpinguino.com/reproductor/',
        'fuente': 'https://elpinguino.com/reproductor/',
        'pais': 'cl'
    },
    'pinguino-tv-2': {
        'nombre': 'Pingüino TV 2',
        'm3u8_url': 'https://streaming.elpinguino.com:5391/live/EP.smil/playlist.m3u8',
        'fuente': 'https://elpinguino.com/reproductor/',
        'pais': 'cl'
    },
    'itv-patagonia': {
        'nombre': 'ITV Patagonia',
        'iframe_url': 'https://rudo.video/live/itv?volume=0&mute=1',
        'fuente': 'https://www.itvpatagonia.com/',
        'pais': 'cl'
    },
    'itv-patagonia-2': {
        'nombre': 'ITV Patagonia 2',
        'm3u8_url': 'https://unlimited1-cl-isp.dps.live/itv/itv.smil/playlist.m3u8',
        'fuente': 'https://www.itvpatagonia.com/',
        'pais': 'cl'
    },
    'ucv': {
        'nombre': 'UCV TV',
        'iframe_url': 'https://rudo.video/live/ucvtv2?volume=0&mute=1',
        'fuente': 'https://pucvmultimedios.cl/senal-online-tv.php',
        'pais': 'cl'
    },
    'uatv': {
        'nombre': 'UATV',
        'iframe_url': 'https://rudo.video/live/uatv?volume=0&mute=1',
        'fuente': 'https://uatv.cl/uatv-en-vivo/',
        'pais': 'cl'
    },
    'vtv': {
        'nombre': 'VTV',
        'iframe_url': 'https://rudo.video/live/vtv?volume=0&mute=1',
        'fuente': 'http://canalvtv.cl/vtv/',
        'pais': 'cl'
    },
    'canal-33': {
        'nombre': 'Canal 33',
        'm3u8_url': 'https://oracle.streaminghd.cl/eduardo555/eduardo555/playlist.m3u8',
        'fuente': 'http://www.canal33.cl/online.php',
        'pais': 'cl'
    },
    'contivision': {
        'nombre': 'Contivision',
        'iframe_url': 'https://rudo.video/live/cm?volume=0&mute=1',
        'fuente': 'http://w.contivision.cl/cvn/envivo.php',
        'pais': 'cl'
    },
    'osorno-tv': {
        'nombre': 'Osorno TV',
        'm3u8_url': 'https://panel.tvstream.cl:1936/8036/8036/playlist.m3u8',
        'fuente': 'https://www.osornotv.cl/envivo.html',
        'pais': 'cl'
    },
    'tv-salud': {
        'nombre': 'TV Salud',
        'iframe_url': 'https://panel.miplay.cl:8081/tvsalud/embed.html',
        'fuente': 'https://tvsalud.cl/',
        'pais': 'cl'
    },
// ARGENTINA
    'tn': {
        'nombre': 'Todonoticias',
        'yt_id': 'UCj6PcyLvpnIRT_2W_mwa9Aw',
        'pais': 'ar'
    },
    'c5n': {
        'nombre': 'C5N',
        'yt_id': 'UCFgk2Q2mVO1BklRQhSv6p0w',
        'pais': 'ar'
    },
    'net-tv': {
        'nombre': 'Net TV',
        'iframe_url': 'https://rudo.video/live/nettv?volume=0&mute=1',
        'fuente': 'https://www.canalnet.tv/page/senal-en-vivo',
        'pais': 'ar'
    },
    'tv-publica-arg': {
        'nombre': 'Televisión Pública',
        'yt_id': 'UCs231K71Bnu5295_x0MB5Pg',
        'pais': 'ar'
    },
    'cronica-tv': {
        'nombre': 'Crónica TV',
        'yt_id': 'UCT7KFGv6s2a-rh2Jq8ZdM1g',
        'pais': 'ar'
    },
    'la-nacion': {
        'nombre': 'LA NACION',
        'yt_id': 'UCba3hpU7EFBSk817y9qZkiA',
        'pais': 'ar'
    },
    'canal-26': {
        'nombre': 'Canal 26',
        'yt_id': 'UCrpMfcQNog595v5gAS-oUsQ',
        'pais': 'ar'
    },
// COLOMBIA
    'el-tiempo': {
        'nombre': 'EL TIEMPO',
        'yt_id': 'UCe5-b0fCK3eQCpwS6MT0aNw',
        'pais': 'co'
    },
// PERU
    'tv-peru': {
        'nombre': 'TVPerú Noticias',
        'yt_id': 'UCkZCoc42IipR1ucqJmIehsA',
        'pais': 'pe'
    },  
    'panamericana-tv': {
        'nombre': 'Panamericana TV',
        'iframe_url': 'https://geo.dailymotion.com/player/x5poh.html?video=x774s7s&autoplay=true&volume=0',
        'fuente': 'https://panamericana.pe/tvenvivo',
        'pais': 'pe'
    },
    'onda-digital-tv': {
        'nombre': 'Onda Digital TV',
        'm3u8_url': 'https://v4.tustreaming.cl:443/odtvgo/index.m3u8',
        'fuente': 'https://ondadigitaltv.com',
        'pais': 'pe'
    },
    'onda-digital-tv-2': {
        'nombre': 'Onda Digital TV 2',
        'm3u8_url': 'https://tv.ondadigital.pe:1936/ondatv2/ondatv2/playlist.m3u8',
        'fuente': 'https://ondadigitaltv.com',
        'pais': 'pe'
    },
    'la-republica': {
        'nombre': 'La República',
        'yt_id': 'UC-B7Xv56uNRDkj0vC3QW8Cg',
        'pais': 'pe'
    },
    'willax': {
        'nombre': 'Willax',
        'iframe_url': 'https://geo.dailymotion.com/player/x5poh.html?video=x7x4dgx&autoplay=true&volume=0',
        'fuente': 'https://willax.tv/en-vivo/',
        'pais': 'pe'
    },
    'latina-noticias': {
        'nombre': 'Latina Noticias',
        'yt_id': 'UCpSJ5fGhmAME9Kx2D3ZvN3Q',
        'pais': 'pe'
    },
    'ovacion-tv': {
        'nombre': 'Radio Ovación TV',
        'm3u8_url': 'https://5c3fb01839654.streamlock.net:1963/iptvovacion1/liveovacion1tv/playlist.m3u8',
        'fuente': 'https://ovacion.pe/radio',
        'pais': 'pe',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'san-borja': {
        'nombre': 'Radio San Borja Tv',
        'm3u8_url': 'https://5c3fb01839654.streamlock.net:1963/iptvsanborja/livesanborjatv/playlist.m3u8',
        'fuente': 'https://radiosanborjatv.com/',
        'pais': 'pe',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'radio-onda-digital': {
        'nombre': 'Radio Onda Digital',
        'm3u8_url': 'https://tv.ondadigital.pe:1936/ondatv2/ondatv2/playlist.m3u8',
        'fuente': 'https://www.ondadigital.pe/',
        'pais': 'pe',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'radio-tropical': {
        'nombre': 'Radio Tropical',
        'm3u8_url': 'https://videoserver.tmcreativos.com:19360/raditropical/raditropical.m3u8',
        'fuente': 'https://radiotropical.pe/',
        'pais': 'pe',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
    'radio-uno': {
        'nombre': 'Radio Uno',
        'yt_id': 'UCK0lpuL9PQb3I5CDcu7Y7bA',
        'pais': 'pe',
        'alt_icon': '<i class="bi bi-boombox"></i>'
    },
// VENEZUELA
    'globovision': {
        'nombre': 'Globovisión En Vivo',
        'yt_id': 'UCfJtBtmhnIyfUB6RqXeImMw',
        'pais': 've'
    },
// HONDURAS
    'hch-vivo': {
        'nombre': 'HCH En Vivo',
        'yt_id': 'UCIs6fmAXOI1K2jgkoBdWveg',
        'pais': 'hn'
    },        
// ESPAÑA
    'rtve': {
        'nombre': 'RTVE Noticias',
        'yt_id': 'UC7QZIf0dta-XPXsp9Hv4dTw',
        'pais': 'es'
    },
// CANADÁ
    'global-news': {
        'nombre': 'Global News',
        'm3u8_url': 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8',
        'fuente': 'https://globalnews.ca/live/national/',
        'pais': 'ca'
    },
// ESTADOS UNIDOS
    'abc7-swfl': {
        'nombre': 'ABC7 SWFL',
        'yt_id': 'UCq9e_hCv2jvgck8WowW1NXg',
        'pais': 'us'
    },
    'abc-news': {
        'nombre': 'ABC News',
        'm3u8_url': 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8',
        'fuente': 'https://abcnews.go.com/Live',
        'pais': 'us'
    },
    'agenda-free-tv': {
        'nombre': 'Agenda-Free TV',
        'yt_id': 'UCshCsg1YVKli8yBai-wa78w',
        'pais': 'us'
    },
    'agenda-free-tv-tw': {
        'nombre': 'Agenda-Free TV 2',
        'iframe_url': 'https://player.twitch.tv/?channel=agendafreetv&parent=alplox.github.io',
        'fuente': 'https://www.twitch.tv/agendafreetv',
        'pais': 'us'
    },
    'bloomberg-us': {
        'nombre': 'Bloomberg US',
        'm3u8_url': 'https://www.bloomberg.com/media-manifest/streams/phoenix-us.m3u8',
        'fuente': 'https://www.bloomberg.com/',
        'pais': 'us'
    },
    'bloomberg-europe': {
        'nombre': 'Bloomberg Europe',
        'm3u8_url': 'https://www.bloomberg.com/media-manifest/streams/eu.m3u8',
        'fuente': 'https://www.bloomberg.com/europe',
        'pais': 'us'
    },
    'bloomberg-quicktake': {
        'nombre': 'Bloomberg QuickTake',
        'm3u8_url': 'https://www.bloomberg.com/media-manifest/streams/qt.m3u8',
        'fuente': 'https://www.bloomberg.com/',
        'pais': 'us'
    },
    'cheddar': {
        'nombre': 'Cheddar',
        'm3u8_url': 'https://livestream.chdrstatic.com/b93e5b0d43ea306310a379971e384964acbe4990ce193c0bd50078275a9a657d/cheddar-42620/cheddarweblive/cheddar/primary/2.m3u8',
        'fuente': 'https://cheddar.com/live',
        'pais': 'us'
    },
    'cbsn': {
        'nombre': 'CBSN',
        'm3u8_url': 'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648e8f134e82a470f83d562deeca/master_11.m3u8',
        'fuente': 'https://www.cbsnews.com/live/',
        'pais': 'us'
    },
    'fox-news-now': {
        'nombre': 'Fox News Now',
        'm3u8_url': 'https://fox-foxnewsnow-samsungus.amagi.tv/playlist.m3u8',
        'fuente': 'https://video.foxnews.com/v/6174103160001',
        'pais': 'us'
    },
    'newsmax': {
        'nombre': 'Newsmax',
        'yt_id': 'UCx6h-dWzJ5NpAlja1YsApdg',
        'pais': 'us'
    },
    'nbc-news': {
        'nombre': 'NBC News',
        'yt_id': 'UCeY0bbntWzzVIaj2z3QigXg',
        'pais': 'us'
    },
    'telemundo': {
        'nombre': 'Noticias Telemundo',
        'yt_id': 'UCRwA1NUcUnwsly35ikGhp0A',
        'pais': 'us'
    },
// FRANCIA        
    'euronews-esp': {
        'nombre': 'euronews (Español)',
        'yt_id': 'UCyoGb3SMlTlB8CLGVH4c8Rw',
        'pais': 'fr'
    },
    'euronews-eng': {
        'nombre': 'euronews (English)',
        'yt_id': 'UCSrZ3UV4jOidv8ppoVuvW9Q',
        'pais': 'fr'
    },
    'euronews-rus': {
        'nombre': 'euronews Русский',
        'yt_id': 'UCFzJjgVicCtFxJ5B0P_ei8A',
        'pais': 'fr'
    },
    'euronews-hun': {
        'nombre': 'euronews (magyarul)',
        'yt_id': 'UC4Ct8gIf9f0n4mdyGsFiZRA',
        'pais': 'fr'
    },
    'france-24-esp': {
        'nombre': 'FRANCE 24 Español',
        'yt_id': 'UCUdOoVWuWmgo1wByzcsyKDQ',
        'pais': 'fr'
    },
    'france-24-eng': {
        'nombre': 'FRANCE 24 English',
        'yt_id': 'UCQfwfsi5VrQ8yKZ-UWmAEFg',
        'pais': 'fr'
    },
    'france-info': {
        'nombre': 'franceinfo',
        'yt_id': 'UCO6K_kkdP-lnSCiO3tPx7WA',
        'pais': 'fr'
    },
// ALEMANIA
    'dw-news': {
        'nombre': 'DW News',
        'yt_id': 'UCknLrEdhRCp1aegoMqRaCZg',
        'pais': 'de'
    },
    'dw-arabic': {
        'nombre': 'DW عربية',
        'yt_id': 'UC30ditU5JI16o5NbFsHde_Q',
        'pais': 'de'
    },
    'welt': {
        'nombre': 'WELT',
        'yt_id': 'UCZMsvbAhhRblVGXmEXW8TSA',
        'pais': 'de'
    },
// UCRANIA
    '24-Канал-онлайн': {
        'nombre': '24 Канал онлайн',
        'yt_id': 'UCja992VI_u2e52c9FHQXw5A',
        'pais': 'ua'
    },
    'UA-Перший': {
        'nombre': 'UA:Перший',
        'yt_id': 'UCPY6gj8G7dqwPxg9KwHrj5Q',
        'pais': 'ua'
    },
// CHINA
    'live-chino-3': {
        'nombre': '三立iNEWS',
        'yt_id': 'UCoNYj9OFHZn3ACmmeRCPwbA',
        'pais': 'cn'
    },
    'live-chino-4': {
        'nombre': '中視新聞 HD直播頻道',
        'yt_id': 'UCmH4q-YjeazayYCVHHkGAMA',
        'pais': 'cn'
    },
    'live-chino-5': {
        'nombre': '華視新聞 CH52',
        'yt_id': 'UCDCJyLpbfgeVE9iZiEam-Kg',
        'pais': 'cn'
    },
    'cgtn': {
        'nombre': 'CGTN',
        'm3u8_url': 'https://live.cgtn.com/1000/prog_index.m3u8',
        'fuente': 'https://www.cgtn.com/',
        'pais': 'cn'
    },
// JAPON
    'nhk-world': {
        'nombre': 'NHK World',
        'm3u8_url': 'https://nhkworld.webcdn.stream.ne.jp/www11/nhkworld-tv/global/2003458/live.m3u8',
        'fuente': 'https://www3.nhk.or.jp/nhkworld/en/live/',
        'pais': 'jp'
    },
// TURQUIA
    'trt-world': {
        'nombre': 'TRT World',
        'yt_id': 'UC7fWeaHhqgM4Ry-RMpM2YYw',
        'pais': 'tr'
    },
// CATAR
    'al-jazeera-english': {
        'nombre': 'Al Jazeera English',
        'yt_id': 'UCNye-wNBqNL5ZzHSJj3l8Bg',
        'pais': 'qa'
    },
    'al-jazeera-english-2': {
        'nombre': 'AlJazeera Channel English 2',
        'm3u8_url': 'https://live-hls-web-aje.getaj.net/AJE/03.m3u8',
        'fuente': 'https://www.aljazeera.com/live/',
        'pais': 'qa'
    },
    'al-jazeera-arabe': {
        'nombre': 'AlJazeera Channel قناة الجزيرة',
        'yt_id': 'UCfiwzLy-8yKzIbsmZTzxDgw',
        'pais': 'qa'
    },
// SINGAPUR
    'cna': {
        'nombre': 'CNA',
        'yt_id': 'UC83jt4dlz1Gjl58fzQrrKZg',
        'pais': 'sg'
    },
// AUSTRALIA
    'abc-news-au': {
        'nombre': 'ABC News AU',
        'm3u8_url': 'https://abc-iview-mediapackagestreams-2.akamaized.net/out/v1/6e1cc6d25ec0480ea099a5399d73bc4b/index.m3u8',
        'fuente': 'https://www.abc.net.au/news/',
        'pais': 'au'
    },
// VARIOS ???
    'naciones-unidas': {
        'nombre': 'Naciones Unidas',
        'yt_id': 'UC5O114-PQNYkurlTg6hekZw',
    },
// MUSICA 24/7
    'lofi-girl': {
        'nombre': 'Lofi Girl',
        'yt_embed': 'jfKfPfyJRdk',
        'fuente': 'https://www.youtube.com/channel/UCSJ4gkVC6NrvII8umztf0Ow',
        'alt_icon': '<i class="bi bi-music-note-beamed"></i>'
    },
    'chillhop': {
        'nombre': 'Chillhop',
        'yt_embed': '1KlXpm1Cyik',
        'fuente': 'https://www.youtube.com/channel/UCOxqgCwgOqC2lMqC5PYz_Dg',
        'alt_icon': '<i class="bi bi-music-note-beamed"></i>'
    },
    'steezyasfuck': {
        'nombre': 'Steezyasfuck',
        'yt_embed': 'lP26UCnoH9s',
        'fuente': 'https://www.youtube.com/channel/UCsIg9WMfxjZZvwROleiVsQg',
        'alt_icon': '<i class="bi bi-music-note-beamed"></i>'
    },
    'doom-radio': {
        'nombre': 'Doom Radio',
        'yt_id': 'UCR2D48i5MCMYwVKbgYIAftQ',
        'alt_icon': '<i class="bi bi-music-note-beamed"></i>'
    },
    'acidjazz': {
        'nombre': 'AcidJazz',
        'yt_embed': 'zgp-WTwmDJg',
        'fuente': 'https://www.youtube.com/channel/UC8cRYBn-z6y1EOUeMdJ0VHA',
        'alt_icon': '<i class="bi bi-music-note-beamed"></i>'
    },
    'darkwave': {
        'nombre': 'The 80s Guy',
        'yt_id': 'UC6ghlxmJNMd8BE_u1HR-bTg',
        'alt_icon': '<i class="bi bi-music-note-beamed"></i>'
    },
    'chill-with-taiki': {
        'nombre': 'Chill with Taiki',
        'yt_embed': 'qH3fETPsqXU',
        'fuente': 'https://www.youtube.com/channel/UCKdURsjh1xT1vInYBy82n6g',
        'alt_icon': '<i class="bi bi-music-note-beamed"></i>'
    },
    'college-music': {
        'nombre': 'College Music',
        'yt_embed': 'QwXHcgZUnFI',
        'fuente': 'https://www.youtube.com/channel/UCWzZ5TIGoZ6o-KtbGCyhnhg',
        'alt_icon': '<i class="bi bi-music-note-beamed"></i>'
    },
// CAMARAS MUNDO
// Chile
    'galeria-cima': {
        'nombre': 'Galería CIMA',
        'yt_id': 'UC4GOcOKkEefz5NamN4WyMFg',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
    'parquemet-cumbre': {
        'nombre': 'Halcón Parquemet, Cumbre',
        'iframe_url': 'https://g1.ipcamlive.com/player/player.php?alias=5a7084c9e0136&autoplay=true',
        'fuente': 'https://halcon.parquemet.cl/index.html',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
    'parquemet-terraza': {
        'nombre': 'Halcón Parquemet, Terraza',
        'iframe_url': 'https://g1.ipcamlive.com/player/player.php?alias=5a7085fe914c0&autoplay=true',
        'fuente': 'https://halcon.parquemet.cl/index.html',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
    'muni-osorno': {
        'nombre': 'Municipalidad Osorno',
        'yt_id': 'UCD7sqegDNyZxmdnCj6xqH6g',
        'pais': 'cl',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
//  Argentina
    'obelisco': {
        'nombre': 'FourSeasons BuenosAires',
        'yt_id': 'UCCkRwmztPEvut3gpsgmCmzw',
        'pais': 'ar',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
    'puente-gral-belgrano': {
        'nombre': 'SISE Argentina',
        'yt_id': 'UC2RkL2eATR1V6H8g4eNfA5Q',
        'pais': 'ar',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
// EEUU
    'times-square': {
        'nombre': 'Times Square Live 4K',
        'yt_embed': 'UVftxDFol90',
        'fuente': 'https://www.youtube.com/channel/UC6qrG3W8SMK0jior2olka3g',
        'pais': 'us',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
    'puente-brooklyn': {
        'nombre': 'St. George Tower',
        'yt_embed': 'TMqfF1WRJc0',
        'fuente': 'https://www.youtube.com/channel/UCp1ojgNJ8mNWdMDsdcMRA2Q',
        'pais': 'us',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
    'bryant-park': {
        'nombre': 'Bryant Park NYC',
        'yt_id': 'UC6AlfoRUeH4B1an_R5YSSTw',
        'pais': 'us',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
    'george-washington-bridge': {
        'nombre': 'Fort Lee Today On Demand',
        'yt_id': 'UChQ5P-kHBZpH20EnXm9X0YQ',
        'pais': 'us',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },

// Japon
    'RailCam': {
        'nombre': 'Aoba traffics',
        'yt_id': 'UCynDLZ-YJnrMLSQvwYi-bUA',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
    'hawaii-livecam': {
        'nombre': 'Aqualink Hawaii',
        'yt_id': 'UCTLF36lXVM7uiR-VolWHv0Q',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
    'daily-seoul': {
        'nombre': 'Daily Seoul Live Camera - Hangang',
        'yt_id': 'UCQKQTgZJo3PlxA-9V1Z51XA',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
// aleatorio
    'camaras-aleatorias': {
        'nombre': 'Boston and Maine Live',
        'yt_embed': 'cUk-Xvlfs1I',
        'fuente': 'https://www.youtube.com/channel/UC8gbWbcNNyb5-NIXvFklkOA',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
    'namibiacam': {
        'nombre': 'NamibiaCam',
        'yt_id': 'UC9X6gGKDv2yhMoofoeS7-Gg',
        'alt_icon': '<i class="bi bi-camera"></i>'
    },
// ESPACIO
    'nasa': {
        'nombre': 'NASA Live',
        'yt_embed': '21X5lGlDOfg',
        'fuente': 'https://www.youtube.com/watch?v=21X5lGlDOfg',
        'alt_icon': '<i class="bi bi-rocket"></i>'
    },
    'spacex': {
        'nombre': 'SpaceX',
        'yt_id': 'UCtI0Hodo5o5dUb67FeUjDeA',
        'alt_icon': '<i class="bi bi-rocket"></i>'
    },
    'blue-origin': {
        'nombre': 'Blue Origin',
        'yt_id': 'UCVxTHEKKLxNjGcvVaZindlg',
        'alt_icon': '<i class="bi bi-rocket"></i>'
    },
    'virgin-galactic': {
        'nombre': 'Virgin Galactic',
        'yt_id': 'UClcvOr7LV8tlJwJvkNMmnKg',
        'alt_icon': '<i class="bi bi-rocket"></i>'
    },
// SERIES
    'bob-ross': {
        'nombre': 'Bob Ross (Todas las Temporadas)',
        'yt_playlist': 'PLaLOVNqqD-2HgiA-GZyzcfZN9n-YelhB5',
        'fuente': 'https://www.youtube.com/channel/UCxcnsr1R5Ge_fbTu5ajt8DQ'
// EDUCATIVOS
    },
    'tv-educa-cl': {
        'nombre': 'TV Educa Chile',
        'm3u8_url': 'https://mdstrm.com/live-stream-playlist-v/5e74e53f1ab4eb073b19ef34.m3u8',
        'fuente': 'https://www.tvn.cl/envivo/tveducachile/',
        'pais': 'cl'
    },
// Gobierno
    'tv-senado': {
        'nombre': 'TV Senado',
        'iframe_url': 'https://janus-tv.senado.cl/embed.php',
        'fuente': 'https://tv.senado.cl/',
        'pais': 'cl'
    },
    'tv-senado-2': {
        'nombre': 'TV Senado 2',
        'm3u8_url': 'https://janus-tv-ply.senado.cl/playlist/playlist.m3u8',
        'fuente': 'https://tv.senado.cl/',
        'pais': 'cl'
    },
    'tv-senado-3': {
        'nombre': 'TV Senado 3',
        'yt_id': 'UC4GJ43VNn4AYfiYa0RBCHQg',
        'pais': 'cl'
    },
    'tribunal-consti': {
        'nombre': 'Tribunal Constitucional',
        'yt_id': 'UCZaI-1N1oaGb-U8K2VNztjg',
        'pais': 'cl'
    },
    'poder-judicial': {
        'nombre': 'Poder Judicial',
        'yt_id': 'UCo0C1-ocUG9a0Yb3iO0V-xg',
        'pais': 'cl'
    },
    'cam-dipu-1': {
        'nombre': 'Cámara Diputados',
        'm3u8_url': 'https://wowlive.grupoz.cl/camara/live/chunklist_w1358283897_DVR.m3u8',
        'fuente': 'http://www.cdtv.cl/',
        'pais': 'cl'
    },
// CANALES ALTERNATIVOS CAM DIPUTADOS
    'cam-dipu': {
        'nombre': 'Cámara Diputados YT',
        'yt_id': 'UCYd5k2TyOyOmUJNx0SH17KA',
        'pais': 'cl'
    },
    'cam-dipu-01': {
        'nombre': 'Cámara Diputados YT 01',
        'yt_id': 'UCcULnWuDzgQG9yF0Dv3DIgg',
        'pais': 'cl'
    },
    'cam-dipu-03': {
        'nombre': 'Cámara Diputados YT 03',
        'yt_id': 'UCF6KgLfQqQzekn8U1DwVs9g',
        'pais': 'cl'
    },
    'cam-dipu-05': {
        'nombre': 'Cámara Diputados YT 05',
        'yt_id': 'UC0QKtI8NpeMObauDylsSUDA',
        'pais': 'cl'
    },
    'cam-dipu-06': {
        'nombre': 'Cámara Diputados YT 06',
        'yt_id': 'UCspWzpGflwb6A8PZqWw49CQ',
        'pais': 'cl'
    },
    'cam-dipu-07': {
        'nombre': 'Cámara Diputados YT 07',
        'yt_id': 'UCyVjDDBZGDywVGrpGBvGEsw',
        'pais': 'cl'
    },
    'cam-dipu-08': {
        'nombre': 'Cámara Diputados YT 08',
        'yt_id': 'UCCtDbZzh63vgU_BWHRGsbug',
        'pais': 'cl'
    },
    'cam-dipu-11': {
        'nombre': 'Cámara Diputados YT 11',
        'yt_id': 'UCYPKjGKq2yLbAnmth5rFZmQ',
        'pais': 'cl'
    },
    'cam-dipu-12': {
        'nombre': 'Cámara Diputados YT 12',
        'yt_id': 'UCVOWFY-sgbDglBsfOap9okg',
        'pais': 'cl'
    },
    'cam-dipu-13': {
        'nombre': 'Cámara Diputados YT 13',
        'yt_id': 'UC33MG3YdoQ16a8a3wODh6lw',
        'pais': 'cl'
    },
}