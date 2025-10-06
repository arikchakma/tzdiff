import {
  cityTimezoneMapping,
  countryTimezoneMapping,
  isValidRegion,
} from './timezone';

function pad(value: number) {
  return value.toString().padStart(2, '0');
}

export function padTime(time: string = '00:00'): string {
  const [hours, minutes] = time.split(':').map(Number);
  return `${pad(hours)}:${pad(minutes)}`;
}

export function diffInHours(fromTime: string, toTime: string): number {
  const [fromHours, fromMinutes] = fromTime.split(':').map(Number);
  const [toHours, toMinutes] = toTime.split(':').map(Number);

  const minutes = (toMinutes - fromMinutes) / 60;
  if (fromHours > toHours) {
    return toHours + 24 - fromHours + minutes;
  }

  return toHours - fromHours + minutes;
}

export function zonify(fromTZ: string, toTZ: string, fromTime: string) {
  // 1. Break down the input time (HH:mm)
  const [hours, minutes] = fromTime.split(':').map(Number);

  // 2. Use today's date (you could also pass a specific date in)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();

  // 3. Create a Date in UTC that corresponds to the given time in `fromTZ`
  //    We do this by formatting "today midnight" in fromTZ, then adding hours/minutes
  const utcDate = new Date(Date.UTC(year, month, day, hours, minutes));

  // Adjustment: interpret that as `fromTZ`
  // Trick: format the UTC date in fromTZ, then get its UTC offset.
  const fromFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: fromTZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Get what time that UTC date looks like in `fromTZ`
  const parts = fromFormatter.formatToParts(utcDate);
  const fromHours = Number(parts.find((p) => p.type === 'hour')?.value);
  const fromMinutes = Number(parts.find((p) => p.type === 'minute')?.value);

  // Adjust offset: calculate delta between desired "time" and what we got
  const deltaMinutes = (hours - fromHours) * 60 + (minutes - fromMinutes);
  utcDate.setUTCMinutes(utcDate.getUTCMinutes() + deltaMinutes);

  // 4. Now format the adjusted UTC date in the target timezone
  const toFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: toTZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return toFormatter.format(utcDate);
}

const countryNameFormatter = new Intl.DisplayNames(['en'], { type: 'region' });
export function getCountryName(countryCode: string = '') {
  return countryNameFormatter.of(countryCode.trim().toUpperCase());
}

export function resolveTimezone(
  countryCode: string,
  city: string | null
): string | null {
  const country = getCountryName(countryCode);
  const normalizedCountry = country?.trim();
  const normalizedCity = city?.trim();

  const countryZones = normalizedCountry
    ? (countryTimezoneMapping.get(normalizedCountry) ?? [])
    : [];

  // 1. Try by city
  if (normalizedCity) {
    const cityZones = cityTimezoneMapping.get(normalizedCity) ?? [];

    // Prefer intersection with country zones if available
    const intersected = countryZones.length
      ? cityZones.filter((z) => countryZones.includes(z))
      : cityZones;

    const preferred = pickPreferredTimezone(intersected);
    if (preferred && isValidRegion(preferred)) {
      return preferred;
    }
  }

  // 2. Fallback by country
  const countryPreferred = pickPreferredTimezone(countryZones);
  if (countryPreferred && isValidRegion(countryPreferred)) {
    return countryPreferred;
  }

  return null;
}

function pickPreferredTimezone(timezones: string[]): string | null {
  if (!timezones || timezones.length === 0) {
    return null;
  }

  // Stable ordering and basic heuristics:
  // - Deprioritize legacy/Etc zones
  // - Prefer zones with two segments (Region/City)
  const sorted = [...timezones].sort((a, b) => {
    const aEtc = a.startsWith('Etc/');
    const bEtc = b.startsWith('Etc/');
    if (aEtc !== bEtc) {
      return aEtc ? 1 : -1;
    }

    const aDepth = a.split('/').length;
    const bDepth = b.split('/').length;
    if (aDepth !== bDepth) {
      return aDepth - bDepth;
    }

    return a.localeCompare(b);
  });

  return sorted[0] ?? null;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function buildTimezone(region: string, city: string) {
  const normalizedRegion = capitalize(region);
  const normalizedCity = city
    .split(/[\s-]+/)
    .map(capitalize)
    .join('_');

  return `${normalizedRegion}/${normalizedCity}`;
}
