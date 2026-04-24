"use client";

import { getSelectedDate } from "../utils/date";

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
    <div className="mb-6 flex w-full flex-wrap justify-center gap-2 sm:mb-8 sm:gap-4">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onDaySelect(day)}
          className={`flex min-w-[130px] flex-1 max-w-[170px] flex-col items-center gap-1 rounded-lg px-3 py-3 font-semibold transition cursor-pointer sm:px-6 sm:py-4 ${
            selectedDay === day
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          <span className="text-sm sm:text-base">{day}</span>
          <span className="text-xs opacity-90 sm:text-sm">{getDateForDay(day)}</span>
        </button>
      ))}
    </div>
  );
}
