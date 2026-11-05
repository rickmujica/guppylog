import type { SQLiteDatabase } from 'expo-sqlite';

import { addReadings, addWaterChange, createAquarium, createReminder } from './db';
import { kv } from './kv';
import type { ParamId } from './params';
import { dueInDays } from './reminders';

const SEEDED_KEY = 'guppylog.demo.seeded';
const DAY = 24 * 60 * 60 * 1000;

/**
 * The web version is a public demo: on the first visit it fills the app with two
 * sample tanks so there is something to explore. It runs only once per browser,
 * so if the visitor deletes everything the app stays empty.
 */
export async function seedDemo(db: SQLiteDatabase) {
  if (kv.get(SEEDED_KEY)) return;
  const row = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM aquariums');
  if ((row?.n ?? 0) > 0) return kv.set(SEEDED_KEY, '1');

  const now = Date.now();
  const at = (daysAgo: number) => now - daysAgo * DAY;

  const planted = await createAquarium(db, {
    name: 'Amazonas',
    volume_l: 120,
    type: 'planted',
    started_at: at(240),
    photo_uri: null,
    notes: null,
  });
  const nano = await createAquarium(db, {
    name: 'Nano Betta',
    volume_l: 30,
    type: 'freshwater',
    started_at: at(90),
    photo_uri: null,
    notes: null,
  });

  for (const d of [2, 9, 16, 23]) {
    await addWaterChange(db, { aquarium_id: planted, date: at(d), percent: 30, liters: 36, conditioner: 'Seachem Prime', notes: null });
  }
  for (const d of [5, 12, 19]) {
    await addWaterChange(db, { aquarium_id: nano, date: at(d), percent: 25, liters: 7.5, conditioner: null, notes: null });
  }

  const readings: [number, number, { param: ParamId; value: number }[]][] = [
    [planted, 14, [{ param: 'temp', value: 25.5 }, { param: 'ph', value: 6.8 }, { param: 'ammonia', value: 0 }, { param: 'nitrite', value: 0 }, { param: 'nitrate', value: 15 }]],
    [planted, 7, [{ param: 'temp', value: 26 }, { param: 'ph', value: 6.9 }, { param: 'ammonia', value: 0 }, { param: 'nitrite', value: 0 }, { param: 'nitrate', value: 20 }]],
    [planted, 1, [{ param: 'temp', value: 25.8 }, { param: 'ph', value: 6.8 }, { param: 'ammonia', value: 0 }, { param: 'nitrite', value: 0 }, { param: 'nitrate', value: 10 }, { param: 'gh', value: 6 }, { param: 'kh', value: 4 }]],
    [nano, 10, [{ param: 'temp', value: 27 }, { param: 'ph', value: 7.2 }, { param: 'nitrate', value: 25 }]],
    [nano, 3, [{ param: 'temp', value: 26.5 }, { param: 'ph', value: 7.4 }, { param: 'ammonia', value: 0.25 }, { param: 'nitrate', value: 45 }]],
  ];
  for (const [aq, d, values] of readings) await addReadings(db, aq, at(d), values, null);

  await createReminder(db, { aquarium_id: planted, kind: 'water_change', title: null, interval_days: 7, next_due: dueInDays(5) });
  await createReminder(db, { aquarium_id: planted, kind: 'filter', title: null, interval_days: 30, next_due: dueInDays(12) });
  await createReminder(db, { aquarium_id: nano, kind: 'water_change', title: null, interval_days: 7, next_due: dueInDays(2) });
  await createReminder(db, { aquarium_id: nano, kind: 'test', title: null, interval_days: 7, next_due: dueInDays(4) });

  kv.set(SEEDED_KEY, '1');
}
