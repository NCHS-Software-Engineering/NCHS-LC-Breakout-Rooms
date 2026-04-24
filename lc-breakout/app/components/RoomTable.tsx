"use client";

import { Period, SelectedRoom } from "@/types";
import PeriodRow from "./PeriodRow";
import { getSelectedDate } from "../utils/date";

interface RoomTableProps {
  periods: Period[];
  selectedDay: string;
  selectedRoom: SelectedRoom | null;
  isAdmin: boolean;
  onRoomSelect: (selection: SelectedRoom) => void;
  onReservedRoomSelect: (selection: SelectedRoom) => void;
}

export default function RoomTable({
  periods,
  selectedDay,
  selectedRoom,
  isAdmin,
  onRoomSelect,
  onReservedRoomSelect,
}: RoomTableProps) {
  const selectedDate = getSelectedDate(selectedDay);

  const filteredPeriods = periods.filter((period) => period.DayName === selectedDay);

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-black/20 bg-white">
      <table className="min-w-[720px] w-full border-collapse text-black">
        <thead>
          <tr className="bg-red-600 text-white">
            <th className="border border-black dark:border-gray-300 px-4 py-2 w-70">Period</th>
            <th className="border border-black dark:border-gray-300 px-4 py-2 w-40">Time</th>
            <th className="border border-black dark:border-gray-300 px-4 py-2 w-50">Room 1</th>
            <th className="border border-black dark:border-gray-300 px-4 py-2 w-50">Room 2</th>
            <th className="border border-black dark:border-gray-300 px-4 py-2 w-50">Room 3</th>
          </tr>
        </thead>
        <tbody>
          {filteredPeriods.map((period, index) => (
            <PeriodRow
              key={index}
              period={period}
              index={index}
              selectedRoom={selectedRoom}
              selectedDate={selectedDate!}
              isAdmin={isAdmin}
              onRoomSelect={onRoomSelect}
              onReservedRoomSelect={onReservedRoomSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
