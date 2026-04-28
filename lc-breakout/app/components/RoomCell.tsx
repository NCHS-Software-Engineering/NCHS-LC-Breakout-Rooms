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

  const baseClasses = "border border-black dark:border-gray-300 font-bold box-border transition flex-1";

  const stateClasses = isVacant
    ? isSelected
      ? "bg-green-800 text-white hover:bg-green-900 cursor-pointer"
      : "bg-green-700 text-white hover:bg-green-800 cursor-pointer"
    : isAdmin
    ? "bg-red-700 text-white hover:bg-red-800 cursor-pointer"
    : "bg-red-700 text-white cursor-not-allowed";

  const isInteractive = isVacant || isAdmin;

  return (
    <td className={`${baseClasses} ${stateClasses} p-0`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={!isInteractive}
        aria-pressed={isSelected}
        className="flex h-full w-full items-center justify-center bg-transparent px-2 sm:px-4 py-2 rounded-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-100 dark:focus-visible:ring-offset-gray-900"
      >
        {isVacant ? "Vacant" : "Reserved"}
      </button>
    </td>
  );
}
