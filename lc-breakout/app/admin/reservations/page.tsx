"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <nav className="bg-white shadow-md border-b border-red-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-red-600 hover:text-red-800 font-semibold transition duration-200"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Booking Calendar & Reservations</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Booking Calendar</h3>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="px-4 py-2 bg-white text-red-600 font-semibold rounded transition duration-200 hover:bg-red-50"
            >
              {showCalendar ? "Hide Calendar" : "View Calendar"}
            </button>
          </div>

          {showCalendar && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <button
                        onClick={previousMonth}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition duration-200"
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
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold transition duration-200"
                      >
                        Next →
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div
                          key={day}
                          className="text-center font-bold text-gray-700 py-2"
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
                            className={`aspect-square p-2 rounded-lg border-2 text-center flex flex-col justify-between cursor-pointer transition duration-200 hover:shadow-md ${
                              hasReservations
                                ? "bg-red-100 border-red-500"
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
                      <div className="mt-6 p-4 bg-white border-2 border-red-200 rounded-lg">
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
                  <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>

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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="11:00 AM"
                        />
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 mt-6"
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

        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Upcoming Reservations</h3>
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="px-4 py-2 bg-white text-red-600 font-semibold rounded transition duration-200 hover:bg-red-50"
            >
              {showSchedule ? "Hide Schedule" : "View Full Schedule"}
            </button>
          </div>

          {reservations.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p>No upcoming reservations</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Guest Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Group Size
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="border-b hover:bg-gray-50 transition duration-200"
                    >
                      <td className="px-6 py-3">
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                          Room {reservation.roomNumber}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                        {reservation.guestName}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{reservation.email}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {new Date(reservation.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {reservation.startTime} - {reservation.endTime}
                      </td>
                      <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                        {reservation.groupSize} people
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() =>
                            removeReservation(reservation.id, reservation.guestName)
                          }
                          className="px-3 py-1 text-red-600 hover:bg-red-100 rounded transition duration-200 text-sm font-semibold"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showSchedule && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Complete Upcoming Schedule</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((roomNum) => {
                const roomReservations = reservations.filter((r) => r.roomNumber === roomNum);
                return (
                  <div key={roomNum} className="border border-gray-300 rounded-lg p-4">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">
                      Room {roomNum}
                    </h4>
                    {roomReservations.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No reservations</p>
                    ) : (
                      <div className="space-y-3">
                        {roomReservations.map((reservation) => (
                          <div
                            key={reservation.id}
                            className="p-3 bg-red-50 border border-red-200 rounded"
                          >
                            <p className="font-semibold text-gray-900">
                              {reservation.guestName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(reservation.date).toLocaleDateString()}
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
                              className="mt-2 w-full px-2 py-1 text-red-600 hover:bg-red-100 rounded transition duration-200 text-xs font-semibold"
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
