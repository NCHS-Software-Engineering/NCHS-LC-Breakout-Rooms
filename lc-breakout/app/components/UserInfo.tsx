'use client'

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Reservation = {
  ReservationID: number;
  RoomID: number;
  SlotID: number;
  ReservationDate: string;
  CreatedAt: string;
  PeriodName: string | null;
  EndTime: string;
};

export default function UserInfo() {
  const { data: session, status } = useSession();
  const [cooldown, setCooldown] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/my-reservations")
        .then(res => res.json())
        .then(data => {
          setCooldown(data.cooldown || null);
          setReservations(Array.isArray(data.reservations) ? data.reservations : []);
        })
        .catch(err => console.error("Failed to fetch reservations:", err));
    }
  }, [session]);

  const handleCancel = async (reservationId: number) => {
    setCancelingId(reservationId);
    setError(null);
    try {
      const response = await fetch(`/api/reservations?reservationId=${reservationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to cancel reservation");
      }

      // Remove the reservation from the list
      setReservations(reservations.filter(r => r.ReservationID !== reservationId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setCancelingId(null);
    }
  };

  const isReservationPassed = (reservation: Reservation) => {
    const now = new Date();
    const [year, month, day] = reservation.ReservationDate.split('-').map(Number);
    const [hours, minutes] = reservation.EndTime.split(':').map(Number);
    
    const slotEndTime = new Date(year, month - 1, day, hours, minutes);
    return now > slotEndTime;
  };

  if (status === "loading") {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="bg-red-400 p-6 rounded-lg shadow-md mb-6 border-red-400 text-center">
        <p className="text-lg font-semibold text-black">Please sign in to see your role</p>
      </div>
    );
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentReservations = reservations.filter(r => 
      new Date(r.ReservationDate) >= sevenDaysAgo
  );

  return (
    <div className="bg-red-400 p-6 rounded-lg shadow-md mb-6 border-red-400">
      <h2 className="text-2xl font-bold mb-4 text-black">Welcome</h2>
      <div className="space-y-2 text-black">
        <p><strong>Name:</strong> {session.user?.name}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
        <p>
          <strong>Role: </strong>{" "}
          <span className={`px-3 py-1 rounded-full font-semibold ${
            session.user?.role === "admin" ? "bg-red-600 text-white" :
            session.user?.role === "teacher" ? "bg-blue-600 text-white" :
            "bg-green-700 text-white"
          }`}>
            {session.user?.role?.toUpperCase() || "STUDENT"}
          </span>
        </p>
        <p><strong>Time Until Next Reservation:</strong> {cooldown ? new Date(cooldown).toLocaleString() : "No cooldown"}</p>
        <div>
          <strong>Your Reservations:</strong>
          {error && <p className="text-red-700 font-semibold mt-2">{error}</p>}
          {recentReservations.length > 0 ? (
            <ul className="ml-4 space-y-2 mt-2">
              {recentReservations.map(r => {
                const isPassed = isReservationPassed(r);
                return (
                  <li key={r.ReservationID} className="flex items-center justify-between bg-red-300 p-2 rounded">
                    <span>
                      Room {r.RoomID}, {`Period ` + r.PeriodName || `Slot ${r.SlotID}`}, Date {r.ReservationDate}
                    </span>
                    <button
                      onClick={() => handleCancel(r.ReservationID)}
                      disabled={cancelingId === r.ReservationID || isPassed}
                      title={isPassed ? "Cannot cancel past reservations" : "Cancel this reservation"}
                      className="ml-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-1 px-3 rounded transition duration-200 text-sm cursor-pointer disabled:cursor-not-allowed"
                    >
                      {cancelingId === r.ReservationID ? "Canceling..." : isPassed ? "Passed" : "Cancel"}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No reservations yet</p>
          )}
        </div>
      </div>
    </div>
  );
}