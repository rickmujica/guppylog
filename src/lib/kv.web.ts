/**
 * On the web, SQLite's synchronous API needs SharedArrayBuffer, which browsers only
 * allow on cross-origin-isolated pages (and never inside an embedded iframe), so
 * settings go to localStorage instead.
 */
export const kv = {
  get: (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Private mode or blocked storage: settings still apply for this visit.
    }
  },
};
