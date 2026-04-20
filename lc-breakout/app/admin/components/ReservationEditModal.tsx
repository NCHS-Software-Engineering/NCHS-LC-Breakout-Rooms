"use client";

import { useEffect, useState } from "react";

interface Reservation {
  id: string;
  roomId: string;
  roomNumber: number;
  guestName: string;
  email: string;
  date: string;
  slotId: number;
  startTime: string;
  endTime: string;
}

interface PeriodOption {
  slotId: number;
  label: string;
  startTime: string;
  endTime: string;
  roomAvailability: {
    1: boolean;
    2: boolean;
    3: boolean;
  };
}

interface ReservationEditModalProps {
  isOpen: boolean;
  reservation: Reservation | null;
  onClose: () => void;
  onSave: (updates: { email: string; roomNumber: number; slotId: number; date: string }) => Promise<void>;
  isLoading: boolean;
}

export default function ReservationEditModal({
  isOpen,
  reservation,
  onClose,
  onSave,
  isLoading,
}: ReservationEditModalProps) {
  const [email, setEmail] = useState("");
  const [roomNumber, setRoomNumber] = useState("1");
  const [date, setDate] = useState("");
  const [slotId, setSlotId] = useState("");
  const [periodOptions, setPeriodOptions] = useState<PeriodOption[]>([]);
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(false);

  useEffect(() => {
    if (reservation) {
      setEmail(reservation.email);
      setRoomNumber(String(reservation.roomNumber));
      setDate(reservation.date);
      setSlotId(String(reservation.slotId));
    }
  }, [reservation]);

  useEffect(() => {
    if (!date || !isOpen) {
      setPeriodOptions([]);
      return;
    }

    const loadPeriods = async () => {
      setIsLoadingPeriods(true);
      try {
        const response = await fetch(`/api/periods?date=${encodeURIComponent(date)}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch periods");
        }

        const data = await response.json();
        const options: PeriodOption[] = Array.isArray(data)
          ? data.map((period: any) => ({
              slotId: period.SlotID,
              label: period.PeriodName,
              startTime: period.StartTime,
              endTime: period.EndTime,
              roomAvailability: {
                1: period.Room1,
                2: period.Room2,
                3: period.Room3,
              },
            }))
          : [];

        setPeriodOptions(options);
      } catch (error) {
        console.error(error);
        setPeriodOptions([]);
      } finally {
        setIsLoadingPeriods(false);
      }
    };

    loadPeriods();
  }, [date, isOpen]);

  const handleSave = async () => {
    if (!email || !roomNumber || !date || !slotId) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await onSave({
        email,
        roomNumber: Number(roomNumber),
        slotId: Number(slotId),
        date,
      });
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  if (!isOpen || !reservation) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Reservation</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Guest Name
            </label>
            <input
              type="text"
              value={reservation.guestName}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
            />
            <p className="text-xs text-gray-500 mt-1">Guest name cannot be edited</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Room Number *
            </label>
            <select
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
            >
              <option value="1">Room 1</option>
              <option value="2">Room 2</option>
              <option value="3">Room 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Period *
            </label>
            <select
              value={slotId}
              onChange={(e) => setSlotId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
              disabled={isLoadingPeriods || periodOptions.length === 0}
            >
              {periodOptions.length === 0 ? (
                <option value="">No available periods</option>
              ) : (
                periodOptions
                  .filter((option) => option.roomAvailability[Number(roomNumber) as 1 | 2 | 3])
                  .map((option) => (
                    <option key={option.slotId} value={option.slotId}>
                      {option.label} ({option.startTime} - {option.endTime})
                    </option>
                  ))
              )}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 cursor-pointer px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 cursor-pointer px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
