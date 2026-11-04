import { useFocusEffect } from 'expo-router';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { useCallback, useState } from 'react';

/**
 * Runs a database read every time the screen gains focus, so lists stay fresh
 * after the user comes back from a form. `key` must change when the read
 * depends on something new (for example the aquarium id); call `reload()`
 * after a write on the same screen.
 */
export function useFocusQuery<T>(read: (db: SQLiteDatabase) => Promise<T>, key: string | number = '') {
  const db = useSQLiteContext();
  const [data, setData] = useState<T | undefined>(undefined);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((n) => n + 1), []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      read(db).then((value) => {
        if (active) setData(value);
      });
      return () => {
        active = false;
      };
      // `read` is a new function on every render; `key` and `tick` say when to rerun it.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db, key, tick]),
  );

  return { data, reload, db };
}
