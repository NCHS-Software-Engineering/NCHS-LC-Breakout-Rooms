"use client";

import { SelectedRoom } from "@/types";

interface RoomCellProps {
  isVacant: boolean;
  isSelected: boolean;
  periodIndex: number;
  roomNumber: number;
  period: string;
  room: string;
  time: string;
  onRoomSelect: (selection: SelectedRoom) => void;
}

export default function RoomCell({
  isVacant,
  isSelected,
  periodIndex,
  roomNumber,
  period,
  room,
  time,
  onRoomSelect,
}: RoomCellProps) {
  const handleClick = () => {
    if (isVacant) {
      onRoomSelect({
        periodIndex,
        roomNumber,
        period,
        room,
        time,
      });
    }
  };

  const baseClasses = "border border-black dark:border-gray-300 px-4 py-2 font-bold box-border transition";

  const stateClasses = isVacant
    ? isSelected
      ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
      : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
    : "bg-red-500 text-white cursor-not-allowed";

  return (
    <td onClick={handleClick} className={`${baseClasses} ${stateClasses}`}>
      {isVacant ? "Vacant" : "Occupied"}
    </td>
  );
}
