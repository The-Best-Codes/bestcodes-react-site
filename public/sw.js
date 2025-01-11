const VERSION_ENDPOINT = "/api/version";
const CACHE_NAME = "bestcodes-dev-cache-v1";
const VERSION_KEY = "app-version";
const VERSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const LAST_CHECK_KEY = "last-version-check";

const ASSETS_TO_PRECACHE = ["/", "/contact", "/favicon.ico"];

// List of API routes that are safe to cache
const CACHEABLE_API_ROUTES = ["/api/printables/highlighted-projects"];

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Precaching App Shell");
      return cache.addAll(ASSETS_TO_PRECACHE);
    }),
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

function shouldCacheRequest(request) {
  const url = new URL(request.url);

  // Don't cache chrome-extension requests
  if (url.protocol === "chrome-extension:") {
    return false;
  }

  // Don't cache API routes by default
  if (url.pathname.startsWith("/api/")) {
    // Only cache specifically allowed API routes
    return CACHEABLE_API_ROUTES.includes(url.pathname);
  }

  // Cache all other GET requests
  return request.method === "GET";
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Handle version endpoint separately
  if (url.pathname === VERSION_ENDPOINT) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse.status === 200 &&
            shouldCacheRequest(event.request)
          ) {
            const clonedResponse = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    }),
  );

  // Only check version if enough time has passed
  event.waitUntil(throttledVersionCheck());
});

async function shouldCheckVersion() {
  try {
    const db = await openVersionDB();
    const lastCheck = await getValue(db, LAST_CHECK_KEY);
    const now = Date.now();

    return !lastCheck || now - lastCheck >= VERSION_CHECK_INTERVAL;
  } catch (error) {
    console.error("Error checking last version check time:", error);
    return true; // If there's an error, allow the check
  }
}

async function throttledVersionCheck() {
  if (await shouldCheckVersion()) {
    try {
      const db = await openVersionDB();
      await setValue(db, LAST_CHECK_KEY, Date.now());
      await checkVersionAndCache();
    } catch (error) {
      console.error("Error during throttled version check:", error);
    }
  }
}

async function checkVersionAndCache() {
  try {
    const versionResponse = await fetch(VERSION_ENDPOINT);
    const newVersion = await versionResponse.text();

    const db = await openVersionDB();
    const currentVersion = await getValue(db, VERSION_KEY);

    if (newVersion && newVersion !== currentVersion) {
      console.log("Service Worker: Version Update Available, Updating cache");
      await setValue(db, VERSION_KEY, newVersion);
      await updateCache();
    } else {
      console.log("Service Worker: App up to date");
    }
  } catch (error) {
    console.error("Service Worker: Failed to check version:", error);
  }
}

async function updateCache() {
  try {
    console.log("Service Worker: Updating cache");
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheName === CACHE_NAME) {
          return caches.delete(cacheName);
        }
      }),
    );
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS_TO_PRECACHE);
  } catch (e) {
    console.error("Service Worker: Failed to update cache ", e);
  }
}

function openVersionDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("VersionDB", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("version")) {
        db.createObjectStore("version");
      }
    };
  });
}

function getValue(db, key) {
  return new Promise((resolve) => {
    const transaction = db.transaction(["version"], "readonly");
    const store = transaction.objectStore("version");
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

function setValue(db, key, value) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["version"], "readwrite");
    const store = transaction.objectStore("version");
    const request = store.put(value, key);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
