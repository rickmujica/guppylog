import { formatNumber, type Lang } from './i18n';
import type { TempUnit, VolumeUnit } from './settings';

export type AquariumType = 'freshwater' | 'planted' | 'marine' | 'brackish';
export const AQUARIUM_TYPES: AquariumType[] = ['freshwater', 'planted', 'marine', 'brackish'];

export type ParamId = 'temp' | 'ph' | 'ammonia' | 'nitrite' | 'nitrate' | 'gh' | 'kh' | 'salinity';

type Range = { min: number; max: number };

export type ParamDef = {
  id: ParamId;
  label: { es: string; en: string };
  /** Unit as stored. Temperature is always stored in °C. */
  unit: string;
  decimals: number;
  ideal: Partial<Record<AquariumType, Range>>;
};

const FRESH = (min: number, max: number): Partial<Record<AquariumType, Range>> => ({
  freshwater: { min, max },
  planted: { min, max },
});

export const PARAMS: ParamDef[] = [
  {
    id: 'temp',
    label: { es: 'Temperatura', en: 'Temperature' },
    unit: '°C',
    decimals: 1,
    ideal: { ...FRESH(22, 28), marine: { min: 24, max: 27 }, brackish: { min: 24, max: 28 } },
  },
  {
    id: 'ph',
    label: { es: 'pH', en: 'pH' },
    unit: '',
    decimals: 1,
    ideal: { freshwater: { min: 6.5, max: 7.5 }, planted: { min: 6.0, max: 7.2 }, marine: { min: 8.0, max: 8.4 }, brackish: { min: 7.5, max: 8.4 } },
  },
  {
    id: 'ammonia',
    label: { es: 'Amoníaco', en: 'Ammonia' },
    unit: 'ppm',
    decimals: 2,
    ideal: { ...FRESH(0, 0), marine: { min: 0, max: 0 }, brackish: { min: 0, max: 0 } },
  },
  {
    id: 'nitrite',
    label: { es: 'Nitritos', en: 'Nitrite' },
    unit: 'ppm',
    decimals: 2,
    ideal: { ...FRESH(0, 0), marine: { min: 0, max: 0 }, brackish: { min: 0, max: 0 } },
  },
  {
    id: 'nitrate',
    label: { es: 'Nitratos', en: 'Nitrate' },
    unit: 'ppm',
    decimals: 0,
    ideal: { freshwater: { min: 0, max: 20 }, planted: { min: 5, max: 25 }, marine: { min: 0, max: 10 }, brackish: { min: 0, max: 20 } },
  },
  {
    id: 'gh',
    label: { es: 'GH', en: 'GH' },
    unit: '°dGH',
    decimals: 0,
    ideal: { freshwater: { min: 4, max: 12 }, planted: { min: 4, max: 10 }, brackish: { min: 10, max: 20 } },
  },
  {
    id: 'kh',
    label: { es: 'KH', en: 'KH' },
    unit: '°dKH',
    decimals: 0,
    ideal: { freshwater: { min: 3, max: 8 }, planted: { min: 2, max: 6 }, marine: { min: 7, max: 11 }, brackish: { min: 8, max: 12 } },
  },
  {
    id: 'salinity',
    label: { es: 'Salinidad (densidad)', en: 'Salinity (SG)' },
    unit: 'SG',
    decimals: 3,
    ideal: { marine: { min: 1.023, max: 1.026 }, brackish: { min: 1.005, max: 1.015 } },
  },
];

export function paramsFor(type: AquariumType) {
  return PARAMS.filter((p) => p.ideal[type] !== undefined);
}

export function getParam(id: string) {
  return PARAMS.find((p) => p.id === id);
}

export type RangeStatus = 'ok' | 'low' | 'high';

export function rangeStatus(def: ParamDef, type: AquariumType, value: number): RangeStatus {
  const r = def.ideal[type];
  if (!r) return 'ok';
  if (value < r.min) return 'low';
  if (value > r.max) return 'high';
  return 'ok';
}

export const cToF = (c: number) => (c * 9) / 5 + 32;
export const fToC = (f: number) => ((f - 32) * 5) / 9;
export const L_PER_GAL = 3.78541;

export function displayUnit(def: ParamDef, tempUnit: TempUnit) {
  if (def.id === 'temp') return tempUnit === 'F' ? '°F' : '°C';
  return def.unit;
}

/** Converts a stored value to what the user sees. */
export function toDisplay(def: ParamDef, value: number, tempUnit: TempUnit) {
  return def.id === 'temp' && tempUnit === 'F' ? cToF(value) : value;
}

/** Converts what the user typed to the stored value. */
export function fromDisplay(def: ParamDef, value: number, tempUnit: TempUnit) {
  return def.id === 'temp' && tempUnit === 'F' ? fToC(value) : value;
}

export function formatParam(def: ParamDef, value: number, lang: Lang, tempUnit: TempUnit) {
  const unit = displayUnit(def, tempUnit);
  const n = formatNumber(lang, toDisplay(def, value, tempUnit), def.decimals);
  return unit ? `${n} ${unit}` : n;
}

export function formatIdeal(def: ParamDef, type: AquariumType, lang: Lang, tempUnit: TempUnit) {
  const r = def.ideal[type];
  if (!r) return '';
  const lo = formatNumber(lang, toDisplay(def, r.min, tempUnit), def.decimals);
  const hi = formatNumber(lang, toDisplay(def, r.max, tempUnit), def.decimals);
  return r.min === r.max ? lo : `${lo}–${hi}`;
}

export function formatVolume(liters: number, unit: VolumeUnit, lang: Lang) {
  return unit === 'gal' ? `${formatNumber(lang, liters / L_PER_GAL, 1)} gal` : `${formatNumber(lang, liters, 0)} L`;
}
