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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">LC Breakout Room Sign-up</h1>
      <p className="mt-4 text-lg">Sign up for a breakout room session.</p>
    <div className="flex flex-col items-center mt-8">
            <div className="mb-8 text-center w-1/2">
                <select
                    className="block w-full rounded-lg border border-gray-300 bg-gray-700 p-2.5 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                >
                    <option value="">Choose a day in the week...</option>

                    {periods.map(period => (
                    <option key={period.DayName} value={period.DayName}>
                        {period.DayName}
                    </option>
                    ))}
                </select>
            </div>
            {selectedDay && (
                <div className="w-3/4">
                    <h2 className="mb-4 text-center text-white">Inventory for {selectedDay}</h2>
                    <table className="min-w-full border-collapse border border-gray-300 text-black">
                        <thead>
                            <tr className="bg-purple-400">
                                <th className="border border-gray-300 px-4 py-2">Movie Title</th>
                                <th className="border border-gray-300 px-4 py-2">Price</th>
                                <th className="border border-gray-300 px-4 py-2">Director First</th>
                                <th className="border border-gray-300 px-4 py-2">Director Last</th>
                                <th className="border border-gray-300 px-4 py-2">Copies On Hand</th>
                            </tr>
                        </thead>
                        <tbody>
                            {periods
                                .filter(period => period.DayName === selectedDay)
                                .map((period, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "bg-blue-400" : "bg-blue-300"}>
                                        <td className="border border-gray-300 px-4 py-2">{period.PeriodName}</td>
                                        <td className="border border-gray-300 px-4 py-2">{period.StartTime}</td>
                                        <td className="border border-gray-300 px-4 py-2">{period.EndTime}</td>
                                        <td className="border border-gray-300 px-4 py-2">{period.Room1 ? "Room 1 Available" : "Room 1 Unavailable"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{period.Room2 ? "Room 2 Available" : "Room 2 Unavailable"}</td>
                                        <td className="border border-gray-300 px-4 py-2">{period.Room3 ? "Room 3 Available" : "Room 3 Unavailable"}</td>
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