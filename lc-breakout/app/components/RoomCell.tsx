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
  slotID: number;   // add
  date: string;     // add
  isAdmin: boolean;
  onRoomSelect: (selection: SelectedRoom) => void;
  onReservedRoomSelect: (selection: SelectedRoom) => void;
}

export default function RoomCell({
  isVacant,
  isSelected,
  periodIndex,
  roomNumber,
  period,
  room,
  time,
  date,
  slotID,
  isAdmin,
  onRoomSelect,
  onReservedRoomSelect,
}: RoomCellProps) {
  const selection: SelectedRoom = {
    periodIndex,
    roomNumber,
    period,
    room,
    time,
    date,
    slotID,
  };

  const handleClick = () => {
    if (isVacant) {
      onRoomSelect(selection);
      return;
    }

    if (isAdmin) {
      onReservedRoomSelect(selection);
    }
  };

  const baseClasses = "border border-black dark:border-gray-300 px-4 py-2 font-bold box-border transition";

  const stateClasses = isVacant
    ? isSelected
      ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
      : "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
    : isAdmin
    ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
    : "bg-red-500 text-white cursor-not-allowed";

  return (
    <td onClick={handleClick} className={`${baseClasses} ${stateClasses}`}>
      {isVacant ? "Vacant" : "Reserved"}
    </td>
  );
}
