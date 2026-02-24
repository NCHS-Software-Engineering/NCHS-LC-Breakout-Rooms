"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

export default function ReservationsPage() {
  const router = useRouter();

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "res1",
      roomId: "room1",
      roomNumber: 1,
      guestName: "Michael Scott",
      email: "michael.scott@email.com",
      date: "2026-02-11",
      startTime: "02:00 PM",
      endTime: "03:30 PM",
    },
    {
      id: "res2",
      roomId: "room2",
      roomNumber: 2,
      guestName: "Pam Beesly",
      email: "pam.beesly@email.com",
      date: "2026-02-11",
      startTime: "03:00 PM",
      endTime: "04:00 PM",
    },
    {
      id: "res3",
      roomId: "room3",
      roomNumber: 3,
      guestName: "Jim Halpert",
      email: "jim.halpert@email.com",
      date: "2026-02-11",
      startTime: "01:30 PM",
      endTime: "02:30 PM",
    },
    {
      id: "res4",
      roomId: "room1",
      roomNumber: 1,
      guestName: "Dwight Schrute",
      email: "dwight.schrute@email.com",
      date: "2026-02-12",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
    },
    {
      id: "res5",
      roomId: "room2",
      roomNumber: 2,
      guestName: "Angela Martin",
      email: "angela.martin@email.com",
      date: "2026-02-12",
      startTime: "02:00 PM",
      endTime: "03:30 PM",
    },
  ]);

  const [showCalendar, setShowCalendar] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 11));
  const [selectedDate, setSelectedDate] = useState("");

  const [newReservation, setNewReservation] = useState({
    guestName: "",
    email: "",
    roomNumber: "1",
    date: "",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
  });

  const removeReservation = (reservationId: string, guestName: string) => {
    if (
      window.confirm(`Are you sure you want to cancel the reservation for ${guestName}?`)
    ) {
      setReservations(reservations.filter((res) => res.id !== reservationId));
      alert(`Reservation for ${guestName} has been cancelled`);
    }
  };

  const handleCreateReservation = () => {
    if (!newReservation.guestName || !newReservation.email || !newReservation.date) {
      alert("Please fill in all required fields");
      return;
    }

    const newRes: Reservation = {
      id: `res${Date.now()}`,
      roomId: `room${newReservation.roomNumber}`,
      roomNumber: parseInt(newReservation.roomNumber),
      guestName: newReservation.guestName,
      email: newReservation.email,
      date: newReservation.date,
      startTime: newReservation.startTime,
      endTime: newReservation.endTime,
    };

    setReservations([...reservations, newRes]);
    alert(`Reservation created for ${newReservation.guestName}`);
    setNewReservation({
      guestName: "",
      email: "",
      roomNumber: "1",
      date: "",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
    });
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
    return reservations.filter((res) => res.date === date);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <PageHeader title="Booking Calendar & Reservations" />

      <div className="max-w-7xl mx-auto px-6 py-12">
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
                              setNewReservation({ ...newReservation, date: dateStr });
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
                          Click the "Create Reservation" button below to book this date, or select another date.
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
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Start Time
                          </label>
                          <input
                            type="text"
                            value={newReservation.startTime}
                            onChange={(e) =>
                              setNewReservation({
                                ...newReservation,
                                startTime: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
                            placeholder="10:00 AM"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            End Time
                          </label>
                          <input
                            type="text"
                            value={newReservation.endTime}
                            onChange={(e) =>
                              setNewReservation({
                                ...newReservation,
                                endTime: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
                            placeholder="11:00 AM"
                          />
                        </div>
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
