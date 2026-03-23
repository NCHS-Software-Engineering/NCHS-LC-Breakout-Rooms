"use client";

import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ReservationsTable from "../components/ReservationsTable";

interface Reservation {
  id: string;
  roomId: string;
  roomNumber: number;
  guestName: string;
  email: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface PeriodOption {
  SlotID: number;
  DayNum: number;
  DayName: string;
  PeriodName: string;
  StartTime: string;
  EndTime: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [periodOptions, setPeriodOptions] = useState<PeriodOption[]>([]);
  const [newReservation, setNewReservation] = useState({
    guestName: "",
    email: "",
    roomNumber: "1",
    date: "",
    slotID: "",
  });

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/reservations");
      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }
      const data = await response.json();
      setReservations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching reservations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await fetch("/api/periods");
        if (!response.ok) {
          throw new Error("Failed to fetch periods");
        }
        const data: PeriodOption[] = await response.json();
        setPeriodOptions(data);
      } catch (err) {
        console.error("Error fetching periods:", err);
      }
    };

    fetchPeriods();
  }, []);

  const removeReservation = async (reservationId: string, guestName: string) => {
    if (
      !window.confirm(`Are you sure you want to cancel the reservation for ${guestName}?`)
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/reservations", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reservationID: reservationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove reservation");
      }

      setReservations((prev) => prev.filter((res) => res.id !== reservationId));
      alert(`Reservation for ${guestName} has been cancelled`);
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Failed to remove reservation"}`);
      console.error("Error removing reservation:", err);
    }
  };

  const handleCreateReservation = async () => {
    if (!newReservation.guestName || !newReservation.email || !newReservation.date || !newReservation.slotID) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slotID: Number(newReservation.slotID),
          guestName: newReservation.guestName,
          email: newReservation.email,
          roomID: Number(newReservation.roomNumber),
          reservationDate: newReservation.date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create reservation");
      }

      await fetchReservations();
      alert(`Reservation created for ${newReservation.guestName}`);
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : "Failed to create reservation"}`);
      console.error("Error creating reservation:", err);
      return;
    }

    setNewReservation({
      guestName: "",
      email: "",
      roomNumber: "1",
      date: "",
      slotID: "",
    });
  };

  const selectedWeekday = newReservation.date
    ? ((new Date(`${newReservation.date}T12:00:00`).getDay() + 6) % 7) + 1
    : null;

  const availablePeriods = selectedWeekday
    ? periodOptions
        .filter((period) => period.DayNum === selectedWeekday)
        .sort((a, b) => a.SlotID - b.SlotID)
    : [];

  const selectedPeriod = availablePeriods.find(
    (period) => String(period.SlotID) === newReservation.slotID
  );

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatDateForCalendar = (day: number) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getReservationsForDate = (date: string) => {
    return reservations.filter((res) => res.date === date);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <PageHeader title="Booking Calendar & Reservations" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading && <p className="mb-4 text-gray-700">Loading reservations...</p>}
        {error && <p className="mb-4 text-red-600">{error}</p>}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
          <div className="px-6 py-4 bg-linear-to-r from-red-600 to-red-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Booking Calendar</h3>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="px-4 py-2 bg-white text-red-600 font-semibold rounded transition duration-200 hover:bg-red-50 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer"
            >
              {showCalendar ? "Hide Calendar" : "View Calendar"}
            </button>
          </div>

          {showCalendar && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-linear-to-br from-gray-50 to-white rounded-lg p-6 shadow-inner">
                    <div className="flex justify-between items-center mb-6">
                      <button
                        onClick={previousMonth}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer"
                      >
                        ← Previous
                      </button>
                      <h4 className="text-xl font-bold text-gray-900">
                        {currentDate.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </h4>
                      <button
                        onClick={nextMonth}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer"
                      >
                        Next →
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div
                          key={day}
                          className="text-center font-bold text-gray-700 py-2 bg-gray-100 rounded"
                        >
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square"></div>
                      ))}
                      {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = formatDateForCalendar(day);
                        const dayReservations = getReservationsForDate(dateStr);
                        const hasReservations = dayReservations.length > 0;
                        const isSelected = selectedDate === dateStr;

                        return (
                          <div
                            key={day}
                            className={`aspect-square p-2 rounded-lg border-2 text-center flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md ${
                              isSelected
                                ? "bg-red-600 border-red-700 text-white"
                                : hasReservations
                                ? "bg-red-100 border-red-500 hover:bg-red-200"
                                : "bg-white border-gray-200 hover:border-red-400"
                            }`}
                            onClick={() => {
                              setSelectedDate(dateStr);
                              setNewReservation({ ...newReservation, date: dateStr, slotID: "" });
                            }}
                          >
                            <span className={`font-semibold text-sm ${
                              isSelected ? "text-white" : "text-gray-900"
                            }`}>
                              {day}
                            </span>
                            {hasReservations && !isSelected && (
                              <span className="text-xs font-bold text-red-700 bg-red-200 rounded px-1">
                                {dayReservations.length} booking
                                {dayReservations.length > 1 ? "s" : ""}
                              </span>
                            )}
                            {isSelected && (
                              <span className="text-xs font-bold text-red-100">
                                {dayReservations.length} booking
                                {dayReservations.length > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {newReservation.date && (
                      <div className="mt-6 p-4 bg-white border-2 border-red-200 rounded-lg shadow-sm">
                        <h5 className="font-bold text-gray-900 mb-2 text-sm">
                          📅 Selected: {new Date(newReservation.date).toLocaleDateString()}
                        </h5>
                        <p className="text-xs text-gray-600">
                          Click the &quot;Create Reservation&quot; button below to book this date, or select another date.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="bg-linear-to-br from-red-50 to-white rounded-lg p-6 border-2 border-red-200 shadow-md">
                    <h5 className="text-lg font-bold text-gray-900 mb-4">
                      Create New Reservation
                    </h5>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateReservation();
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Guest Name *
                        </label>
                        <input
                          type="text"
                          value={newReservation.guestName}
                          onChange={(e) =>
                            setNewReservation({
                              ...newReservation,
                              guestName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={newReservation.email}
                          onChange={(e) =>
                            setNewReservation({
                              ...newReservation,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Room Number
                        </label>
                        <select
                          value={newReservation.roomNumber}
                          onChange={(e) =>
                            setNewReservation({
                              ...newReservation,
                              roomNumber: e.target.value,
                            })
                          }
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
                          value={newReservation.date}
                          onChange={(e) =>
                            setNewReservation({
                              ...newReservation,
                              date: e.target.value,
                              slotID: "",
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Period *
                        </label>
                        <select
                          value={newReservation.slotID}
                          onChange={(e) =>
                            setNewReservation({
                              ...newReservation,
                              slotID: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
                          disabled={!newReservation.date}
                        >
                          <option value="">Select a period</option>
                          {availablePeriods.map((period) => (
                            <option key={period.SlotID} value={period.SlotID}>
                              {period.PeriodName} ({period.StartTime} - {period.EndTime})
                            </option>
                          ))}
                        </select>

                        {newReservation.date && availablePeriods.length === 0 && (
                          <p className="text-xs text-amber-700 mt-2">
                            No configured periods for this date.
                          </p>
                        )}

                        {selectedPeriod && (
                          <p className="text-xs text-gray-600 mt-2">
                            Selected: {selectedPeriod.PeriodName} ({selectedPeriod.StartTime} - {selectedPeriod.EndTime})
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 mt-6 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer"
                      >
                        Create Reservation
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedDate && (
          <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
            <div className="px-6 py-4 bg-linear-to-r from-red-600 to-red-700">
              <h3 className="text-lg font-bold text-white">
                Reservations for {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
            </div>
            <div className="p-6">
              <ReservationsTable
                selectedDate={selectedDate}
                reservations={reservations}
                onRemove={removeReservation}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
