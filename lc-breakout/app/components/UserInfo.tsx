'use client'

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Reservation = {
  RoomID: number;
  SlotID: number;
  ReservationDate: string;
  CreatedAt: string;
  PeriodName: string | null;
};

export default function UserInfo() {
  const { data: session, status } = useSession();
  const [cooldown, setCooldown] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

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
          {recentReservations.length > 0 ? (
            <ul className="ml-4 list-disc">
              {recentReservations.map(r => (
                <li key={`${r.RoomID}-${r.SlotID}-${r.ReservationDate}`}>
                  Room {r.RoomID}, {`Period ` + r.PeriodName || `Slot ${r.SlotID}`}, Date {r.ReservationDate}
                </li>
              ))}
            </ul>
          ) : (
            <p>No reservations yet</p>
          )}
        </div>
      </div>
    </div>
  );
}