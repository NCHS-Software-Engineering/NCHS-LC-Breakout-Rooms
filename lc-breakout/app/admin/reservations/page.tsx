"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PageHeader from "../components/PageHeader";
import ReservationCard from "../components/ReservationCard";
import EmptyState from "../components/EmptyState";

interface Reservation {
  id: string;
  roomId: string;
  roomNumber: number;
  guestName: string;
  email: string;
  date: string;
  startTime: string;
  endTime: string;
  groupSize: number;
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
      groupSize: 5,
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
      groupSize: 3,
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
      groupSize: 4,
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
      groupSize: 2,
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
      groupSize: 6,
    },
  ]);

  const [showSchedule, setShowSchedule] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 11));

  const [newReservation, setNewReservation] = useState({
    guestName: "",
    email: "",
    roomNumber: "1",
    date: "",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    groupSize: "1",
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
      groupSize: parseInt(newReservation.groupSize),
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
      groupSize: "1",
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

  const getReservationsForDate = (date: string) => {
    return reservations.filter((res) => res.date === date);
  };

  const formatDateForCalendar = (day: number) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
              className="px-4 py-2 bg-white text-red-600 font-semibold rounded transition duration-200 hover:bg-red-50 shadow-md hover:shadow-lg active:scale-95 transform"
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
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform"
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
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform"
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

                        return (
                          <div
                            key={day}
                            className={`aspect-square p-2 rounded-lg border-2 text-center flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-md ${
                              hasReservations
                                ? "bg-red-100 border-red-500 hover:bg-red-200"
                                : "bg-white border-gray-200 hover:border-red-400"
                            }`}
                            onClick={() => {
                              setNewReservation({ ...newReservation, date: dateStr });
                            }}
                          >
                            <span className="font-semibold text-gray-900 text-sm">
                              {day}
                            </span>
                            {hasReservations && (
                              <span className="text-xs font-bold text-red-700 bg-red-200 rounded px-1">
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
                        <h5 className="font-bold text-gray-900 mb-3">
                          Reservations for {new Date(newReservation.date).toLocaleDateString()}
                        </h5>
                        {getReservationsForDate(newReservation.date).length === 0 ? (
                          <p className="text-gray-500 text-sm">No reservations for this date</p>
                        ) : (
                          <div className="space-y-2">
                            {getReservationsForDate(newReservation.date).map((res) => (
                              <div
                                key={res.id}
                                className="p-2 bg-red-50 rounded border-l-4 border-red-500"
                              >
                                <p className="text-sm font-semibold text-gray-900">
                                  Room {res.roomNumber}: {res.startTime} - {res.endTime}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {res.guestName} ({res.groupSize} people)
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
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

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Group Size
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newReservation.groupSize}
                          onChange={(e) =>
                            setNewReservation({
                              ...newReservation,
                              groupSize: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 mt-6 shadow-md hover:shadow-lg active:scale-95 transform"
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

        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
          <div className="px-6 py-4 bg-linear-to-r from-red-600 to-red-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Upcoming Reservations</h3>
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="px-4 py-2 bg-white text-red-600 font-semibold rounded transition duration-200 hover:bg-red-50 shadow-md hover:shadow-lg active:scale-95 transform"
            >
              {showSchedule ? "Hide Schedule" : "View Full Schedule"}
            </button>
          </div>

          {reservations.length === 0 ? (
            <div className="p-8">
              <EmptyState message="No upcoming reservations" />
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {reservations.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  onRemove={removeReservation}
                />
              ))}
            </div>
          )}
        </div>

        {showSchedule && reservations.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Complete Upcoming Schedule</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((roomNum) => {
                const roomReservations = reservations.filter((r) => r.roomNumber === roomNum);
                return (
                  <div
                    key={roomNum}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-red-500">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold">
                        {roomNum}
                      </span>
                      <h4 className="text-lg font-bold text-gray-900">Room {roomNum}</h4>
                    </div>
                    {roomReservations.length === 0 ? (
                      <div className="text-center py-8">
                        <svg
                          className="w-12 h-12 text-gray-400 mx-auto mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-gray-500 text-sm">No reservations</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {roomReservations.map((reservation) => (
                          <div
                            key={reservation.id}
                            className="p-3 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors duration-200"
                          >
                            <p className="font-semibold text-gray-900">
                              {reservation.guestName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(reservation.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-sm text-gray-600">
                              {reservation.startTime} - {reservation.endTime}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {reservation.groupSize} people
                            </p>
                            <button
                              onClick={() =>
                                removeReservation(reservation.id, reservation.guestName)
                              }
                              className="mt-2 w-full px-2 py-1 text-red-600 hover:bg-red-200 rounded transition duration-200 text-xs font-semibold"
                            >
                              Cancel Reservation
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
