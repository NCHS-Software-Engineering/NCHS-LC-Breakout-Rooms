"use client";

import { Period, SelectedRoom } from "@/types";
import RoomCell from "./RoomCell";
import { useState } from "react";

interface PeriodRowProps {
  period: Period;
  index: number;
  selectedRoom: SelectedRoom | null;
  selectedDate: string;
  onRoomSelect: (selection: SelectedRoom) => void;
}

export default function PeriodRow({
  period,
  index,
  selectedRoom,
  selectedDate,
  onRoomSelect,
}: PeriodRowProps) {
  
  const time = `${period.StartTime} - ${period.EndTime}`;

  return (
    <tr className={index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"}>
      <td className="border border-black dark:border-gray-300 px-4 py-2 font-bold">
        {period.PeriodName}
      </td>
      <td className="border border-black dark:border-gray-300 px-4 py-2">{time}</td>
      <RoomCell
        isVacant={period.Room1}
        isSelected={selectedRoom?.periodIndex === index && selectedRoom?.roomNumber === 1}
        periodIndex={index}
        roomNumber={1}
        period={period.PeriodName}
        room="Room 1"
        time={time}
        date={selectedDate}
        slotID={period.SlotID}
        onRoomSelect={onRoomSelect}
      />
      <RoomCell
        isVacant={period.Room2}
        isSelected={selectedRoom?.periodIndex === index && selectedRoom?.roomNumber === 2}
        periodIndex={index}
        roomNumber={2}
        period={period.PeriodName}
        room="Room 2"
        time={time}
        date={selectedDate}
        slotID={period.SlotID}
        onRoomSelect={onRoomSelect}
      />
      <RoomCell
        isVacant={period.Room3}
        isSelected={selectedRoom?.periodIndex === index && selectedRoom?.roomNumber === 3}
        periodIndex={index}
        roomNumber={3}
        period={period.PeriodName}
        room="Room 3"
        time={time}
        date={selectedDate}
        slotID={period.SlotID}
        onRoomSelect={onRoomSelect}
      />
    </tr>
  );
}
