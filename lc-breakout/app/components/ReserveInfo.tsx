"use client";
import React, { useState, useEffect } from "react";

type Period = {
  DayNum: number;
  DayName: string;
  PeriodName: string;
  StartTime: string;
  EndTime: string; 
  Room1: boolean;
  Room2: boolean;
  Room3: boolean;
}

export default function Home() {
    const [periods, setPeriods] = useState<Period[]>([]);
    const [selectedDay, setSelectedDay] = useState("");

    useEffect(() => {
        async function fetchPeriods() {
            const res = await fetch("/api/periods");
            const data = await res.json();
            setPeriods(data);
        }
        fetchPeriods();
    }, []);

    return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <h1 className="text-4xl font-bold">LC Breakout Room Sign-up</h1>
      <p className="mt-4 text-lg">Sign up for a breakout room session.</p>
    <div className="flex flex-col items-center mt-8">
            <div className="mb-8 flex gap-4 justify-center flex-wrap">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-6 py-2 rounded-lg font-semibold transition cursor-pointer w-36 h-18 ${
                            selectedDay === day
                                ? "bg-blue-600 text-white shadow-lg"
                                : "bg-gray-700 text-white hover:bg-gray-600"
                        }`}
                    >
                        {day}
                    </button>
                ))}
            </div>
            {selectedDay && (
                <div className="w-3/4 flex flex-col items-center">
                    <h2 className="mb-4 text-center text-2xl font-bold text-black dark:text-white">Rooms for {selectedDay}</h2>
                    <table className="min-w-full border-collapse border border-black-300 text-black">
                        <thead>
                            <tr className="bg-red-600 text-white">
                                <th className="border border-black dark:border-gray-300 px-4 py-2 w-70">Period</th>
                                <th className="border border-black dark:border-gray-300 px-4 py-2 w-40">Time</th>
                                <th className="border border-black dark:border-gray-300 px-4 py-2 w-50">Room 1</th>
                                <th className="border border-black dark:border-gray-300 px-4 py-2 w-50">Room 2</th>
                                <th className="border border-black dark:border-gray-300 px-4 py-2 w-50">Room 3</th>
                            </tr>
                        </thead>
                        <tbody>
                            {periods
                                .filter(period => period.DayName === selectedDay)
                                .map((period, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "bg-blue-400" : "bg-blue-300"}>
                                        <td className="border border-black dark:border-gray-300 px-4 py-2">{period.PeriodName}</td>
                                        <td className="border border-black dark:border-gray-300 px-4 py-2">{period.StartTime} - {period.EndTime}</td>
                                        <td className="border border-black dark:border-gray-300 px-4 py-2">{period.Room1 ? "Room 1 Available" : "Room 1 Unavailable"}</td>
                                        <td className="border border-black dark:border-gray-300 px-4 py-2">{period.Room2 ? "Room 2 Available" : "Room 2 Unavailable"}</td>
                                        <td className="border border-black dark:border-gray-300 px-4 py-2">{period.Room3 ? "Room 3 Available" : "Room 3 Unavailable"}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </main>
    
  );
}