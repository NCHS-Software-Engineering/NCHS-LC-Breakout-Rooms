"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Person {
  id: string;
  name: string;
  email: string;
  checkInTime: string;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  people: Person[];
}

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

export default function ManageRooms() {
  const router = useRouter();
  
  // Mock data for the 3 breakout rooms
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "room1",
      name: "Room 1",
      capacity: 10,
      people: [
        { id: "p1", name: "John Doe", email: "john.doe@email.com", checkInTime: "10:30 AM" },
        { id: "p2", name: "Jane Smith", email: "jane.smith@email.com", checkInTime: "10:32 AM" },
        { id: "p3", name: "Bob Johnson", email: "bob.johnson@email.com", checkInTime: "10:35 AM" },
      ],
    },
    {
      id: "room2",
      name: "Room 2",
      capacity: 10,
      people: [
        { id: "p4", name: "Alice Williams", email: "alice.williams@email.com", checkInTime: "10:31 AM" },
        { id: "p5", name: "Charlie Brown", email: "charlie.brown@email.com", checkInTime: "10:33 AM" },
      ],
    },
    {
      id: "room3",
      name: "Room 3",
      capacity: 10,
      people: [
        { id: "p6", name: "Diana Prince", email: "diana.prince@email.com", checkInTime: "10:28 AM" },
        { id: "p7", name: "Edward Norton", email: "edward.norton@email.com", checkInTime: "10:30 AM" },
        { id: "p8", name: "Fiona Green", email: "fiona.green@email.com", checkInTime: "10:34 AM" },
        { id: "p9", name: "George Miller", email: "george.miller@email.com", checkInTime: "10:36 AM" },
      ],
    },
  ]);

  // Mock reservation data
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
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 11)); // February 11, 2026
  
  // Form state for creating new reservations
  const [newReservation, setNewReservation] = useState({
    guestName: "",
    email: "",
    roomNumber: "1",
    date: "",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    groupSize: "1",
  });

  const removeAllFromRoom = (roomId: string, roomName: string) => {
    if (
      window.confirm(
        `Are you sure you want to remove everyone from ${roomName}? This action cannot be undone.`
      )
    ) {
      setRooms(rooms.map((room) => (room.id === roomId ? { ...room, people: [] } : room)));
      alert(`All people have been removed from ${roomName}`);
    }
  };

  const removeReservation = (reservationId: string, guestName: string) => {
    if (
      window.confirm(`Are you sure you want to cancel the reservation for ${guestName}?`)
    ) {
      setReservations(reservations.filter((res) => res.id !== reservationId));
      alert(`Reservation for ${guestName} has been cancelled`);
    }
  };

  const handleCreateReservation = () => {
    if (
      !newReservation.guestName ||
      !newReservation.email ||
      !newReservation.date
    ) {
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 font-semibold transition duration-200"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Manage Breakout Rooms</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Room Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{room.name}</h2>
                <p className="text-blue-100 text-sm">
                  {room.people.length} / {room.capacity} People
                </p>
              </div>

              {/* Occupancy Bar */}
              <div className="px-6 py-3 bg-gray-50">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(room.people.length / room.capacity) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* People List */}
              <div className="px-6 py-4">
                {room.people.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No one in this room</p>
                ) : (
                  <>
                    <ul className="space-y-3 mb-4">
                      {room.people.map((person) => (
                        <li
                          key={person.id}
                          className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-200"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{person.name}</p>
                            <p className="text-gray-600 text-sm">{person.email}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              Check-in: {person.checkInTime}
                            </p>
                          </div>
                          <button
                            className="ml-2 px-3 py-1 text-red-600 hover:bg-red-100 rounded transition duration-200 text-sm"
                            onClick={() => {
                              // Remove person from room logic would go here
                              alert(`Remove ${person.name} from ${room.name}`);
                            }}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => removeAllFromRoom(room.id, room.name)}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 text-sm"
                    >
                      Remove All from {room.name}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div key={room.id} className="p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700 font-semibold">{room.name}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{room.people.length}</p>
                <p className="text-gray-600 text-sm">People checked in</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reservation Calendar Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Booking Calendar & Reservations</h3>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="px-4 py-2 bg-white text-purple-600 font-semibold rounded transition duration-200 hover:bg-purple-50"
            >
              {showCalendar ? "Hide Calendar" : "View Calendar"}
            </button>
          </div>

          {showCalendar && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <button
                        onClick={previousMonth}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold transition duration-200"
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
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold transition duration-200"
                      >
                        Next →
                      </button>
                    </div>

                    {/* Calendar Grid */}
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
                                ? "bg-purple-100 border-purple-500"
                                : "bg-white border-gray-200 hover:border-purple-400"
                            }`}
                            onClick={() => {
                              setNewReservation({ ...newReservation, date: dateStr });
                            }}
                          >
                            <span className="font-semibold text-gray-900 text-sm">
                              {day}
                            </span>
                            {hasReservations && (
                              <span className="text-xs font-bold text-purple-600 bg-purple-200 rounded px-1">
                                {dayReservations.length} booking
                                {dayReservations.length > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Selected Date Reservations */}
                    {newReservation.date && (
                      <div className="mt-6 p-4 bg-white border-2 border-purple-200 rounded-lg">
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
                                className="p-2 bg-purple-50 rounded border-l-4 border-purple-500"
                              >
                                <p className="text-sm font-semibold text-gray-900">
                                  room {res.roomNumber}: {res.startTime} - {res.endTime}
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

                {/* New Reservation Form */}
                <div>
                  <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition duration-200 mt-6"
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

        {/* Future Reservations Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Future Reservations</h3>
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="px-4 py-2 bg-white text-green-600 font-semibold rounded transition duration-200 hover:bg-green-50"
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
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
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

        {/* Complete Schedule View */}
        {showSchedule && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Complete Future Schedule</h3>
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
                            className="p-3 bg-green-50 border border-green-200 rounded"
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
