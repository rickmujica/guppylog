import type { SQLiteDatabase } from 'expo-sqlite';

import type { AquariumType, ParamId } from './params';

export const DB_NAME = 'guppylog.db';

/**
 * Each entry upgrades the schema by one version. Never edit a released entry:
 * add a new one at the end instead.
 */
const MIGRATIONS: string[] = [
  `
  CREATE TABLE aquariums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    volume_l REAL NOT NULL,
    type TEXT NOT NULL,
    started_at INTEGER,
    photo_uri TEXT,
    notes TEXT,
    created_at INTEGER NOT NULL
  );
  CREATE TABLE water_changes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aquarium_id INTEGER NOT NULL REFERENCES aquariums(id) ON DELETE CASCADE,
    date INTEGER NOT NULL,
    percent REAL,
    liters REAL,
    conditioner TEXT,
    notes TEXT
  );
  CREATE INDEX idx_wc_aq_date ON water_changes(aquarium_id, date DESC);
  CREATE TABLE parameter_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aquarium_id INTEGER NOT NULL REFERENCES aquariums(id) ON DELETE CASCADE,
    measured_at INTEGER NOT NULL,
    param TEXT NOT NULL,
    value REAL NOT NULL,
    notes TEXT
  );
  CREATE INDEX idx_pr_aq_param_date ON parameter_readings(aquarium_id, param, measured_at DESC);
  CREATE TABLE reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aquarium_id INTEGER NOT NULL REFERENCES aquariums(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    title TEXT,
    interval_days INTEGER NOT NULL,
    next_due INTEGER NOT NULL,
    notification_id TEXT,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX idx_rem_due ON reminders(next_due);
  `,
];

export async function migrate(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  while (version < MIGRATIONS.length) {
    const sql = MIGRATIONS[version];
    await db.withTransactionAsync(async () => {
      await db.execAsync(sql);
    });
    version += 1;
    await db.execAsync(`PRAGMA user_version = ${version}`);
  }
}

// ---------- Types ----------

export type Aquarium = {
  id: number;
  name: string;
  volume_l: number;
  type: AquariumType;
  started_at: number | null;
  photo_uri: string | null;
  notes: string | null;
  created_at: number;
};

export type WaterChange = {
  id: number;
  aquarium_id: number;
  date: number;
  percent: number | null;
  liters: number | null;
  conditioner: string | null;
  notes: string | null;
};

export type Reading = {
  id: number;
  aquarium_id: number;
  measured_at: number;
  param: ParamId;
  value: number;
  notes: string | null;
};

export type ReminderKind = 'water_change' | 'test' | 'filter' | 'feed' | 'custom';
export const REMINDER_KINDS: ReminderKind[] = ['water_change', 'test', 'filter', 'feed', 'custom'];

export type Reminder = {
  id: number;
  aquarium_id: number;
  kind: ReminderKind;
  title: string | null;
  interval_days: number;
  next_due: number;
  notification_id: string | null;
  enabled: number;
  created_at: number;
};

export type ReminderWithAquarium = Reminder & { aquarium_name: string };

export type AquariumSummary = Aquarium & {
  last_change: number | null;
  next_due: number | null;
};

// ---------- Aquariums ----------

export function listAquariums(db: SQLiteDatabase) {
  return db.getAllAsync<AquariumSummary>(`
    SELECT a.*,
      (SELECT MAX(date) FROM water_changes w WHERE w.aquarium_id = a.id) AS last_change,
      (SELECT MIN(next_due) FROM reminders r WHERE r.aquarium_id = a.id AND r.enabled = 1) AS next_due
    FROM aquariums a
    ORDER BY a.created_at ASC
  `);
}

export function getAquarium(db: SQLiteDatabase, id: number) {
  return db.getFirstAsync<Aquarium>('SELECT * FROM aquariums WHERE id = ?', id);
}

export type AquariumInput = Pick<Aquarium, 'name' | 'volume_l' | 'type' | 'started_at' | 'photo_uri' | 'notes'>;

export async function createAquarium(db: SQLiteDatabase, input: AquariumInput) {
  const res = await db.runAsync(
    'INSERT INTO aquariums (name, volume_l, type, started_at, photo_uri, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    input.name,
    input.volume_l,
    input.type,
    input.started_at,
    input.photo_uri,
    input.notes,
    Date.now(),
  );
  return res.lastInsertRowId;
}

export async function updateAquarium(db: SQLiteDatabase, id: number, input: AquariumInput) {
  await db.runAsync(
    'UPDATE aquariums SET name = ?, volume_l = ?, type = ?, started_at = ?, photo_uri = ?, notes = ? WHERE id = ?',
    input.name,
    input.volume_l,
    input.type,
    input.started_at,
    input.photo_uri,
    input.notes,
    id,
  );
}

export async function deleteAquarium(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM aquariums WHERE id = ?', id);
}

// ---------- Water changes ----------

export function listWaterChanges(db: SQLiteDatabase, aquariumId: number, limit = 50) {
  return db.getAllAsync<WaterChange>(
    'SELECT * FROM water_changes WHERE aquarium_id = ? ORDER BY date DESC LIMIT ?',
    aquariumId,
    limit,
  );
}

export async function addWaterChange(db: SQLiteDatabase, input: Omit<WaterChange, 'id'>) {
  await db.runAsync(
    'INSERT INTO water_changes (aquarium_id, date, percent, liters, conditioner, notes) VALUES (?, ?, ?, ?, ?, ?)',
    input.aquarium_id,
    input.date,
    input.percent,
    input.liters,
    input.conditioner,
    input.notes,
  );
}

export async function deleteWaterChange(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM water_changes WHERE id = ?', id);
}

// ---------- Parameter readings ----------

/** Latest value of each parameter for one aquarium. */
export function latestReadings(db: SQLiteDatabase, aquariumId: number) {
  return db.getAllAsync<Reading>(
    `SELECT r.* FROM parameter_readings r
     JOIN (
       SELECT param, MAX(measured_at) AS m FROM parameter_readings WHERE aquarium_id = ? GROUP BY param
     ) last ON last.param = r.param AND last.m = r.measured_at
     WHERE r.aquarium_id = ?`,
    aquariumId,
    aquariumId,
  );
}

/** Latest temp, pH and nitrate per aquarium, for the home cards. */
export function latestReadingsAll(db: SQLiteDatabase) {
  return db.getAllAsync<Reading>(
    `SELECT r.* FROM parameter_readings r
     JOIN (
       SELECT aquarium_id, param, MAX(measured_at) AS m FROM parameter_readings GROUP BY aquarium_id, param
     ) last ON last.aquarium_id = r.aquarium_id AND last.param = r.param AND last.m = r.measured_at`,
  );
}

export async function addReadings(
  db: SQLiteDatabase,
  aquariumId: number,
  measuredAt: number,
  values: { param: ParamId; value: number }[],
  notes: string | null,
) {
  await db.withTransactionAsync(async () => {
    for (const v of values) {
      await db.runAsync(
        'INSERT INTO parameter_readings (aquarium_id, measured_at, param, value, notes) VALUES (?, ?, ?, ?, ?)',
        aquariumId,
        measuredAt,
        v.param,
        v.value,
        notes,
      );
    }
  });
}

export function readingHistory(db: SQLiteDatabase, aquariumId: number, limit = 200) {
  return db.getAllAsync<Reading>(
    'SELECT * FROM parameter_readings WHERE aquarium_id = ? ORDER BY measured_at DESC LIMIT ?',
    aquariumId,
    limit,
  );
}

// ---------- Reminders ----------

export function listReminders(db: SQLiteDatabase, aquariumId?: number) {
  if (aquariumId !== undefined) {
    return db.getAllAsync<ReminderWithAquarium>(
      `SELECT r.*, a.name AS aquarium_name FROM reminders r JOIN aquariums a ON a.id = r.aquarium_id
       WHERE r.aquarium_id = ? AND r.enabled = 1 ORDER BY r.next_due ASC`,
      aquariumId,
    );
  }
  return db.getAllAsync<ReminderWithAquarium>(
    `SELECT r.*, a.name AS aquarium_name FROM reminders r JOIN aquariums a ON a.id = r.aquarium_id
     WHERE r.enabled = 1 ORDER BY r.next_due ASC`,
  );
}

export function getReminder(db: SQLiteDatabase, id: number) {
  return db.getFirstAsync<ReminderWithAquarium>(
    'SELECT r.*, a.name AS aquarium_name FROM reminders r JOIN aquariums a ON a.id = r.aquarium_id WHERE r.id = ?',
    id,
  );
}

export async function createReminder(
  db: SQLiteDatabase,
  input: Pick<Reminder, 'aquarium_id' | 'kind' | 'title' | 'interval_days' | 'next_due'>,
) {
  const res = await db.runAsync(
    'INSERT INTO reminders (aquarium_id, kind, title, interval_days, next_due, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    input.aquarium_id,
    input.kind,
    input.title,
    input.interval_days,
    input.next_due,
    Date.now(),
  );
  return res.lastInsertRowId;
}

export async function setReminderSchedule(db: SQLiteDatabase, id: number, nextDue: number, notificationId: string | null) {
  await db.runAsync('UPDATE reminders SET next_due = ?, notification_id = ? WHERE id = ?', nextDue, notificationId, id);
}

export async function deleteReminder(db: SQLiteDatabase, id: number) {
  await db.runAsync('DELETE FROM reminders WHERE id = ?', id);
}

// ---------- Backup ----------

export type Backup = {
  app: 'guppylog';
  version: 1;
  exported_at: number;
  aquariums: Aquarium[];
  water_changes: WaterChange[];
  parameter_readings: Reading[];
  reminders: Reminder[];
};

export async function exportAll(db: SQLiteDatabase): Promise<Backup> {
  return {
    app: 'guppylog',
    version: 1,
    exported_at: Date.now(),
    aquariums: await db.getAllAsync<Aquarium>('SELECT * FROM aquariums'),
    water_changes: await db.getAllAsync<WaterChange>('SELECT * FROM water_changes'),
    parameter_readings: await db.getAllAsync<Reading>('SELECT * FROM parameter_readings'),
    reminders: await db.getAllAsync<Reminder>('SELECT * FROM reminders'),
  };
}

export function isBackup(x: unknown): x is Backup {
  const b = x as Backup;
  return (
    !!b &&
    b.app === 'guppylog' &&
    Array.isArray(b.aquariums) &&
    Array.isArray(b.water_changes) &&
    Array.isArray(b.parameter_readings) &&
    Array.isArray(b.reminders)
  );
}

/** Replaces every table with the backup's rows. Notification ids are cleared so they can be rescheduled. */
export async function importAll(db: SQLiteDatabase, b: Backup) {
  await db.withTransactionAsync(async () => {
    await db.execAsync('DELETE FROM reminders; DELETE FROM parameter_readings; DELETE FROM water_changes; DELETE FROM aquariums;');
    for (const a of b.aquariums) {
      await db.runAsync(
        'INSERT INTO aquariums (id, name, volume_l, type, started_at, photo_uri, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        a.id, a.name, a.volume_l, a.type, a.started_at, a.photo_uri, a.notes, a.created_at,
      );
    }
    for (const w of b.water_changes) {
      await db.runAsync(
        'INSERT INTO water_changes (id, aquarium_id, date, percent, liters, conditioner, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        w.id, w.aquarium_id, w.date, w.percent, w.liters, w.conditioner, w.notes,
      );
    }
    for (const r of b.parameter_readings) {
      await db.runAsync(
        'INSERT INTO parameter_readings (id, aquarium_id, measured_at, param, value, notes) VALUES (?, ?, ?, ?, ?, ?)',
        r.id, r.aquarium_id, r.measured_at, r.param, r.value, r.notes,
      );
    }
    for (const r of b.reminders) {
      await db.runAsync(
        'INSERT INTO reminders (id, aquarium_id, kind, title, interval_days, next_due, notification_id, enabled, created_at) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)',
        r.id, r.aquarium_id, r.kind, r.title, r.interval_days, r.next_due, r.enabled, r.created_at,
      );
    }
  });
}
