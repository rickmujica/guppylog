import Storage from 'expo-sqlite/kv-store';

/** Small synchronous key-value store for settings. On iOS and Android it lives in SQLite. */
export const kv = {
  get: (key: string) => Storage.getItemSync(key),
  set: (key: string, value: string) => Storage.setItemSync(key, value),
};
