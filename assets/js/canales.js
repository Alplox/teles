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
    }

by Alplox 
https://github.com/Alplox/teles
*/

const listaCanales = {
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
        'nombre': '24 Horas 2',
        'm3u8_url': 'https://mdstrm.com/live-stream-playlist/57d1a22064f5d85712b20dab.m3u8',
        'fuente': 'https://www.24horas.cl/envivo/',
        'pais': 'cl'
    },
    '24-horas-3': {
        'nombre': '24 Horas 3',
        'm3u8_url': 'https://mdstrm.com/live-stream-playlist-v/5346f657c1e6f5810b5b9df3.m3u8',
        'fuente': 'https://www.24horas.cl/envivo/',
        'pais': 'cl'
    },
    '24-horas-4': {
        'nombre': '24 horas 4',
        'iframe_url': 'https://player.twitch.tv/?channel=24horas_tvn&parent=alplox.github.io',
        'fuente': 'https://www.twitch.tv/24horas_tvn',
        'pais': 'cl'
    },
    '24-horas-5': {
        'nombre': '24 horas 5',
        'iframe_url': 'https://mdstrm.com/live-stream/57d1a22064f5d85712b20dab?jsapi=true&autoplay=true&volume=0',
        'fuente': 'https://www.24horas.cl/envivo/',
        'pais': 'cl'
    },
    '24-horas-6': {
        'nombre': '24 horas 6',
        'iframe_url': 'https://mdstrm.com/live-stream/57d1a22064f5d85712b20dab?jsapi=true&autoplay=true&controls=true&volume=0&mute=true&player=57f4e28f9c53768535d65782&access_token=&custom.preroll=&custom.overlay=',
        'fuente': 'https://www.24horas.cl/envivo/',
        'pais': 'cl'
    },
    '24-horas-s2': {
        'nombre': '24 Horas s2',
        'm3u8_url': 'https://mdstrm.com/live-stream-playlist-v/53443c472c6e89675103cc4c.m3u8',
        'fuente': 'https://www.24horas.cl/envivo/',
        'pais': 'cl'
    },
    '24-horas-s2-2': {
        'nombre': '24 Horas s2 2',
        'm3u8_url': 'https://mdstrm.com/live-stream-playlist-v/5346f5f2c1e6f5810b5b9df0.m3u8',
        'fuente': 'https://www.24horas.cl/envivo/',
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
    'mega': {
        'nombre': 'Mega',
        'm3u8_url': 'https://marine2.miplay.cl/mega/index.m3u8',
        'fuente': 'https://www.mega.cl/',
        'pais': 'cl'
    },
    'mega-2': {
        'nombre': 'Mega 2',
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
        'm3u8_url': 'https://unlimited1-cl-isp.dps.live/t13/t13.smil/playlist.m3u8',
        'fuente': 'https://www.t13.cl/',
        'pais': 'cl'
    },
    'canal-13': {
        'nombre': 'Canal 13',
        'yt_id': 'UCd4D3LfXC_9MY2zSv_3gMgw',
        'pais': 'cl'
    },
    'canal-13-2': {
        'nombre': 'Canal 13 2',
        'iframe_url': 'https://13313131.tnvas.repl.co/',
        'fuente': 'https://www.13.cl/en-vivo',
        'pais': 'cl'
    },
    'canal-13-3': {
        'nombre': 'Canal 13 3',
        'iframe_url': 'https://ainmcl.github.io/MonitorTV/Monitores/Senal/WEB/Se%C3%B1alCANAL13_IFRAME.html',
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
        'm3u8_url': 'https://siloh-latam-aka.plutotv.net/lilo/production/Chilevision/master.m3u8',
        'fuente': 'https://pluto.tv/es/live-tv/chilevision-noticias',
        'pais': 'cl'
    },
    'chv': {
        'nombre': 'CHV',
        'yt_id': 'UC8EdTmyUaFIfZvVttJ9lgIA',
        'pais': 'cl'
    },
    'chv-2': {
        'nombre': 'CHV 2',
        'iframe_url': 'https://chvvvvvvvv.temporalservel.repl.co/',
        'fuente': 'https://www.chilevision.cl/senal-online',
        'pais': 'cl'
    },
    'chv-3': {
        'nombre': 'CHV 3',
        'm3u8_url': 'https://marine2.miplay.cl/chilevision/index.m3u8',
        'fuente': 'https://www.chilevision.cl/senal-online',
        'pais': 'cl'
    },
    'la-red': {
        'nombre': 'La Red',
        'm3u8_url': 'https://unlimited1-cl-isp.dps.live/lared/lared.smil/playlist.m3u8',
        'fuente': 'https://www.lared.cl/senal-online',
        'pais': 'cl'
    },
    'cooperativa': {
        'nombre': '📻 Cooperativa',
        'iframe_url': 'https://rudo.video/live/coopetv?volume=0&mute=1',
        'fuente': 'http://programas.cooperativa.cl/showalairelibre/',
        'pais': 'cl'
    },
    'bbtv': {
        'nombre': '📻 Biobio TV',
        'iframe_url': 'https://rudo.video/live/bbtv?volume=0&mute=1',
        'fuente': 'https://www.biobiochile.cl/biobiotv/',
        'pais': 'cl'
    },
    'bbtv-2': {
        'nombre': '📻 Biobio TV 2',
        'm3u8_url': 'https://unlimited1-cl-isp.dps.live/bbtv/bbtv.smil/playlist.m3u8',
        'fuente': 'https://www.biobiochile.cl/biobiotv/',
        'pais': 'cl'
    },
    'adn': {
        'nombre': '📻 ADN',
        'iframe_url': 'https://rudo.video/live/adntv?volume=0&mute=1',
        'fuente': 'http://tv.adnradio.cl/',
        'pais': 'cl'
    },
    'adn-2': {
        'nombre': '📻 ADN 2',
        'yt_id': 'UCczkrFICr0xEgDsk51zZojA',
        'pais': 'cl'
    },
    'adn-3': {
        'nombre': '📻 ADN 3',
        'm3u8_url': 'https://unlimited1-us.dps.live/adntv/adntv.smil/playlist.m3u8',
        'fuente': 'http://tv.adnradio.cl/',
        'pais': 'cl'
    },
    'adn-4': {
        'nombre': '📻 ADN 4',
        'm3u8_url': 'https://unlimited6-cl.dps.live/adntv/adntv.smil/playlist.m3u8',
        'fuente': 'http://tv.adnradio.cl/',
        'pais': 'cl'
    },
    'adn-5': {
        'nombre': '📻 ADN 5',
        'm3u8_url': 'https://unlimited2-cl-isp.dps.live/adntv/adntv.smil/playlist.m3u8',
        'fuente': 'http://tv.adnradio.cl/',
        'pais': 'cl'
    },
    'duna': {
        'nombre': '📻 Duna',
        'iframe_url': 'https://rudo.video/live/dunatv?volume=0&mute=1',
        'fuente': 'https://www.duna.cl/tv/',
        'pais': 'cl'
    },
    'infinita': {
        'nombre': '📻 Infinita',
        'iframe_url': 'https://rudo.video/live/infinitatv?volume=0&mute=1',
        'fuente': 'http://www.infinita.cl/home/',
        'pais': 'cl'
    },
    'universo': {
        'nombre': '📻 Universo',
        'iframe_url': 'https://rudo.video/live/universotv?volume=0&mute=1',
        'fuente': 'https://www.universo.cl/',
        'pais': 'cl'
    },
    'radio-ae': {
        'nombre': '📻 AE Radio DuocUC',
        'iframe_url': 'https://live.grupoz.cl/3e3852b5c1ea7821ab9cdfadbbe735f2?sound=0',
        'fuente': 'https://www.aeradio.cl/',
        'pais': 'cl'
    },
    'carolina-tv': {
        'nombre': '📻 Carolina TV',
        'iframe_url': 'https://rudo.video/live/carolinatv?volume=0&mute=1',
        'fuente': 'https://www.carolina.cl/tv/',
        'pais': 'cl'
    },
    'carolina-tv-2': {
        'nombre': '📻 Carolina TV 2',
        'm3u8_url': 'https://unlimited6-cl.dps.live/carolinatv/carolinatv.smil/carolinatv/livestream2/chunks.m3u8',
        'fuente': 'https://www.carolina.cl/tv/',
        'pais': 'cl'
    },
    'carolina-tv-3': {
        'nombre': '📻 Carolina TV 3',
        'm3u8_url': 'https://unlimited1-us.dps.live/carolinatv/carolinatv.smil/playlist.m3u8',
        'fuente': 'https://www.carolina.cl/tv/',
        'pais': 'cl'
    },
    'fm-tiempo': {
        'nombre': '📻 FM Tiempo',
        'iframe_url': 'https://rudo.video/live/fmtiempotv?volume=0&mute=1',
        'fuente': 'https://www.fmtiempo.cl/',
        'pais': 'cl'
    },
    'fm-tiempo-2': {
        'nombre': '📻 FM Tiempo 2',
        'm3u8_url': 'https://unlimited10-cl.dps.live/fmtiempotv/fmtiempotv.smil/playlist.m3u8',
        'fuente': 'https://www.fmtiempo.cl/',
        'pais': 'cl'
    },
    'alegria-tv': {
        'nombre': '📻 Alegría TV',
        'm3u8_url': 'https://593b04c4c5670.streamlock.net:443/8192/8192/playlist.m3u8',
        'fuente': 'https://www.alegriafm.cl/',
        'pais': 'cl'
    },
    'alegria-tv-2': {
        'nombre': '📻 Alegría TV 2',
        'm3u8_url': 'https://593b04c4c5670.streamlock.net/8192/8192/playlist.m3u8',
        'fuente': 'https://www.alegriafm.cl/',
        'pais': 'cl'
    },
    'romantica-tv': {
        'nombre': '📻 Romántica TV',
        'iframe_url': 'https://rudo.video/live/romanticatv?volume=0&mute=1',
        'fuente': 'https://www.romantica.cl/romantica-tv/',
        'pais': 'cl'
    },
    'romantica-tv-2': {
        'nombre': '📻 Romántica TV 2',
        'm3u8_url': 'https://unlimited2-cl-isp.dps.live/romanticatv/romanticatv.smil/playlist.m3u8',
        'fuente': 'https://www.romantica.cl/romantica-tv/',
        'pais': 'cl'
    },
    'radio-genial': {
        'nombre': '📻 Radio Genial 100.5 FM',
        'm3u8_url': 'https://v2.tustreaming.cl/genialtv/index.m3u8',
        'fuente': 'https://radiogenial.cl/',
        'pais': 'cl'
    },
    'mi-radio-es-mas': {
        'nombre': '📻 Mi Radio es Más',
        'yt_id': 'UCflUbt1g29kPG-H9SV5QIyw',
        'pais': 'cl'
    },
    'radio-la-clave': {
        'nombre': '📻 Radio La Clave',
        'iframe_url': 'https://rudo.video/live/laclavetv?volume=0&mute=1',
        'fuente': 'https://radiolaclave.cl/',
        'pais': 'cl'
    },
    'radio-folclor-chile': {
        'nombre': '📻 Radio Folclor de Chile',
        'yt_id': 'UC0Hl8kJe8Xwv8g63Q4qefQg',
        'pais': 'cl'
    },
    'radio-maria-chile': {
        'nombre': '📻 Radio María Chile',
        'yt_id': 'UClMwb2kCYemWyDIZ2dYttKA',
        'pais': 'cl'
    },
    'sembrador': {
        'nombre': '📻 El Sembrador',
        'm3u8_url': 'https://5eff35271151c.streamlock.net:1936/8064/8064/playlist.m3u8',
        'fuente': 'https://www.radioelsembrador.cl/tv/',
        'pais': 'cl'
    },
    'radio-nuble': {
        'nombre': '📻 Radio Ñuble',
        'm3u8_url': 'https://live.tvcontrolcp.com:1936/Rnuble/Rnuble/playlist.m3u8',
        'fuente': 'http://radionuble.cl/linea/',
        'pais': 'cl'
    },
    'alternativa-fm': {
        'nombre': '📻 Alternativa FM',
        'm3u8_url': 'https://srv2.zcast.com.br/carlos2469/carlos2469/playlist.m3u8',
        'fuente': 'https://www.alternativafm.cl/p/alternativa-tv.html',
        'pais': 'cl'
    },
    'prensa-presidencia': {
        'nombre': 'Prensa Presidencia',
        'iframe_url': 'https://mdstrm.com/live-stream/5dc17f8944795108a2a52a49?autoplay=true&volume=0',
        'fuente': 'https://prensa.presidencia.cl/streaming.aspx',
        'pais': 'cl'
    },
    'stgo-tv': {
        'nombre': 'Stgo TV',
        'iframe_url': 'https://stv.janus.cl/front/embed.html',
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
    'derechofacil-tw': {
        'nombre': 'DerechoFacil',
        'iframe_url': 'https://player.twitch.tv/?channel=derechofacil&parent=alplox.github.io',
        'fuente': 'https://www.twitch.tv/derechofacil',
        'pais': 'cl'
    },
    'voz-sobran': {
        'nombre': 'La Voz De Los Que Sobran',
        'yt_id': 'UCEnSee5vPeNAm2EFpb_UaRw',
        'pais': 'cl'
    },
    'copano': {
        'nombre': 'Nicolas Copano',
        'yt_id': 'UCVTL17ftpqx3lQ_IaGUNgSg',
        'pais': 'cl'
    },
    'copano-tw': {
        'nombre': 'Nicolas Copano 2',
        'iframe_url': 'https://player.twitch.tv/?channel=copano&parent=alplox.github.io',
        'fuente': 'https://www.twitch.tv/copano',
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
        'iframe_url': 'https://rudo.video/live/holvoettv',
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
    'arab-tv': {
        'nombre': 'ARABTV',
        'm3u8_url': 'https://livefocamundo.com:8081/arabtv/index.m3u8',
        'fuente': 'https://www.arabtv.cl/',
        'pais': 'cl'
    },
    'arab-tv-2': {
        'nombre': 'ARABTV 2',
        'm3u8_url': 'https://livefocamundo.com:8081/arabtv/playlist.m3u8',
        'fuente': 'https://www.arabtv.cl/',
        'pais': 'cl'
    },
    'arica-tv': {
        'nombre': 'Arica TV',
        'm3u8_url': 'https://5eff35271151c.streamlock.net:1936/8002/8002/playlist.m3u8',
        'fuente': 'https://arica.tv/envivo/',
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
        'iframe_url': 'https://live.grupoz.cl/8b383d0a9cef5560a1bfbbeaf6ad4a38?sound=0',
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
        'm3u8_url': 'https://cdn.oneplaychile.cl:1936/regionales/nublevision.stream/playlist.m3u8',
        'fuente': 'https://nublevision.cl/',
        'pais': 'cl'
    },
    'nuble-RTV': {
        'nombre': 'Ñuble RVT',
        'm3u8_url': 'https://live.tvcontrolcp.com:1936/guzman/guzman/playlist.m3u8',
        'fuente': 'https://canalrtv.cl/',
        'pais': 'cl'
    },
    'estaciontv': {
        'nombre': 'Estacióntv',
        'm3u8_url': 'https://unlimited6-cl.dps.live/estaciontv/estaciontv.smil/playlist.m3u8',
        'fuente': 'https://www.estaciontv.cl/site/',
        'pais': 'cl'
    },
    'estaciontv-2': {
        'nombre': 'Estacióntv 2',
        'm3u8_url': 'https://pantera1-100gb-cl-movistar.dps.live/estaciontv/estaciontv.smil/playlist.m3u8',
        'fuente': 'https://www.estaciontv.cl/site/',
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
    'ucv-2': {
        'nombre': 'UCV TV 2',
        'm3u8_url': 'https://unlimited10-cl.dps.live/ucvtv2/ucvtv2.smil/playlist.m3u8',
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
        'iframe_url': 'https://streaminghd.cl/player.video/index.php?s=eduardo555/eduardo555',
        'fuente': 'http://www.canal33.cl/online.php',
        'pais': 'cl'
    },
    'contivision': {
        'nombre': 'Contivision',
        'iframe_url': 'https://rudo.video/live/contivision?volume=0&mute=1',
        'fuente': 'http://w.contivision.cl/cvn/envivo.php',
        'pais': 'cl'
    },
    'contivision-2': {
        'nombre': 'Contivision 2',
        'm3u8_url': 'https://unlimited1-cl-isp.dps.live/contivision/contivision.smil/playlist.m3u8',
        'fuente': 'http://w.contivision.cl/cvn/envivo.php',
        'pais': 'cl'
    },
    'osorno-tv': {
        'nombre': 'Osorno TV',
        'm3u8_url': 'https://hd.chileservidores.cl:1936/osorno2/live/playlist.m3u8',
        'fuente': 'https://www.osornotv.cl/envivo.html',
        'pais': 'cl'
    },
    'teleton-tv': {
        'nombre': 'Teletón TV',
        'iframe_url': 'https://mdstrm.com/live-stream/5d6d5f05a2f6f407b0147965?autoplay=true&volume=0',
        'fuente': 'https://teletontv.cl/',
        'pais': 'cl'
    },
    'teleton-tv-2': {
        'nombre': 'Teletón TV 2',
        'm3u8_url': 'https://mdstrm.com/live-stream-playlist/5d6d5f05a2f6f407b0147965.m3u8',
        'fuente': 'https://teletontv.cl/',
        'pais': 'cl'
    },
    'tv-salud': {
        'nombre': 'TV Salud',
        'm3u8_url': 'https://srv3.zcast.com.br/mastermedia/mastermedia/tvsalud.cl.m3u8',
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
    'america-tv': {
        'nombre': 'América TV',
        'yt_id': 'UC6NVDkuzY2exMOVFw4i9oHw',
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
    'el-siete-tv': {
        'nombre': 'El Siete TV',
        'yt_id': 'UC64ZNqX0FQHabP8iIkmnR3A',
        'pais': 'ar'
    },
    'a24': {
        'nombre': 'A24',
        'yt_id': 'UCR9120YBAqMfntqgRTKmkjQ',
        'pais': 'ar'
    },
    'la-nacion': {
        'nombre': 'LA NACION',
        'yt_id': 'UCba3hpU7EFBSk817y9qZkiA',
        'pais': 'ar'
    },
    'ip-digital': {
        'nombre': 'Información Periodistica',
        'm3u8_url': 'https://d1nmqgphjn0y4.cloudfront.net/live/ip/live.isml/5ee6e167-1167-4a85-9d8d-e08a3f55cff3.m3u8',
        'fuente': 'https://ip.digital/vivo',
        'pais': 'ar'
    },
    'ip-digital-2': {
        'nombre': 'IP Noticias',
        'yt_id': 'UC1bBjOZieJWHbsFA0LwjjJA',
        'pais': 'ar'
    },
    'canal-26': {
        'nombre': 'Canal 26',
        'm3u8_url': 'https://live-edge01.telecentro.net.ar/live/smil:c26.smil/playlist.m3u8',
        'fuente': 'https://www.diario26.com/canal26_en_vivo',
        'pais': 'ar'
    },
// COLOMBIA
    'el-tiempo': {
        'nombre': 'EL TIEMPO',
        'yt_id': 'UCe5-b0fCK3eQCpwS6MT0aNw',
        'pais': 'co'
    },
    'noti-caracol': {
        'nombre': 'Noticias Caracol',
        'yt_id': 'UC2Xq2PK-got3Rtz9ZJ32hLQ',
        'pais': 'co'
    },
    'red-mas-noticias': {
        'nombre': 'RED MÁS Noticias',
        'yt_id': 'UCpcvsK0UAI3MIHsjjj3CgMg',
        'pais': 'co'
    },
// PERU
    'tv-peru': {
        'nombre': 'TVPerú Noticias',
        'yt_id': 'UCkZCoc42IipR1ucqJmIehsA',
        'pais': 'pe'
    },  
    'nacional-tv': {
        'nombre': 'Nacional TV',
        'm3u8_url': 'https://stmv.panel.grupolimalive.com/nacionaltv/nacionaltv/playlist.m3u8',
        'fuente': 'https://ntvperu.pe/senal-en-vivo/',
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
    'uci': {
        'nombre': 'UCI',
        'm3u8_url': 'https://mediastreamm.com:3449/live/mlecaroslive.m3u8',
        'fuente': 'https://uci.pe/envivo',
        'pais': 'pe'
    },
    'nativa': {
        'nombre': 'Nativa',
        'yt_id': 'UCdl1ygFwPa6lUdNYPLjoAGg',
        'pais': 'pe'
    },
    'cable-vision-peru': {
        'nombre': 'Cable Visión Perú',
        'm3u8_url': 'https://videoserver.tmcreativos.com:19360/vnpnoticias/vnpnoticias.m3u8',
        'fuente': 'https://www.cablevisionperu.pe/?page_id=1938',
        'pais': 'pe'
    },
    'atv': {
        'nombre': 'ATV',
        'm3u8_url': 'https://d2tr4gdfol9ja.cloudfront.net/atv/smil:atv.smil/playlist.m3u8',
        'fuente': 'https://www.atv.pe/envivo-atv',
        'pais': 'pe'
    },
    'atv-mas': {
        'nombre': 'ATV Más',
        'm3u8_url': 'https://d2tr4gdfol9ja.cloudfront.net/atv/smil:atv-mas.smil/playlist.m3u8',
        'fuente': 'https://www.atv.pe/envivo-atvmas',
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
        'nombre': '📻 Ovación TV',
        'm3u8_url': 'https://5c3fb01839654.streamlock.net:1963/iptvovacion1/liveovacion1tv/playlist.m3u8',
        'fuente': 'https://ovacion.pe/radio',
        'pais': 'pe'
    },
    'pbo-radio': {
        'nombre': '📻 PBO',
        'yt_id': 'UCgR0st4ZLABi-LQcWNu3wnQ',
        'pais': 'pe'
    },     
    'santa-rosa': {
        'nombre': '📻 Radio Santa Rosa',
        'yt_id': 'UCIGV0oiNkdK2-tnf10DNp2A',
        'pais': 'pe'
    },
    'san-borja': {
        'nombre': '📻 Radio San Borja Tv',
        'm3u8_url': 'https://5c3fb01839654.streamlock.net:1963/iptvsanborja/livesanborjatv/playlist.m3u8',
        'fuente': 'https://radiosanborjatv.com/',
        'pais': 'pe'
    },
    'radio-onda-digital': {
        'nombre': '📻 Radio Onda Digital',
        'm3u8_url': 'https://tv.ondadigital.pe:1936/ondatv2/ondatv2/playlist.m3u8',
        'fuente': 'https://www.ondadigital.pe/',
        'pais': 'pe'
    },
    'radio-tropical': {
        'nombre': '📻 Radio Tropical',
        'm3u8_url': 'https://videoserver.tmcreativos.com:19360/raditropical/raditropical.m3u8',
        'fuente': 'https://radiotropical.pe/',
        'pais': 'pe'
    },
    'radio-uno': {
        'nombre': '📻 Radio Uno',
        'yt_id': 'UCK0lpuL9PQb3I5CDcu7Y7bA',
        'pais': 'pe'
    },
// VENEZUELA
    'globovision': {
        'nombre': 'Globovisión En Vivo',
        'yt_id': 'UCfJtBtmhnIyfUB6RqXeImMw',
        'pais': 've'
    },
    'telesur-tv': {
        'nombre': 'teleSUR tv',
        'yt_id': 'UCbHFKMtqLYkIBRiPHJwxu_w',
        'pais': 've'
    }, 
    'vpitv': {
        'nombre': 'VPItv',
        'yt_id': 'UCVFiIRuxJ2GmJLUkHmlmj4w',
        'pais': 've'
    },
// MEXICO
    'MILENIO': {
        'nombre': 'MILENIO',
        'yt_id': 'UCFxHplbcoJK9m70c4VyTIxg',
        'pais': 'mx'
    },
// HONDURAS
    'hch-vivo': {
        'nombre': 'HCH En Vivo',
        'yt_id': 'UCIs6fmAXOI1K2jgkoBdWveg',
        'pais': 'hn'
    },        
// ESPAÑA
    'cnn-español': {
        'nombre': 'CNN en Español',
        'yt_id': 'UC_lEiu6917IJz03TnntWUaQ',
        'pais': 'es'
    },
    'rtve': {
        'nombre': 'RTVE Noticias',
        'yt_id': 'UC7QZIf0dta-XPXsp9Hv4dTw',
        'pais': 'es'
    },
// BRASIL
    'cnn-brasil': {
        'nombre': 'CNN Brasil',
        'yt_id': 'UCvdwhh_fDyWccR42-rReZLw',
        'pais': 'br'
    },
// CANADÁ
    'global-news': {
        'nombre': 'Global News',
        'm3u8_url': 'https://content.uplynk.com/channel/3324f2467c414329b3b0cc5cd987b6be.m3u8',
        'fuente': 'https://globalnews.ca/live/national/',
        'pais': 'ca'
    },
// ESTADOS UNIDOS
    'abc7': {
        'nombre': 'ABC7',
        'yt_id': 'UCVxBA3Cbu3pm8w8gEIoMEog',
        'pais': 'us'
    },
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
    'cnn-us': {
        'nombre': 'CNN US',
        'm3u8_url': 'https://cnn-cnninternational-1-de.samsung.wurl.com/manifest/playlist.m3u8',
        'fuente': 'https://us.cnn.com',
        'pais': 'us'
    },
    'cnbc-eu': {
        'nombre': 'CNBC EU',
        'm3u8_url': 'https://vidplus.pc.cdn.bitgravity.com/cnbceu-origin/live/playlist.m3u8',
        'fuente': 'https://www.cnbc.com/live-tv/',
        'pais': 'us'
    },
    'c-span-1': {
        'nombre': 'C-SPAN 1',
        'm3u8_url': 'https://skystreams-lh.akamaihd.net/i/SkyC1_1@500806/master.m3u8',
        'fuente': 'https://www.c-span.org/networks/?channel=c-span',
        'pais': 'us'
    },
    'c-span-2': {
        'nombre': 'C-SPAN 2',
        'm3u8_url': 'https://skystreams-lh.akamaihd.net/i/SkyC2_1@500807/master.m3u8',
        'fuente': 'https://www.c-span.org/networks/?channel=c-span',
        'pais': 'us'
    },
    'c-span-3': {
        'nombre': 'C-SPAN 3',
        'm3u8_url': 'https://skystreams-lh.akamaihd.net/i/SkyC3_1@500808/master.m3u8',
        'fuente': 'https://www.c-span.org/networks/?channel=c-span',
        'pais': 'us'
    },
    'fox-business': {
        'nombre': 'Fox Business',
        'yt_id': 'UCCXoCcu9Rp7NPbTzIvogpZg',
        'pais': 'us'
    },
    'fox-news-now': {
        'nombre': 'Fox News Now',
        'm3u8_url': 'https://fox-foxnewsnow-samsungus.amagi.tv/playlist.m3u8',
        'fuente': 'https://video.foxnews.com/v/6174103160001',
        'pais': 'us'
    },
    'livenow-from-fox': {
        'nombre': 'LiveNOW from FOX',
        'yt_id': 'UCJg9wBPyKMNA5sRDnvzmkdg',
        'pais': 'us'
    },
    'newsmax': {
        'nombre': 'Newsmax',
        'yt_id': 'UCx6h-dWzJ5NpAlja1YsApdg',
        'pais': 'us'
    },
    'nbcla': {
        'nombre': 'NBCLA',
        'yt_id': 'UCSWoppsVL0TLxFQ2qP_DLqQ',
        'pais': 'us'
    },   
    'nbc-news': {
        'nombre': 'NBC News',
        'yt_id': 'UCeY0bbntWzzVIaj2z3QigXg',
        'pais': 'us'
    },
    'nbc-now-live-event': {
        'nombre': 'NBC Now (Live Event)',
        'm3u8_url': 'https://nbcnews-lh.akamaihd.net/i/nbc_live13@187394/master.m3u8',
        'fuente': 'https://www.nbcnews.com/now',
        'pais': 'us'
    },
    'nbc-now': {
        'nombre': 'NBC Now',
        'm3u8_url': 'https://nbcnews2.akamaized.net/hls/live/723426/NBCNewsPlaymaker24x7Linear99a3a827-ua/VIDEO_1_4596000.m3u8',
        'fuente': 'https://www.nbcnews.com/now',
        'pais': 'us'
    },
    'pbs-america': {
        'nombre': 'PBS America',
        'm3u8_url': 'https://pbs-samsunguk.amagi.tv/playlist.m3u8',
        'fuente': 'https://www.pbsamerica.co.uk/',
        'pais': 'us'
    },
    'record-news': {
        'nombre': 'Record News',
        'yt_id': 'UCuiLR4p6wQ3xLEm15pEn1Xw',
        'pais': 'us'
    },
    'sky-news': {
        'nombre': 'Sky News',
        'yt_id': 'UCoMdktPbSTixAyNGwb-UYkQ',
        'pais': 'us'
    },
    'telemundo': {
        'nombre': 'Noticias Telemundo',
        'yt_id': 'UCRwA1NUcUnwsly35ikGhp0A',
        'pais': 'us'
    },
    'the-sun': {
        'nombre': 'The Sun',
        'yt_id': 'UCIzXayRP7-P0ANpq-nD-h5g',
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
    'euronews-eng-2': {
        'nombre': 'euronews (English) 2',
        'm3u8_url': 'https://rakuten-euronews-1-gb.samsung.wurl.com/manifest/playlist.m3u8',
        'fuente': 'https://www.euronews.com/live',
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
    'france-24-fra': {
        'nombre': 'FRANCE 24 French',
        'm3u8_url': 'https://static.france24.com/live/F24_FR_HI_HLS/live_tv.m3u8',
        'fuente': 'https://www.france24.com/fr/direct',
        'pais': 'fr'
    },
    'france-info': {
        'nombre': 'franceinfo',
        'yt_id': 'UCO6K_kkdP-lnSCiO3tPx7WA',
        'pais': 'fr'
    },
    'lci': {
        'nombre': 'LCI',
        'm3u8_url': 'https://lci-hls-live-ssl.tf1.fr/lci/1/hls/live_2328.m3u8',
        'fuente': 'https://www.tf1info.fr/direct/',
        'pais': 'fr'
    },
// ALEMANIA
    'dw-español': {
        'nombre': 'DW Español',
        'yt_id': 'UCT4Jg8h03dD0iN3Pb5L0PMA',
        'pais': 'de'
    },
    'dw-deutsch': {
        'nombre': 'DW Deutsch',
        'yt_id': 'UCMIgOXM2JEQ2Pv2d0_PVfcg',
        'pais': 'de'
    },
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
// RUSIA
    '5-канал': {
        'nombre': '5 канал',
        'yt_id': 'UCkyrSWEcjZKpIwMxiPfOcgg',
        'pais': 'ru'
    },
    'Москва-24': {
        'nombre': 'Москва 24',
        'yt_id': 'UCIme7og-uTpdRXRgm0zzA2A',
        'pais': 'ru'
    },
    'Россия-24': {
        'nombre': 'Россия 24',
        'iframe_url': 'https://ok.ru/videoembed/3574052691599?nochat=1&autoplay=1',
        'fuente': 'https://xn--b1agj9af.xn--80aswg/video/rossija-24/',
        'pais': 'ru'
    },
    'РБК': {
        'nombre': 'РБК',
        'yt_id': 'UCWAK-dRtTEjnQnD96L6UMsQ',
        'pais': 'ru'
    },
    'RT-america': {
        'nombre': 'RT America',
        'yt_id': 'UCczrL-2b-gYK3l4yDld4XlQ',
        'pais': 'ru'
    },
    'RT-arabic': {
        'nombre': 'RT Arabic',
        'yt_id': 'UCsP3Clx2qtH2mNZ6KolVoZQ',
        'pais': 'ru'
    },
    'RT-español': {
        'nombre': 'RT en Español',
        'yt_id': 'UC2mtXUpAYLYJIZ2deSPhlqw',
        'pais': 'ru'
    },
    'RT-vivo': {
        'nombre': 'RT en vivo',
        'yt_id': 'UCEIhICHOQOonjE6V0SLdrHQ',
        'pais': 'ru'
    },
    'RT-france': {
        'nombre': 'RT France',
        'yt_id': 'UCqEVwTnDzlzKOGYNFemqnYA',
        'pais': 'ru'
    },
    'RT-news': {
        'nombre': 'RT News',
        'yt_id': 'UCpwvZwUam-URkxB7g4USKpg',
        'pais': 'ru'
    },
    'RT-uk': {
        'nombre': 'RT UK',
        'yt_id': 'UC_ab7FFA2ACk2yTHgNan8lQ',
        'pais': 'ru'
    },
    'Телеканал-Дождь': {
        'nombre': 'Телеканал Дождь',
        'yt_id': 'UCdubelOloxR3wzwJG9x8YqQ',
        'pais': 'ru'
    },
    'yкраїна-24': {
        'nombre': 'Україна 24',
        'yt_id': 'UCMp5Buw-6LpbbV9r9Sl_5yg',
        'pais': 'ru'
    },
// UCRANIA
    '24-Канал-онлайн': {
        'nombre': '24 Канал онлайн',
        'yt_id': 'UCja992VI_u2e52c9FHQXw5A',
        'pais': 'ua'
    },
    '34-телеканал': {
        'nombre': '34 телеканал',
        'yt_id': 'UCAxGITqXFNmV7PNCU82D_MA',
        'pais': 'ua'
    },
    'Апостроф-TV': {
        'nombre': 'Апостроф TV',
        'yt_id': 'UC0lnIB2qcArjFJPtq79WGZA',
        'pais': 'ua'
    },
    'UA-Перший': {
        'nombre': 'UA:Перший',
        'yt_id': 'UCPY6gj8G7dqwPxg9KwHrj5Q',
        'pais': 'ua'
    },
// CHINA
    'live-chino': {
        'nombre': '民視直播 FTVN Live 53',
        'yt_id': 'UClIfopQZlkkSpM1VgCFLRJA',
        'pais': 'cn'
    },
    'live-chino-2': {
        'nombre': '三立LIVE新聞',
        'yt_id': 'UC2TuODJhC03pLgd6MpWP0iw',
        'pais': 'cn'
    },
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
    'live-chino-6': {
        'nombre': '中天電視',
        'yt_id': 'UC5l1Yto5oOIgRXlI4p4VKbw',
        'pais': 'cn'
    },
    'cgtn-europe': {
        'nombre': 'CGTN Europe',
        'yt_id': 'UCj0TppyxzQWm9JbMg3CP8Rg',
        'pais': 'cn'
    },
    'cgtn': {
        'nombre': 'CGTN',
        'm3u8_url': 'https://live.cgtn.com/1000/prog_index.m3u8',
        'fuente': 'https://www.cgtn.com/',
        'pais': 'cn'
    },
// HONG KONG
    'HK-apple-daily': {
        'nombre': 'HK Apple Daily',
        'yt_id': 'UCeqUUXaM75wrK5Aalo6UorQ',
        'pais': 'hk'
    },
// JAPON
    'annnewsch': {
        'nombre': 'ANNnewsCH',
        'yt_id': 'UCGCZAYq5Xxojl_tSXcVJhiQ',
        'pais': 'jp'
    },
    'nhk-world-japan': {
        'nombre': 'NHK WORLD-JAPAN',
        'yt_id': 'UCSPEjw8F2nQDtmUKPFNF7_A',
        'pais': 'jp'
    },
    'nhk-world': {
        'nombre': 'NHK World',
        'm3u8_url': 'https://nhkworld.webcdn.stream.ne.jp/www11/nhkworld-tv/global/2003458/live.m3u8',
        'fuente': 'https://www3.nhk.or.jp/nhkworld/en/live/',
        'pais': 'jp'
    },
// COREA DEL SUR
    'mbcnews': {
        'nombre': 'MBCNEWS',
        'yt_id': 'UCF4Wxdo3inmxP-Y59wXDsFw',
        'pais': 'kr'
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
// NIGERIA
    'news-nigeria': {
        'nombre': 'TVC News Nigeria',
        'yt_id': 'UCgp4A6I8LCWrhUzn-5SbKvA',
        'pais': 'ng'
    },
// AUSTRALIA
    'abc-news-au': {
        'nombre': 'ABC News AU',
        'm3u8_url': 'https://abc-iview-mediapackagestreams-2.akamaized.net/out/v1/6e1cc6d25ec0480ea099a5399d73bc4b/index.m3u8',
        'fuente': 'https://www.abc.net.au/news/',
        'pais': 'au'
    },
// PAKISTAN
    'bol-news': {
        'nombre': 'BOL News',
        'yt_id': 'UCz2yxQJZgiB_5elTzqV7FiQ',
        'pais': 'pk'
    },
// INDIA
    'indiatv': {
        'nombre': 'IndiaTV',
        'yt_id': 'UCttspZesZIDEwwpVIgoZtWQ',
        'pais': 'in'
    },
    'republic-world': {
        'nombre': 'Republic World',
        'yt_id': 'UCwqusr8YDwM-3mEYTDeJHzw',
        'pais': 'in'
    },
// REINO UNIDO
    'gbnews': {
        'nombre': 'GBNews',
        'yt_id': 'UC0vn8ISa4LKMunLbzaXLnOQ',
        'pais': 'gb'
    },
// VARIOS ???
    'naciones-unidas': {
        'nombre': 'Naciones Unidas',
        'yt_id': 'UC5O114-PQNYkurlTg6hekZw',
    },
// MUSICA 24/7
    'lofi-girl': {
        'nombre': '🎵 Lofi Girl',
        'yt_id': 'UCSJ4gkVC6NrvII8umztf0Ow'
    },
    'chillhop': {
        'nombre': '🎵 Chillhop',
        'yt_id': 'UCOxqgCwgOqC2lMqC5PYz_Dg'
    },
    'steezyasfuck': {
        'nombre': '🎵 Steezyasfuck',
        'yt_id': 'UCsIg9WMfxjZZvwROleiVsQg'
    },
    'imuc-radio-chile': {
        'nombre': '🎵 IMUC Chile',
        'yt_id': 'UCIIDtZoaK9UZi4FaGMmL_hw',
        'pais': 'cl'
    },
    'doom-radio': {
        'nombre': '🎵 Doom Radio',
        'yt_id': 'UCR2D48i5MCMYwVKbgYIAftQ'
    },
    'naxos-japan': {
        'nombre': '🎵 naxos japan',
        'yt_id': 'UCwP6-81HmoDyC3nfBAyGPXQ'
    },
    'acidjazz': {
        'nombre': '🎵 AcidJazz',
        'yt_id': 'UC8cRYBn-z6y1EOUeMdJ0VHA'
    },
    'darkwave': {
        'nombre': '🎵 The 80s Guy',
        'yt_id': 'UC6ghlxmJNMd8BE_u1HR-bTg'
    },
    'the-bootleg-boy-1': {
        'nombre': '🎵 the bootleg boy',
        'yt_id': 'UC0fiLCwTmAukotCXYnqfj0A'
    },
    'the-bootleg-boy-2': {
        'nombre': '🎵 the bootleg boy 2',
        'yt_id': 'UCwkTfp14Sj7o6q9_8ADJpnA'
    },
    'chill-with-taiki': {
        'nombre': '🎵 Chill with Taiki',
        'yt_id': 'UCKdURsjh1xT1vInYBy82n6g'
    },
    'abao-en-tokio': {
        'nombre': '🎵 Abao en Tokio',
        'yt_id': 'UC84whx2xxsiA1gXHXXqKGOA'
    },
    'college-music': {
        'nombre': '🎵 College Music',
        'yt_id': 'UCWzZ5TIGoZ6o-KtbGCyhnhg'
    },
// CAMARAS MUNDO
// Chile
    'galeria-cima': {
        'nombre': '📷 Galería CIMA',
        'yt_id': 'UC4GOcOKkEefz5NamN4WyMFg',
        'pais': 'cl'
    },
    'parquemet-cumbre': {
        'nombre': '📷 Halcón Parquemet, Cumbre',
        'iframe_url': 'https://g1.ipcamlive.com/player/player.php?alias=5a7084c9e0136&autoplay=true',
        'fuente': 'https://halcon.parquemet.cl/index.html',
        'pais': 'cl'
    },
    'parquemet-terraza': {
        'nombre': '📷 Halcón Parquemet, Terraza',
        'iframe_url': 'https://g1.ipcamlive.com/player/player.php?alias=5a7085fe914c0&autoplay=true',
        'fuente': 'https://halcon.parquemet.cl/index.html',
        'pais': 'cl'
    },
    'ledrium': {
        'nombre': '📷 Providencia, Ledrium',
        'yt_embed': 'mGxX5PfREPA',
        'fuente': 'https://www.youtube.com/channel/UCTDewuGhfwGv6JRNnqa-yXw',
        'pais': 'cl'
    },
    'muni-osorno': {
        'nombre': '📷 Municipalidad Osorno',
        'yt_id': 'UCD7sqegDNyZxmdnCj6xqH6g',
        'pais': 'cl'
    },
    'glaseado-1': {
        'nombre': '📷 glaseado.cl, Huayquique',
        'iframe_url': 'https://g3.ipcamlive.com/player/player.php?alias=huayquique&autoplay=1',
        'fuente': 'https://www.glaseado.cl/surf-cams/huayquique/',
        'pais': 'cl'
    },
    'glaseado-2': {
        'nombre': '📷 glaseado.cl, Las Urracas',
        'iframe_url': 'https://g3.ipcamlive.com/player/player.php?alias=lasurracas&autoplay=1',
        'fuente': 'https://www.glaseado.cl/surf-cams/las-urracas/',
        'pais': 'cl'
    },
    'glaseado-3': {
        'nombre': '📷 glaseado.cl, La Punta',
        'iframe_url': 'https://g3.ipcamlive.com/player/player.php?alias=lapunta&autoplay=1',
        'fuente': 'https://www.glaseado.cl/surf-cams/la-punta/',
        'pais': 'cl'
    },
// Peru
    'av-angamos': {
        'nombre': '📷 Av Angamos',
        'yt_embed': 'jQcotlKaPYY',
        'fuente': 'https://www.youtube.com/channel/UCP9nvEUj8EN-wuOQajPQbAw',
        'pais': 'pe'
    },
    'av-la-marina': {
        'nombre': '📷 Av La Marina',
        'yt_embed': 'Arq2BUHYz9Y',
        'fuente': 'https://www.youtube.com/channel/UCP9nvEUj8EN-wuOQajPQbAw',
        'pais': 'pe'
    },
//  Argentina
    'obelisco': {
        'nombre': '📷 FourSeasons BuenosAires',
        'yt_id': 'UCCkRwmztPEvut3gpsgmCmzw',
        'pais': 'ar'
    },
    'puente-gral-belgrano': {
        'nombre': '📷 SISE Argentina',
        'yt_id': 'UC2RkL2eATR1V6H8g4eNfA5Q',
        'pais': 'ar'
    },
// EEUU
    'times-square': {
        'nombre': '📷 Times Square Live 4K',
        'yt_id': 'UC6qrG3W8SMK0jior2olka3g',
        'pais': 'us'
    },
    'puente-brooklyn': {
        'nombre': '📷 St. George Tower',
        'yt_embed': 'KGuCGd726RA',
        'fuente': 'https://www.youtube.com/channel/UCp1ojgNJ8mNWdMDsdcMRA2Q',
        'pais': 'us'
    },
    'bryant-park': {
        'nombre': '📷 Bryant Park NYC',
        'yt_id': 'UC6AlfoRUeH4B1an_R5YSSTw',
        'pais': 'us'
    },
    'george-washington-bridge': {
        'nombre': '📷 Fort Lee Today On Demand',
        'yt_id': 'UChQ5P-kHBZpH20EnXm9X0YQ',
        'pais': 'us'
    },
    'washington-dc': {
        'nombre': '📷 Washington DC, US Capitol',
        'yt_embed': '_RAjp7A3VDw',
        'fuente': 'https://www.youtube.com/channel/UCRj7u6fmW8RYQl98hcwbwng',
        'pais': 'us'
    },
    'las-vegas': {
        'nombre': '📷 Las Vegas, Treasure Island',
        'yt_embed': 'CUyy8rBnuzY',
        'fuente': 'https://www.youtube.com/channel/UCRj7u6fmW8RYQl98hcwbwng',
        'pais': 'us'
    },
    'san-diego': {
        'nombre': '📷 San Diego, Down Town + Airport',
        'yt_embed': 'fcGDU86DuSo',
        'fuente': 'https://www.youtube.com/channel/UCRj7u6fmW8RYQl98hcwbwng',
        'pais': 'us'
    },
// Francia
    'eiffel-tower': {
        'nombre': '📷 Paris, Eiffel Tower',
        'yt_embed': 'iZipA1LL_sU',
        'fuente': 'https://www.youtube.com/channel/UCRj7u6fmW8RYQl98hcwbwng',
        'pais': 'fr'
    },
// UCRANIA
    'ucrania-multicam-s8': {
        'nombre': '📷 Multi-cam Ucrania, Zabby',
        'yt_id': 'UCxc2Kkmuc8-BXVEQ82ChVow',
        'pais': 'ua'
    },
    'ucrania-multicam-s9': {
        'nombre': '📷 Multi-cam Ucrania, Sloth On Meth',
        'yt_id': 'UCkO2xL-Fx_tYXXxuuAv_j6A',
        'pais': 'ua'
    },
// Japon
    'RailCam': {
        'nombre': '📷 Aoba traffics',
        'yt_id': 'UCynDLZ-YJnrMLSQvwYi-bUA'
    },
    'jerusalem': {
        'nombre': '📷 Steadycamline, Jerusalem',
        'yt_id': 'UC1byT4dOeBAZwVqQ309iAuA'
    },
    'hawaii-livecam': {
        'nombre': '📷 Aqualink Hawaii',
        'yt_id': 'UCTLF36lXVM7uiR-VolWHv0Q'
    },
    'daily-seoul': {
        'nombre': '📷 Daily Seoul Live Camera - Hangang',
        'yt_id': 'UCQKQTgZJo3PlxA-9V1Z51XA'
    },
// aleatorio
    'camaras-aleatorias': {
        'nombre': '📷 Boston and Maine Live',
        'yt_embed': 'cUk-Xvlfs1I',
        'fuente': 'https://www.youtube.com/channel/UC8gbWbcNNyb5-NIXvFklkOA'
    },
    'namibiacam': {
        'nombre': '📷 NamibiaCam',
        'yt_id': 'UC9X6gGKDv2yhMoofoeS7-Gg'
    },
// ESPACIO
    'nasa': {
        'nombre': '🔭 NASA Live',
        'yt_embed': '21X5lGlDOfg',
        'fuente': 'https://www.youtube.com/watch?v=21X5lGlDOfg'
    },
    'space-videos': {
        'nombre': '🔭 NASA ISS Live Stream',
        'yt_embed': '86YLFOog4GM',
        'fuente': 'https://www.youtube.com/watch?v=86YLFOog4GM'
    },
    'space-videos-2': {
        'nombre': '🔭 Space Videos',
        'yt_id': 'UCakgsb0w7QB0VHdnCc-OVEA'
    },
    'nasa-spaceflight': {
        'nombre': '🔭 NASASpaceflight',
        'yt_id': 'UCSUu1lih2RifWkKtDOJdsBA'
    },
    'espacio-tierra': {
        'nombre': '🔭 Earth view from ISS',
        'yt_embed': 'XBPjVzSoepo',
        'fuente': 'https://www.youtube.com/watch?v=XBPjVzSoepo'
    },
    'labpadre': {
        'nombre': '🔭 LabPadre',
        'yt_id': 'UCFwMITSkc1Fms6PoJoh1OUQ'
    },
    'spacex': {
        'nombre': '🔭 SpaceX',
        'yt_id': 'UCtI0Hodo5o5dUb67FeUjDeA'
    },
    'blue-origin': {
        'nombre': '🔭 Blue Origin',
        'yt_id': 'UCVxTHEKKLxNjGcvVaZindlg'
    },
    'virgin-galactic': {
        'nombre': '🔭 Virgin Galactic',
        'yt_id': 'UClcvOr7LV8tlJwJvkNMmnKg'
    },
// COVID
    'corona-pagina': {
        'nombre': '🦠 COVID-19 Dashboard',
        'iframe_url': 'https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6',
        'fuente': 'https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6'
    },
    'corona-live': {
        'nombre': '🦠 COVID-19 Live',
        'yt_embed': 'NMre6IAAAiU',
        'fuente': 'https://www.youtube.com/channel/UCDGiCfCZIV5phsoGiPwIcyQ'
    },
    'corona-pag-chile': {
        'nombre': '🦠 COVID-19 Chile',
        'iframe_url': 'https://bing.com/covid/local/chile',
        'fuente': 'https://bing.com/covid/local/chile'
    },
// SERIES
    'bob-ross': {
        'nombre': 'Bob Ross (Todas las Temporadas)',
        'yt_playlist': 'PLaLOVNqqD-2HgiA-GZyzcfZN9n-YelhB5',
        'fuente': 'https://www.youtube.com/channel/UCxcnsr1R5Ge_fbTu5ajt8DQ'
// EDUCATIVOS
    },
    'tv-educa-cl': {
        'nombre': '📚 TV Educa Chile',
        'm3u8_url': 'https://mdstrm.com/live-stream-playlist-v/5e74e53f1ab4eb073b19ef34.m3u8',
        'fuente': 'https://www.tvn.cl/envivo/tveducachile/',
        'pais': 'cl'
    },
    'puntaje-nacional': {
        'nombre': '📚 Puntaje Nacional Chile',
        'yt_id': 'UCCY6xIXHmGBGZUgUYxtfKSg',
        'pais': 'cl'
    },
// 🏛️ 🏛️ 🏛️ 
    'gob-cl': {
        'nombre': '🏛️ Gobierno de Chile',
        'iframe_url': 'https://mdstrm.com/live-stream/5c12a5c39e03df0795a74d3a?autoplay=true&volume=0',
        'fuente': 'https://www.gob.cl/',
        'pais': 'cl'
    },
    'tv-senado': {
        'nombre': '🏛️ TV Senado',
        'iframe_url': 'https://janus-tv.senado.cl/embed.php',
        'fuente': 'https://tv.senado.cl/',
        'pais': 'cl'
    },
    'tv-senado-2': {
        'nombre': '🏛️ TV Senado 2',
        'm3u8_url': 'https://janus-tv-ply.senado.cl/playlist/playlist.m3u8',
        'fuente': 'https://tv.senado.cl/',
        'pais': 'cl'
    },
    'tv-senado-3': {
        'nombre': '🏛️ TV Senado 3',
        'yt_id': 'UC4GJ43VNn4AYfiYa0RBCHQg',
        'pais': 'cl'
    },
    'convencion-tv': {
        'nombre': '🏛️ Convención Constitucional',
        'iframe_url': 'https://mdstrm.com/live-stream/60d476c14157440829d03cd7?autoplay=true&volume=0',
        'fuente': 'https://www.convencion.tv/',
        'pais': 'cl'
    },
    'convencion-tv-2': {
        'nombre': '🏛️ Convención Constitucional 2',
        'm3u8_url': 'https://mdstrm.com/live-stream-playlist/60d1f10fdacfa008348d71d2.m3u8',
        'fuente': 'https://www.convencion.tv/',
        'pais': 'cl'
    },
    'convencion-tv-3': {
        'nombre': '🏛️ Convención Constitucional 3',
        'yt_id': 'UCRlIWVAxQdAnCl4D4UR9r3Q',
        'pais': 'cl'
    },
    'convencion-tv-01': {
        'nombre': '🏛️ Convención Constitucional YT 01',
        'yt_id': 'UCc3koBbWMyvSyzRbG5eTgvQ',
        'pais': 'cl'
    },
    'convencion-tv-02': {
        'nombre': '🏛️ Convención Constitucional YT 02',
        'yt_id': 'UCKmKUwcjv6HJP7-z9Nnpp2w',
        'pais': 'cl'
    },
    'convencion-tv-03': {
        'nombre': '🏛️ Convención Constitucional YT 03',
        'yt_id': 'UCeIlCkkBplhU0SrWM9B7u7Q',
        'pais': 'cl'
    },
    'convencion-tv-04': {
        'nombre': '🏛️ Convención Constitucional YT 04',
        'yt_id': 'UCkMWMYCPUGzf3UPAxcIaVqA',
        'pais': 'cl'
    },
    'convencion-tv-05': {
        'nombre': '🏛️ Convención Constitucional YT 05',
        'yt_id': 'UChNeKfZ0-wwuOCyUSu6BlcA',
        'pais': 'cl'
    },
    'convencion-tv-06': {
        'nombre': '🏛️ Convención Constitucional YT 06',
        'yt_id': 'UC-HPc8CLoGRSG0dgbzZbDWA',
        'pais': 'cl'
    },
    'convencion-tv-07': {
        'nombre': '🏛️ Convención Constitucional YT 07',
        'yt_id': 'UC9p2Hsom7SXdro9FhN4K59w',
        'pais': 'cl'
    },
    'convencion-tv-08': {
        'nombre': '🏛️ Convención Constitucional YT 08',
        'yt_id': 'UCFkkF0LKUOUOcQEwG4nTrHw',
        'pais': 'cl'
    },
    'convencion-tv-09': {
        'nombre': '🏛️ Convención Constitucional YT 09',
        'yt_id': 'UCEK7dK0jllE0uXMhEQTV6og',
        'pais': 'cl'
    },
    'convencion-tv-10': {
        'nombre': '🏛️ Convención Constitucional YT 10',
        'yt_id': 'UC1qhPKBTpfhjVcTMzmM8mGw',
        'pais': 'cl'
    },
    'convencion-tv-11': {
        'nombre': '🏛️ Convención Constitucional YT 11',
        'yt_id': 'UCRVinYIynLNcn18wHjmI5Vg',
        'pais': 'cl'
    },
    'convencion-tv-12': {
        'nombre': '🏛️ Convención Constitucional YT 12',
        'yt_id': 'UCJerNR157sjR83jMChSocPQ',
        'pais': 'cl'
    },
    'convencion-tv-13': {
        'nombre': '🏛️ Convención Constitucional YT 13',
        'yt_id': 'UCxI0u9BUvXbGHrv200cgFZg',
        'pais': 'cl'
    },
    'convencion-tv-14': {
        'nombre': '🏛️ Convención Constitucional YT 14',
        'yt_id': 'UCxAECnUReRnEwkFThbjtH2Q',
        'pais': 'cl'
    },
    'convencion-tv-15': {
        'nombre': '🏛️ Convención Constitucional YT 15',
        'yt_id': 'UCTGMQgIdFvz3qlD9mKb8v9w',
        'pais': 'cl'
    },
    'tribunal-consti': {
        'nombre': '🏛️ Tribunal Constitucional',
        'yt_id': 'UCZaI-1N1oaGb-U8K2VNztjg',
        'pais': 'cl'
    },
    'poder-judicial': {
        'nombre': '🏛️ Poder Judicial',
        'yt_id': 'UCo0C1-ocUG9a0Yb3iO0V-xg',
        'pais': 'cl'
    },
    'cam-dipu-1': {
        'nombre': '🏛️ Cámara Diputados',
        'm3u8_url': 'https://camara.03.cl.cdnz.cl/camara19/live/playlist.m3u8',
        'fuente': 'http://www.cdtv.cl/',
        'pais': 'cl'
    },
    'cam-dipu-2': {
        'nombre': '🏛️ Cámara Diputados 2',
        'm3u8_url': 'https://camara.02.cl.cdnz.cl/cdndvr/live/playlist.m3u8?DVR',
        'fuente': 'http://webtv.camara.cl/',
        'pais': 'cl'
    },
    'cam-dipu-3': {
        'nombre': '🏛️ Cámara Diputados 3',
        'm3u8_url': 'https://tls-cl.cdnz.cl/camara/live/playlist.m3u8',
        'fuente': 'http://webtv.camara.cl/',
        'pais': 'cl'
    }, 
// CANALES ALTERNATIVOS CAM DIPUTADOS
    'cam-dipu': {
        'nombre': '🏛️ Cámara Diputados YT',
        'yt_id': 'UCYd5k2TyOyOmUJNx0SH17KA',
        'pais': 'cl'
    },
    'cam-dipu-01': {
        'nombre': '🏛️ Cámara Diputados YT 01',
        'yt_id': 'UCcULnWuDzgQG9yF0Dv3DIgg',
        'pais': 'cl'
    },
    'cam-dipu-03': {
        'nombre': '🏛️ Cámara Diputados YT 03',
        'yt_id': 'UCF6KgLfQqQzekn8U1DwVs9g',
        'pais': 'cl'
    },
    'cam-dipu-05': {
        'nombre': '🏛️ Cámara Diputados YT 05',
        'yt_id': 'UC0QKtI8NpeMObauDylsSUDA',
        'pais': 'cl'
    },
    'cam-dipu-06': {
        'nombre': '🏛️ Cámara Diputados YT 06',
        'yt_id': 'UCspWzpGflwb6A8PZqWw49CQ',
        'pais': 'cl'
    },
    'cam-dipu-07': {
        'nombre': '🏛️ Cámara Diputados YT 07',
        'yt_id': 'UCyVjDDBZGDywVGrpGBvGEsw',
        'pais': 'cl'
    },
    'cam-dipu-08': {
        'nombre': '🏛️ Cámara Diputados YT 08',
        'yt_id': 'UCCtDbZzh63vgU_BWHRGsbug',
        'pais': 'cl'
    },
    'cam-dipu-11': {
        'nombre': '🏛️ Cámara Diputados YT 11',
        'yt_id': 'UCYPKjGKq2yLbAnmth5rFZmQ',
        'pais': 'cl'
    },
    'cam-dipu-12': {
        'nombre': '🏛️ Cámara Diputados YT 12',
        'yt_id': 'UCVOWFY-sgbDglBsfOap9okg',
        'pais': 'cl'
    },
    'cam-dipu-13': {
        'nombre': '🏛️ Cámara Diputados YT 13',
        'yt_id': 'UC33MG3YdoQ16a8a3wODh6lw',
        'pais': 'cl'
    },
// PERU
    'congreso-peru': {
        'nombre': '🏛️ Congreso República del Perú',
        'yt_id': 'UCsKiP5cZCYh9YhPGrI6GrkQ',
        'pais': 'pe'
    },
    'justicia-tv': {
        'nombre': '🏛️ Justicia TV',
        'yt_id': 'UCwsURxTXqGqijgu98ndod3A',
        'pais': 'pe'
    }
}