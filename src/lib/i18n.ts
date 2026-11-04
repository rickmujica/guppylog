export type Lang = 'es' | 'en';

const es = {
  // Tabs
  'tab.aquariums': 'Acuarios',
  'tab.reminders': 'Recordatorios',
  'tab.library': 'Compendio',
  'tab.settings': 'Ajustes',

  // Common
  'common.save': 'Guardar',
  'common.cancel': 'Cancelar',
  'common.delete': 'Eliminar',
  'common.edit': 'Editar',
  'common.optional': 'opcional',
  'common.notes': 'Notas',
  'common.today': 'hoy',
  'common.yesterday': 'ayer',
  'common.daysAgo': 'hace {n} días',
  'common.inDays': 'en {n} días',
  'common.tomorrow': 'mañana',
  'common.overdue': 'atrasado {n} días',
  'common.never': 'nunca',
  'common.required': 'Este campo es obligatorio',
  'common.invalidNumber': 'Ingresa un número válido',
  'common.confirmDelete': '¿Eliminar? Esta acción no se puede deshacer.',

  // Home
  'home.title': 'Mis acuarios',
  'home.pending': '{n} tareas pendientes para hoy',
  'home.pendingOne': '1 tarea pendiente para hoy',
  'home.allDone': 'Todo al día',
  'home.empty.title': 'Aún no tienes acuarios',
  'home.empty.body': 'Crea tu primer acuario para registrar cambios de agua, parámetros y recordatorios.',
  'home.new': 'Nuevo acuario',
  'home.lastChange': 'Último cambio de agua {when}',
  'home.noChanges': 'Sin cambios de agua registrados',

  // Aquarium form
  'aq.newTitle': 'Nuevo acuario',
  'aq.editTitle': 'Editar acuario',
  'aq.name': 'Nombre',
  'aq.namePh': 'Ej.: Plantado del living',
  'aq.volume': 'Volumen',
  'aq.type': 'Tipo',
  'aq.startedAt': 'Fecha de inicio',
  'aq.photo': 'Foto',
  'aq.addPhoto': 'Agregar foto',
  'aq.changePhoto': 'Cambiar foto',
  'aq.type.freshwater': 'Agua dulce',
  'aq.type.planted': 'Plantado',
  'aq.type.marine': 'Marino',
  'aq.type.brackish': 'Salobre',
  'aq.since': 'Desde',
  'aq.deleteTitle': 'Eliminar acuario',

  // Aquarium detail
  'detail.lastParams': 'Últimos parámetros',
  'detail.noParams': 'Todavía no registraste parámetros.',
  'detail.waterChanges': 'Cambios de agua',
  'detail.noWaterChanges': 'Todavía no registraste cambios de agua.',
  'detail.reminders': 'Recordatorios',
  'detail.noReminders': 'Sin recordatorios.',
  'detail.addReminder': 'Agregar recordatorio',
  'detail.logWater': 'Cambio de agua',
  'detail.logParams': 'Parámetros',
  'detail.history': 'Historial',
  'detail.high': 'alto',
  'detail.low': 'bajo',

  // Water change
  'wc.title': 'Cambio de agua',
  'wc.date': 'Fecha',
  'wc.percent': 'Porcentaje cambiado',
  'wc.liters': 'Litros',
  'wc.conditioner': 'Acondicionador',
  'wc.conditionerPh': 'Ej.: Prime',
  'wc.summary': '{percent} % · {liters} L',

  // Parameters
  'params.title': 'Registrar parámetros',
  'params.hint': 'Completa solo los que mediste.',
  'params.ideal': 'Ideal {range}',
  'params.atLeastOne': 'Ingresa al menos un valor',
  'params.notesPh': 'Ej.: agua algo turbia después de podar',

  // Reminders
  'rem.title': 'Recordatorios',
  'rem.empty': 'No tienes recordatorios. Agrégalos desde cada acuario.',
  'rem.newTitle': 'Nuevo recordatorio',
  'rem.kind': 'Tipo',
  'rem.kind.water_change': 'Cambio de agua',
  'rem.kind.test': 'Test de parámetros',
  'rem.kind.filter': 'Limpiar filtro',
  'rem.kind.feed': 'Alimentar',
  'rem.kind.custom': 'Otro',
  'rem.customTitle': 'Nombre',
  'rem.every': 'Repetir cada (días)',
  'rem.everyN': 'cada {n} días',
  'rem.firstDue': 'Primera vez',
  'rem.done': 'Hecho',
  'rem.due': 'Vence {when}',
  'rem.notifTitle': '{aquarium}: {task}',
  'rem.notifBody': 'Toca para registrarlo en GuppyLog.',
  'rem.permDenied': 'Las notificaciones están desactivadas. Puedes activarlas en los ajustes del teléfono.',

  // Library
  'lib.title': 'Compendio',
  'lib.fish': 'Peces',
  'lib.diseases': 'Enfermedades',
  'lib.searchFish': 'Buscar especie',
  'lib.searchDisease': 'Buscar enfermedad o síntoma',
  'lib.freshwater': 'Agua dulce',
  'lib.saltwaterSoon': 'Agua salada · Próximamente',
  'lib.noResults': 'Sin resultados',
  'lib.care.easy': 'Fácil',
  'lib.care.medium': 'Media',
  'lib.care.hard': 'Difícil',
  'lib.severity.common': 'Común',
  'lib.severity.moderate': 'Moderada',
  'lib.severity.serious': 'Grave',
  'lib.size': 'Tamaño adulto',
  'lib.temp': 'Temperatura',
  'lib.ph': 'pH',
  'lib.minTank': 'Acuario mínimo',
  'lib.temperament': 'Temperamento',
  'lib.group': 'Grupo recomendado',
  'lib.diet': 'Alimentación',
  'lib.origin': 'Origen',
  'lib.notes': 'Notas',
  'lib.description': 'Descripción',
  'lib.symptoms': 'Síntomas',
  'lib.cause': 'Causa',
  'lib.treatment': 'Tratamiento',
  'lib.prevention': 'Prevención',
  'lib.disclaimer': 'Información orientativa. Sigue siempre la dosis del fabricante y, ante dudas, consulta a un especialista.',
  'lib.photoSoon': 'Foto de ejemplo próximamente',
  'lib.temperament.peaceful': 'Pacífico',
  'lib.temperament.semi': 'Semiagresivo',
  'lib.temperament.aggressive': 'Agresivo',

  // Settings
  'set.title': 'Ajustes',
  'set.appearance': 'Apariencia',
  'set.darkMode': 'Modo oscuro',
  'set.darkHint': 'Fondo negro en toda la app',
  'set.accent': 'Color de acento',
  'set.language': 'Idioma',
  'set.units': 'Unidades',
  'set.temperature': 'Temperatura',
  'set.volume': 'Volumen',
  'set.data': 'Datos',
  'set.export': 'Exportar respaldo',
  'set.import': 'Importar respaldo',
  'set.exportDone': 'Respaldo creado',
  'set.importConfirm': 'Importar reemplazará todos tus datos actuales. ¿Continuar?',
  'set.importDone': 'Respaldo importado',
  'set.importError': 'El archivo no es un respaldo válido de GuppyLog.',
  'set.accent.agua': 'Agua',
  'set.accent.azul': 'Azul',
  'set.accent.coral': 'Coral',
  'set.accent.violeta': 'Violeta',
  'set.version': 'GuppyLog {version}',
};

export type StringKey = keyof typeof es;

const en: Record<StringKey, string> = {
  'tab.aquariums': 'Tanks',
  'tab.reminders': 'Reminders',
  'tab.library': 'Library',
  'tab.settings': 'Settings',

  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.optional': 'optional',
  'common.notes': 'Notes',
  'common.today': 'today',
  'common.yesterday': 'yesterday',
  'common.daysAgo': '{n} days ago',
  'common.inDays': 'in {n} days',
  'common.tomorrow': 'tomorrow',
  'common.overdue': '{n} days overdue',
  'common.never': 'never',
  'common.required': 'This field is required',
  'common.invalidNumber': 'Enter a valid number',
  'common.confirmDelete': 'Delete? This cannot be undone.',

  'home.title': 'My tanks',
  'home.pending': '{n} tasks due today',
  'home.pendingOne': '1 task due today',
  'home.allDone': 'All caught up',
  'home.empty.title': 'No tanks yet',
  'home.empty.body': 'Create your first tank to log water changes, parameters and reminders.',
  'home.new': 'New tank',
  'home.lastChange': 'Last water change {when}',
  'home.noChanges': 'No water changes logged',

  'aq.newTitle': 'New tank',
  'aq.editTitle': 'Edit tank',
  'aq.name': 'Name',
  'aq.namePh': 'E.g. Living room planted',
  'aq.volume': 'Volume',
  'aq.type': 'Type',
  'aq.startedAt': 'Start date',
  'aq.photo': 'Photo',
  'aq.addPhoto': 'Add photo',
  'aq.changePhoto': 'Change photo',
  'aq.type.freshwater': 'Freshwater',
  'aq.type.planted': 'Planted',
  'aq.type.marine': 'Marine',
  'aq.type.brackish': 'Brackish',
  'aq.since': 'Since',
  'aq.deleteTitle': 'Delete tank',

  'detail.lastParams': 'Latest parameters',
  'detail.noParams': 'No parameters logged yet.',
  'detail.waterChanges': 'Water changes',
  'detail.noWaterChanges': 'No water changes logged yet.',
  'detail.reminders': 'Reminders',
  'detail.noReminders': 'No reminders.',
  'detail.addReminder': 'Add reminder',
  'detail.logWater': 'Water change',
  'detail.logParams': 'Parameters',
  'detail.history': 'History',
  'detail.high': 'high',
  'detail.low': 'low',

  'wc.title': 'Water change',
  'wc.date': 'Date',
  'wc.percent': 'Percent changed',
  'wc.liters': 'Liters',
  'wc.conditioner': 'Conditioner',
  'wc.conditionerPh': 'E.g. Prime',
  'wc.summary': '{percent}% · {liters} L',

  'params.title': 'Log parameters',
  'params.hint': 'Fill in only what you tested.',
  'params.ideal': 'Ideal {range}',
  'params.atLeastOne': 'Enter at least one value',
  'params.notesPh': 'E.g. water a bit cloudy after trimming',

  'rem.title': 'Reminders',
  'rem.empty': 'No reminders yet. Add them from each tank.',
  'rem.newTitle': 'New reminder',
  'rem.kind': 'Type',
  'rem.kind.water_change': 'Water change',
  'rem.kind.test': 'Water test',
  'rem.kind.filter': 'Clean filter',
  'rem.kind.feed': 'Feed',
  'rem.kind.custom': 'Other',
  'rem.customTitle': 'Name',
  'rem.every': 'Repeat every (days)',
  'rem.everyN': 'every {n} days',
  'rem.firstDue': 'First time',
  'rem.done': 'Done',
  'rem.due': 'Due {when}',
  'rem.notifTitle': '{aquarium}: {task}',
  'rem.notifBody': 'Tap to log it in GuppyLog.',
  'rem.permDenied': 'Notifications are off. You can turn them on in your phone settings.',

  'lib.title': 'Library',
  'lib.fish': 'Fish',
  'lib.diseases': 'Diseases',
  'lib.searchFish': 'Search species',
  'lib.searchDisease': 'Search disease or symptom',
  'lib.freshwater': 'Freshwater',
  'lib.saltwaterSoon': 'Saltwater · Coming soon',
  'lib.noResults': 'No results',
  'lib.care.easy': 'Easy',
  'lib.care.medium': 'Medium',
  'lib.care.hard': 'Hard',
  'lib.severity.common': 'Common',
  'lib.severity.moderate': 'Moderate',
  'lib.severity.serious': 'Serious',
  'lib.size': 'Adult size',
  'lib.temp': 'Temperature',
  'lib.ph': 'pH',
  'lib.minTank': 'Minimum tank',
  'lib.temperament': 'Temperament',
  'lib.group': 'Recommended group',
  'lib.diet': 'Diet',
  'lib.origin': 'Origin',
  'lib.notes': 'Notes',
  'lib.description': 'Description',
  'lib.symptoms': 'Symptoms',
  'lib.cause': 'Cause',
  'lib.treatment': 'Treatment',
  'lib.prevention': 'Prevention',
  'lib.disclaimer': 'General guidance only. Always follow the manufacturer’s dosage and ask a specialist if in doubt.',
  'lib.photoSoon': 'Example photo coming soon',
  'lib.temperament.peaceful': 'Peaceful',
  'lib.temperament.semi': 'Semi-aggressive',
  'lib.temperament.aggressive': 'Aggressive',

  'set.title': 'Settings',
  'set.appearance': 'Appearance',
  'set.darkMode': 'Dark mode',
  'set.darkHint': 'Black background across the app',
  'set.accent': 'Accent color',
  'set.language': 'Language',
  'set.units': 'Units',
  'set.temperature': 'Temperature',
  'set.volume': 'Volume',
  'set.data': 'Data',
  'set.export': 'Export backup',
  'set.import': 'Import backup',
  'set.exportDone': 'Backup created',
  'set.importConfirm': 'Importing will replace all your current data. Continue?',
  'set.importDone': 'Backup imported',
  'set.importError': 'This file is not a valid GuppyLog backup.',
  'set.accent.agua': 'Aqua',
  'set.accent.azul': 'Blue',
  'set.accent.coral': 'Coral',
  'set.accent.violeta': 'Violet',
  'set.version': 'GuppyLog {version}',
};

const DICTS: Record<Lang, Record<StringKey, string>> = { es, en };

export type Translate = (key: StringKey, params?: Record<string, string | number>) => string;

export function makeTranslate(lang: Lang): Translate {
  const dict = DICTS[lang] ?? es;
  return (key, params) => {
    let s = dict[key] ?? es[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, String(v));
    }
    return s;
  };
}

const DAY = 24 * 60 * 60 * 1000;

function startOfDay(ms: number) {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Whole days between today and the given time (negative = past). */
export function dayDiff(ms: number, now = Date.now()) {
  return Math.round((startOfDay(ms) - startOfDay(now)) / DAY);
}

/** "hoy", "hace 3 días", "en 2 días"… */
export function relativeDay(t: Translate, ms: number, now = Date.now()) {
  const d = dayDiff(ms, now);
  if (d === 0) return t('common.today');
  if (d === -1) return t('common.yesterday');
  if (d === 1) return t('common.tomorrow');
  if (d < 0) return t('common.daysAgo', { n: -d });
  return t('common.inDays', { n: d });
}

export function formatDate(lang: Lang, ms: number, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return new Date(ms).toLocaleDateString(lang === 'es' ? 'es' : 'en', opts);
}

export function formatNumber(lang: Lang, n: number, maxDecimals = 2) {
  return n.toLocaleString(lang === 'es' ? 'es' : 'en', { maximumFractionDigits: maxDecimals });
}

/** Accepts "25,5" or "25.5". Returns null when empty or not a number. */
export function parseNumber(input: string): number | null {
  const s = input.trim().replace(',', '.');
  if (s === '') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
