export async function M3U_A_JSON(m3u) {
    const channels = {};
    const lines = m3u.split('\n').filter(line => line.trim() !== '');

    for (let i = 1; i < lines.length; i++) {
        const channelInfo = lines[i].match(/([^\s]+)="([^"]+)"/g);
        if (channelInfo) {
            const attributes = channelInfo.reduce((acc, attr) => {
                const [key, value] = attr.split('=');
                acc[key.replace(/"/g, '')] = value.replace(/"/g, '');
                return acc;
            }, {});

            //  const NOMBRE_CANAL = lines[i].match(/,([^,]+)$/)[1] ?? 'Nombre canal no encontrado'; //añade lo de (1080p) [24//7]
            const NOMBRE_CANAL = lines[i].match(/,([^,(]+)/)[1]?.trim() ?? 'Nombre canal no encontrado'; // no añade lo que este luego del primer "("

            const LOGO_IMG = attributes['tvg-logo'] ?? "";
            const GROUP_TITLE_ID = attributes['group-title']?.toLowerCase() ?? "";

            const TVG_ID = attributes['tvg-id'] ?? `canal-m3u8-${i}.`;
            const [NOMBRE_CANAL_PARA_ID, COUNTRY_ID = ""] = TVG_ID.toLowerCase().split('.');

            channels[NOMBRE_CANAL_PARA_ID] = {
                "nombre": NOMBRE_CANAL,
                "logo": LOGO_IMG,
                "señales": {
                    "iframe_url": [],
                    "m3u8_url": [lines[i + 1]],
                    "yt_id": "",
                    "yt_embed": "",
                    "yt_playlist": "",
                    "twitch_id": ""
                },
                "sitio_oficial": "",
                "categoría": GROUP_TITLE_ID,
                "país": COUNTRY_ID,
            };
        }
    }
    return channels;
}