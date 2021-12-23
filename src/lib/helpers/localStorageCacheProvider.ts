// From https://swr.vercel.app/docs/advanced/cache

const localStorageCacheProvider = (cacheName: string) => () => {
  const fullName = `app-cache-${cacheName}`;
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map(JSON.parse(localStorage.getItem(fullName) || '[]'));

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem(fullName, appCache);
  });

  // We still use the map for write & read for performance.
  return map;
};

export default localStorageCacheProvider;
