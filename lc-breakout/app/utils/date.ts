export function getMonday(date: Date) {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ...
  const diff = (day === 0 ? -6 : 1) - day; // adjust if Sunday
  const monday = new Date(date);
  monday.setDate(monday.getDate() + diff);
  return monday;
}

export function getSelectedDate(selectedDay: string) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const dayIndex = days.indexOf(selectedDay);
  if (dayIndex === -1) return null;

  const monday = getMonday(new Date());
  const date = new Date(monday);
  date.setDate(monday.getDate() + dayIndex);

  return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
}