import * as Notifications from 'expo-notifications';
import type { SQLiteDatabase } from 'expo-sqlite';
import { Platform } from 'react-native';

import {
  getReminder,
  listReminders,
  setReminderSchedule,
  type Reminder,
  type ReminderKind,
  type ReminderWithAquarium,
} from './db';
import type { Translate } from './i18n';

const CHANNEL_ID = 'reminders';
const REMINDER_HOUR = 9;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Local time at 9:00, `days` days from today. */
export function dueInDays(days: number, from = Date.now()) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  d.setHours(REMINDER_HOUR, 0, 0, 0);
  return d.getTime();
}

export function reminderLabel(t: Translate, r: Pick<Reminder, 'kind' | 'title'>) {
  if (r.kind === 'custom' && r.title) return r.title;
  return t(`rem.kind.${r.kind}`);
}

/** Asks for permission once. Returns false when the user said no. */
export async function ensureNotificationPermission() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Recordatorios',
        // eslint-disable-next-line import/namespace -- exported at runtime; the resolver misses it
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  } catch {
    return false;
  }
}

async function cancel(notificationId: string | null) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Already delivered or removed.
  }
}

async function schedule(r: ReminderWithAquarium, t: Translate) {
  if (r.next_due <= Date.now()) return null;
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: t('rem.notifTitle', { aquarium: r.aquarium_name, task: reminderLabel(t, r) }),
        body: t('rem.notifBody'),
        data: { aquariumId: r.aquarium_id, reminderId: r.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: r.next_due,
        channelId: CHANNEL_ID,
      },
    });
  } catch {
    return null;
  }
}

/** Sets the next due date of a reminder and (re)schedules its notification. */
export async function rescheduleReminder(db: SQLiteDatabase, id: number, nextDue: number, t: Translate) {
  const r = await getReminder(db, id);
  if (!r) return;
  await cancel(r.notification_id);
  const notificationId = await schedule({ ...r, next_due: nextDue }, t);
  await setReminderSchedule(db, id, nextDue, notificationId);
}

/** Marks a reminder as done today: the next one is `interval_days` from now. */
export async function completeReminder(db: SQLiteDatabase, r: Reminder, t: Translate) {
  await rescheduleReminder(db, r.id, dueInDays(r.interval_days), t);
}

/** Logging a water change or a test resets the matching reminders of that aquarium. */
export async function completeKind(db: SQLiteDatabase, aquariumId: number, kind: ReminderKind, t: Translate) {
  const list = await listReminders(db, aquariumId);
  for (const r of list) {
    if (r.kind === kind) await completeReminder(db, r, t);
  }
}

export async function cancelReminder(r: Pick<Reminder, 'notification_id'>) {
  await cancel(r.notification_id);
}

/** After a backup import or a language change, rebuild every scheduled notification. */
export async function rescheduleAll(db: SQLiteDatabase, t: Translate) {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Ignore: nothing scheduled.
  }
  const list = await listReminders(db);
  for (const r of list) {
    const notificationId = await schedule(r, t);
    await setReminderSchedule(db, r.id, r.next_due, notificationId);
  }
}
