importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const HTML_CACHE = "html";
const JS_CACHE = "javascript";
const STYLE_CACHE = "stylesheets";
const IMAGE_CACHE = "images";
const FONT_CACHE = "fonts";
const JSON_CACHE = "json";
const PRECACHE = "precache-v1";

// Workbox defaults to 10 s, which left an offline cold start blank for 10 s.
const NETWORK_TIMEOUT_SECONDS = 3;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// App shell, so a first offline visit has something to serve.
workbox.precaching.precacheAndRoute([
  { url: "./", revision: null },
  { url: "./index.html", revision: null },
  { url: "./site.webmanifest", revision: null },
  { url: "./assets/css/style.css", revision: null },
  { url: "./assets/js/main.js", revision: null },
  { url: "./assets/js/botones.js", revision: null },
  { url: "./assets/favicon/android-chrome-512x512.png", revision: null },
  { url: "./assets/favicon/favicon-32x32.png", revision: null },
  { url: "./assets/favicon/favicon-16x16.png", revision: null },
]);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: HTML_CACHE,
    networkTimeoutSeconds: NETWORK_TIMEOUT_SECONDS,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'script',
  new workbox.strategies.NetworkFirst({
    cacheName: JS_CACHE,
    networkTimeoutSeconds: NETWORK_TIMEOUT_SECONDS,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'style',
  new workbox.strategies.NetworkFirst({
    cacheName: STYLE_CACHE,
    networkTimeoutSeconds: NETWORK_TIMEOUT_SECONDS,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: IMAGE_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'font',
  new workbox.strategies.NetworkFirst({
    cacheName: FONT_CACHE,
    networkTimeoutSeconds: NETWORK_TIMEOUT_SECONDS,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'json',
  new workbox.strategies.NetworkFirst({
    cacheName: JSON_CACHE,
    networkTimeoutSeconds: NETWORK_TIMEOUT_SECONDS,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
      }),
    ],
  })
);
