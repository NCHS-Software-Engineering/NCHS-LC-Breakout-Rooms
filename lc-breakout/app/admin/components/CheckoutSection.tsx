"use client";

import { useMemo } from "react";
import StatCard from "./StatCard";
import CheckoutCard from "./CheckoutCard";

interface CheckoutReservation {
  id: string;
  room: string;
  guestName: string;
  endTime: string;
  period: string;
}

interface CheckoutSectionProps {
  currentPeriod?: {
    label: string;
    start: string;
    end: string;
  };
  todayKey: string;
  checkoutReservations: CheckoutReservation[];
}

export default function CheckoutSection({
  currentPeriod,
  todayKey,
  checkoutReservations,
}: CheckoutSectionProps) {
  const checkoutRooms = useMemo(
    () =>
      checkoutReservations.filter(
        (reservation) => reservation.period === currentPeriod?.label
      ),
    [checkoutReservations, currentPeriod?.label]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        label="Current Period"
        value={currentPeriod ? currentPeriod.label : "No active period"}
        subtitle={
          currentPeriod
            ? `${currentPeriod.start} - ${currentPeriod.end}`
            : "Outside scheduled periods"
        }
        variant={currentPeriod ? "highlight" : "default"}
      />

      <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2 hover:shadow-xl transition-shadow duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Rooms to Check Out</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {todayKey}
          </span>
        </div>
        {checkoutRooms.length === 0 ? (
          <div className="text-center py-6">
            <svg
              className="w-12 h-12 text-gray-600 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-600">No checkouts scheduled for this period.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {checkoutRooms.map((room) => (
              <CheckoutCard
                key={room.id}
                room={room.room}
                guestName={room.guestName}
                endTime={room.endTime}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
