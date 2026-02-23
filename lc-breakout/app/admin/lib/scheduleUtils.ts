import { Period } from "./scheduleData";

export const getMinutes = (timeString: string): number => {
  const [time, meridiem] = timeString.split(" ");
  const [hourStr, minuteStr] = time.split(":");
  const baseHour = parseInt(hourStr, 10) % 12;
  const hour = meridiem === "PM" ? baseHour + 12 : baseHour;
  return hour * 60 + parseInt(minuteStr, 10);
};

export const getTodayKey = (): string => {
  return new Date().toLocaleDateString("en-US", { weekday: "long" });
};

export const getCurrentMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const findCurrentPeriod = (
  todaySchedule: Period[]
): Period | undefined => {
  const nowMinutes = getCurrentMinutes();
  return todaySchedule.find(
    (period) =>
      nowMinutes >= getMinutes(period.start) &&
      nowMinutes <= getMinutes(period.end)
  );
};
