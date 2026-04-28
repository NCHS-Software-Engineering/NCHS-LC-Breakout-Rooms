"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Period, SelectedRoom } from "@/types";
import DaySelector from "./DaySelector";
import ReservationStatus from "./ReservationStatus";
import SelectedRoomDisplay from "./SelectedRoomDisplay";
import RoomTable from "./RoomTable";
import { getSelectedDate } from "../utils/date";

interface ReservedRoomReservation {
  id: string;
  roomNumber: number;
  guestName: string;
  email: string;
  date: string;
  period: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export default function ReserveInfo() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<SelectedRoom | null>(null);
  const [selectedReservedRoom, setSelectedReservedRoom] = useState<SelectedRoom | null>(null);
  const [reservedRoomReservations, setReservedRoomReservations] = useState<ReservedRoomReservation[]>([]);
  const [isLoadingReservedDetails, setIsLoadingReservedDetails] = useState(false);


  const fetchPeriods = useCallback(async (day: string) => {
    const date = getSelectedDate(day);
    if (!date) {
      setPeriods([]);
      return;
    }

    const res = await fetch(`/api/periods?date=${date}`, { cache: "no-store" });

    const data = await res.json();
    setPeriods(data);
  }, []);

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setSelectedRoom(null);
    setSelectedReservedRoom(null);
    setReservedRoomReservations([]);
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
    setSelectedReservedRoom(null);
    setReservedRoomReservations([]);
  };

  const handleReservedRoomSelect = async (selection: SelectedRoom) => {
    if (!isAdmin) {
      return;
    }

    setSelectedRoom(null);
    setSelectedReservedRoom(selection);
    setReservedRoomReservations([]);
    setIsLoadingReservedDetails(true);

    try {
      const params = new URLSearchParams({
        date: selection.date,
        slotId: String(selection.slotID),
        roomId: String(selection.roomNumber),
      });

      const response = await fetch(`/api/admin/reservations/details?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await response.json();
      if (!response.ok) {
        window.alert(data.error || "Failed to load reservation details");
        return;
      }

      setReservedRoomReservations(Array.isArray(data.reservations) ? data.reservations : []);
    } catch (error) {
      console.error("Failed to fetch reserved room details:", error);
      window.alert("Failed to load reservation details");
    } finally {
      setIsLoadingReservedDetails(false);
    }
  };

  useEffect(() => {
    if (!selectedDay) {
      return;
    }

    fetchPeriods(selectedDay).catch((error) => {
      console.error("Failed to refresh periods:", error);
    });

    const intervalId = window.setInterval(() => {
      fetchPeriods(selectedDay).catch((error) => {
        console.error("Failed to refresh periods:", error);
      });
    }, 15000);

    const handleWindowFocus = () => {
      fetchPeriods(selectedDay).catch((error) => {
        console.error("Failed to refresh periods:", error);
      });
    };

    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [selectedDay, fetchPeriods]);

  const getFormattedDate = (day: string) => {
    const dateStr = getSelectedDate(day);
    if (!dateStr) return "";
    const [year, month, dayNum] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, dayNum);
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex w-full flex-col items-center justify-start">
      <h1 className="text-center text-2xl font-bold sm:text-3xl lg:text-4xl">LC Breakout Room Sign-up</h1>
      <p className="mt-3 text-center text-base sm:text-lg">Sign up for a breakout room session.</p>

      <div className="mt-6 flex w-full flex-col items-center sm:mt-8">
        <DaySelector selectedDay={selectedDay} onDaySelect={handleDaySelect} />

        {selectedDay && (
          <div className="flex w-full max-w-6xl flex-col items-center">
            <div className="mb-4 px-2 text-center text-base font-semibold text-[#3974b9] sm:text-lg">
              Selected Date: {getFormattedDate(selectedDay)}
            </div>
            <ReservationStatus selectedRoom={selectedRoom} />
            <SelectedRoomDisplay selectedRoom={selectedRoom} />

            {isAdmin && selectedReservedRoom ? (
              <div className="mb-4 w-full rounded-lg border-2 border-amber-500 bg-amber-100 p-4 text-black">
                <h3 className="font-bold text-lg mb-2">Reservation Details</h3>
                <p className="mb-2 text-sm font-semibold">
                  {selectedReservedRoom.period} ({selectedReservedRoom.time}) - {selectedReservedRoom.room}
                </p>
                {isLoadingReservedDetails ? (
                  <p className="text-sm">Loading reservation details...</p>
                ) : reservedRoomReservations.length === 0 ? (
                  <p className="text-sm">No reservation details found for this room and period.</p>
                ) : (
                  <div className="space-y-2">
                    {reservedRoomReservations.map((reservation) => (
                      <div key={reservation.id} className="bg-white rounded border border-amber-300 p-3">
                        <p className="font-semibold">{reservation.guestName}</p>
                        <p className="text-sm">Email: {reservation.email}</p>
                        <p className="text-sm">
                          Reserved: {reservation.startTime} - {reservation.endTime}
                        </p>
                        <p className="text-sm text-gray-700">
                          Created: {new Date(reservation.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {isAdmin ? (
              <p className="mb-4 px-2 text-center text-sm text-black dark:text-white sm:text-base">
                Admin: click any reserved cell to view reservation details.
              </p>
            ) : null}

            <RoomTable
              periods={periods}
              selectedDay={selectedDay}
              selectedRoom={selectedRoom}
              isAdmin={isAdmin}
              onRoomSelect={handleRoomSelect}
              onReservedRoomSelect={handleReservedRoomSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
}