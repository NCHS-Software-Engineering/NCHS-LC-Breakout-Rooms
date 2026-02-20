"use client";
import React, { useState, useEffect } from "react";
import { Period, SelectedRoom } from "@/types";
import DaySelector from "./DaySelector";
import ReservationStatus from "./ReservationStatus";
import SelectedRoomDisplay from "./SelectedRoomDisplay";
import RoomTable from "./RoomTable";

export default function ReserveInfo() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<SelectedRoom | null>(null);

  useEffect(() => {
    async function fetchPeriods() {
      const res = await fetch("/api/periods");
      const data = await res.json();
      setPeriods(data);
    }
    fetchPeriods();
  }, []);

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setSelectedRoom(null);
  };

  const handleRoomSelect = (selection: SelectedRoom) => {
    setSelectedRoom(selection);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <h1 className="text-4xl font-bold">LC Breakout Room Sign-up</h1>
      <p className="mt-4 text-lg">Sign up for a breakout room session.</p>

      <div className="flex flex-col items-center mt-8">
        <DaySelector selectedDay={selectedDay} onDaySelect={handleDaySelect} />

        {selectedDay && (
          <div className="w-3/4 flex flex-col items-center">
            <ReservationStatus selectedRoom={selectedRoom} />
            <SelectedRoomDisplay selectedRoom={selectedRoom} />
            <RoomTable
              periods={periods}
              selectedDay={selectedDay}
              selectedRoom={selectedRoom}
              onRoomSelect={handleRoomSelect}
            />
          </div>
        )}
      </div>
    </main>
  );
}