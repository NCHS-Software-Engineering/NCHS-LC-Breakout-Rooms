export function formatTimeToAmPm(timeValue: string | null | undefined): string {
  if (!timeValue) {
    return "";
  }

  const time = String(timeValue).trim();

  if (!time) {
    return "";
  }

  const amPmMatch = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
  if (amPmMatch) {
    const hour = Number(amPmMatch[1]);
    const minute = amPmMatch[2];
    const suffix = amPmMatch[3].toUpperCase();
    const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${normalizedHour}:${minute} ${suffix}`;
  }

  const twentyFourMatch = time.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (twentyFourMatch) {
    const rawHour = Number(twentyFourMatch[1]);
    const minute = twentyFourMatch[2];
    const suffix = rawHour >= 12 ? "PM" : "AM";
    const hour = rawHour % 12 === 0 ? 12 : rawHour % 12;
    return `${hour}:${minute} ${suffix}`;
  }

  return time;
}
