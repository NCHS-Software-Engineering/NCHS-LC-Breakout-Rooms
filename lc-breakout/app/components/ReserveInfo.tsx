"use client";
import React, { useState, useEffect } from "react";
import { Period, SelectedRoom } from "@/types";
import DaySelector from "./DaySelector";
import ReservationStatus from "./ReservationStatus";
import SelectedRoomDisplay from "./SelectedRoomDisplay";
import RoomTable from "./RoomTable";
import { getSelectedDate } from "../utils/date";

export default function ReserveInfo() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<SelectedRoom | null>(null);

  const fetchPeriods = async (day: string) => {
    const date = getSelectedDate(day);
    const res = await fetch(`/api/periods?date=${date}`);
    const data = await res.json();
    setPeriods(data);
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setSelectedRoom(null);
    fetchPeriods(day).catch((error) => {
      console.error("Failed to fetch periods:", error);
      setPeriods([]);
    });
  };

  // Auto-select today's day on page load
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    // Convert JavaScript day (0=Sun, 1=Mon...) to array index (0=Mon, 1=Tue...)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const todayName = days[dayOfWeek - 1];
      setSelectedDay(todayName);
      setSelectedRoom(null);
      // Fetch periods for today
      const date = getSelectedDate(todayName);
      fetch(`/api/periods?date=${date}`)
        .then((res) => res.json())
        .then((data) => setPeriods(data))
        .catch((error) => {
          console.error("Failed to fetch periods:", error);
          setPeriods([]);
        });
    }
  }, []);

  const handleRoomSelect = (selection: SelectedRoom) => {
    setSelectedRoom(selection);
  };

  const getFormattedDate = (day: string) => {
    const dateStr = getSelectedDate(day);
    if (!dateStr) return "";
    const [year, month, dayNum] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, dayNum);
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <h1 className="text-4xl font-bold">LC Breakout Room Sign-up</h1>
      <p className="mt-4 text-lg">Sign up for a breakout room session.</p>

      <div className="flex flex-col items-center mt-8">
        <DaySelector selectedDay={selectedDay} onDaySelect={handleDaySelect} />

        {selectedDay && (
          <div className="w-3/4 flex flex-col items-center">
            <div className="mb-4 text-lg font-semibold text-blue-400">
              Selected Date: {getFormattedDate(selectedDay)}
            </div>
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