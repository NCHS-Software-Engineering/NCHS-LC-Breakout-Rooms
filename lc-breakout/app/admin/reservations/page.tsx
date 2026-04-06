"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import ReservationsTable from "../components/ReservationsTable";
import { AdminReservation, PeriodOption } from "../lib/types";
import { useAdminGuard } from "../lib/useAdminGuard";

interface ApiPeriod {
  PeriodName: string;
  StartTime: string;
  EndTime: string;
  SlotID: number;
  Room1: boolean;
  Room2: boolean;
  Room3: boolean;
}

export default function ReservationsPage() {
  const { isAuthorized, isCheckingAuth } = useAdminGuard();
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const [showCalendar, setShowCalendar] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()));

  const [periodOptions, setPeriodOptions] = useState<PeriodOption[]>([]);
  const [isLoadingPeriods, setIsLoadingPeriods] = useState(false);

  const [newReservation, setNewReservation] = useState({
    guestName: "",
    email: "",
    roomNumber: "1",
    date: new Date().toISOString().slice(0, 10),
    slotId: "",
  });

  const loadReservations = async () => {
    setIsLoadingReservations(true);
    try {
      const response = await fetch("/api/admin/reservations", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }

      const data = await response.json();
      setReservations(Array.isArray(data.reservations) ? data.reservations : []);
    } catch (error) {
      console.error(error);
      setReservations([]);
    } finally {
      setIsLoadingReservations(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      loadReservations();
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (!isAuthorized || !newReservation.date) {
      setPeriodOptions([]);
      return;
    }

    const loadPeriods = async () => {
      setIsLoadingPeriods(true);
      try {
        const response = await fetch(`/api/periods?date=${encodeURIComponent(newReservation.date)}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch periods");
        }

        const data = await response.json();
        const options: PeriodOption[] = Array.isArray(data)
          ? data.map((period: ApiPeriod) => ({
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
  }, [isAuthorized, newReservation.date]);

  useEffect(() => {
    const roomNumber = Number(newReservation.roomNumber) as 1 | 2 | 3;

    const currentSelection = periodOptions.find(
      (option) => String(option.slotId) === newReservation.slotId
    );

    if (currentSelection && currentSelection.roomAvailability[roomNumber]) {
      return;
    }

    const firstAvailable = periodOptions.find((option) => option.roomAvailability[roomNumber]);
    setNewReservation((prev) => ({
      ...prev,
      slotId: firstAvailable ? String(firstAvailable.slotId) : "",
    }));
  }, [newReservation.roomNumber, newReservation.slotId, periodOptions]);

  const selectedPeriod = useMemo(
    () => periodOptions.find((option) => String(option.slotId) === newReservation.slotId),
    [newReservation.slotId, periodOptions]
  );

  const removeReservation = async (reservationId: string, guestName: string) => {
    if (!window.confirm(`Are you sure you want to cancel the reservation for ${guestName}?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/reservations?reservationId=${encodeURIComponent(reservationId)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        window.alert(errorData.error || "Failed to cancel reservation");
        return;
      }

      await loadReservations();
      window.alert(`Reservation for ${guestName} has been cancelled`);
    } catch (error) {
      console.error(error);
      window.alert("Failed to cancel reservation");
    }
  };

  const handleCreateReservation = async () => {
    if (!newReservation.guestName || !newReservation.email || !newReservation.date || !newReservation.slotId) {
      window.alert("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: newReservation.guestName,
          email: newReservation.email,
          roomNumber: Number(newReservation.roomNumber),
          date: newReservation.date,
          slotId: Number(newReservation.slotId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        window.alert(errorData.error || "Failed to create reservation");
        return;
      }

      await loadReservations();
      window.alert(`Reservation created for ${newReservation.guestName}`);
      setNewReservation((prev) => ({
        ...prev,
        guestName: "",
        email: "",
      }));
    } catch (error) {
      console.error(error);
      window.alert("Failed to create reservation");
    } finally {
      setIsCreating(false);
    }
  };

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
    return reservations.filter((reservation) => reservation.date === date);
  };

  if (isCheckingAuth || !isAuthorized) {
    return (
      <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center">
        <p className="text-gray-700 font-semibold">Loading reservations...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <PageHeader title="Booking Calendar & Reservations" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoadingReservations ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-600 font-medium mb-8">
            Loading reservations...
          </div>
        ) : null}

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
                        Previous
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
                        Next
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
                              setNewReservation((prev) => ({ ...prev, date: dateStr }));
                            }}
                          >
                            <span className={`font-semibold text-sm ${isSelected ? "text-white" : "text-gray-900"}`}>
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
                          Selected: {new Date(newReservation.date + "T00:00:00").toLocaleDateString()}
                        </h5>
                        <p className="text-xs text-gray-600">
                          Pick a room and period, then create the reservation.
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
                      onSubmit={(event) => {
                        event.preventDefault();
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
                          onChange={(event) =>
                            setNewReservation({
                              ...newReservation,
                              guestName: event.target.value,
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
                          onChange={(event) =>
                            setNewReservation({
                              ...newReservation,
                              email: event.target.value,
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
                          onChange={(event) =>
                            setNewReservation({
                              ...newReservation,
                              roomNumber: event.target.value,
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
                          onChange={(event) =>
                            setNewReservation({
                              ...newReservation,
                              date: event.target.value,
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
                          value={newReservation.slotId}
                          onChange={(event) =>
                            setNewReservation({
                              ...newReservation,
                              slotId: event.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
                          disabled={isLoadingPeriods || periodOptions.length === 0}
                        >
                          {periodOptions.length === 0 ? (
                            <option value="">No available periods</option>
                          ) : (
                            periodOptions
                              .filter((option) => option.roomAvailability[Number(newReservation.roomNumber) as 1 | 2 | 3])
                              .map((option) => (
                                <option key={option.slotId} value={option.slotId}>
                                  {option.label} ({option.startTime} - {option.endTime})
                                </option>
                              ))
                          )}
                        </select>
                      </div>

                      {selectedPeriod ? (
                        <p className="text-xs text-gray-600 bg-white border border-red-100 rounded p-2">
                          Selected slot: {selectedPeriod.label} ({selectedPeriod.startTime} - {selectedPeriod.endTime})
                        </p>
                      ) : null}

                      <button
                        type="submit"
                        disabled={isCreating || !newReservation.slotId}
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition duration-200 mt-6 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer disabled:cursor-not-allowed"
                      >
                        {isCreating ? "Creating..." : "Create Reservation"}
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
