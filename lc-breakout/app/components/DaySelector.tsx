"use client";

interface DaySelectorProps {
  selectedDay: string;
  onDaySelect: (day: string) => void;
}

export default function DaySelector({ selectedDay, onDaySelect }: DaySelectorProps) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="mb-8 flex gap-4 justify-center flex-wrap">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onDaySelect(day)}
          className={`px-6 py-2 rounded-lg font-semibold transition cursor-pointer w-36 h-18 ${
            selectedDay === day
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );
}
