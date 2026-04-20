"use client";

import { getSelectedDate, getMonday } from "../utils/date";

interface DaySelectorProps {
  selectedDay: string;
  onDaySelect: (day: string) => void;
}

export default function DaySelector({ selectedDay, onDaySelect }: DaySelectorProps) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const getDateForDay = (day: string) => {
    const dateStr = getSelectedDate(day);
    if (!dateStr) return "";
    const [year, month, dayNum] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, dayNum);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="mb-8 flex gap-4 justify-center flex-wrap">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onDaySelect(day)}
          className={`px-6 py-4 rounded-lg font-semibold transition cursor-pointer w-40 flex flex-col items-center gap-1 ${
            selectedDay === day
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          <span className="text-base">{day}</span>
          <span className="text-sm opacity-90">{getDateForDay(day)}</span>
        </button>
      ))}
    </div>
  );
}
