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
    const [input, setInput] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedRoom, setSelectedRoom] = useState<{periodIndex: number; roomNumber: number; period: string; room: string; time: string} | null>(null);

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
                        onClick={() => {setSelectedDay(day); setSelectedRoom(null);}}
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
                    <div className="flex flex-col items-center bg-red-400 text-black rounded-xl w-full p-6 shadow-lg mb-4">
                        {selectedRoom ? (
                            <div className="flex gap-2 items-center w-full">
                                <input
                                    type="text"
                                    value = {input}
                                    onChange = {(e) => setInput(e.target.value.slice(0, 5))}
                                    placeholder="Enter ID"
                                    maxLength={5}
                                    className="w-32 px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-white text-black placeholder-gray-500 transition-all duration-200 text-base font-medium text-center"
                                />
                                <button
                                    onClick={() => input.length === 5 && alert(`ID: ${input}, Room: ${selectedRoom.room}`)}
                                    disabled={input.length < 1}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold cursor-pointer hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                                >
                                    Enter
                                </button>
                            </div>
                        ) : (
                            <div className="w-full text-center text-lg font-semibold text-gray-700">
                                Select a room from below.
                            </div>
                        )}
                    </div>
                    {selectedRoom && (
                        <div className="mb-4 p-4 bg-blue-100 border-2 border-blue-500 rounded-lg text-black font-semibold text-lg w-full text-center">
                            Selected: {selectedRoom.period} at {selectedRoom.time} - {selectedRoom.room}
                        </div>
                    )}
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
                                    <tr key={index} className={index % 2 === 0 ? "bg-gray-300" : "bg-gray-100"}>
                                        <td className="border border-black dark:border-gray-300 px-4 py-2 font-bold">{period.PeriodName}</td>
                                        <td className="border border-black dark:border-gray-300 px-4 py-2">{period.StartTime} - {period.EndTime}</td>
                                        <td 
                                            onClick={() => {
                                                if (period.Room1) {
                                                    setSelectedRoom({periodIndex: index, roomNumber: 1, period: period.PeriodName, room: "Room 1", time: `${period.StartTime} - ${period.EndTime}`});
                                                    setInput("");
                                                }
                                            }}
                                            className={`border border-black dark:border-gray-300 px-4 py-2 cursor-pointer transition ${
                                                period.Room1 
                                                    ? selectedRoom?.periodIndex === index && selectedRoom?.roomNumber === 1
                                                        ? "bg-yellow-400 font-bold" 
                                                        : "hover:bg-gray-200"
                                                    : "opacity-50 cursor-not-allowed"
                                            }`}>
                                            {period.Room1 ? "Vacant" : "Occupied"}
                                        </td>
                                        <td 
                                            onClick={() => {
                                                if (period.Room2) {
                                                    setSelectedRoom({periodIndex: index, roomNumber: 2, period: period.PeriodName, room: "Room 2", time: `${period.StartTime} - ${period.EndTime}`});
                                                    setInput("");
                                                }
                                            }}
                                            className={`border border-black dark:border-gray-300 px-4 py-2 cursor-pointer transition ${
                                                period.Room2 
                                                    ? selectedRoom?.periodIndex === index && selectedRoom?.roomNumber === 2
                                                        ? "bg-yellow-400 font-bold" 
                                                        : "hover:bg-gray-200"
                                                    : "opacity-50 cursor-not-allowed"
                                            }`}>
                                            {period.Room2 ? "Vacant" : "Occupied"}
                                        </td>
                                        <td 
                                            onClick={() => {
                                                if (period.Room3) {
                                                    setSelectedRoom({periodIndex: index, roomNumber: 3, period: period.PeriodName, room: "Room 3", time: `${period.StartTime} - ${period.EndTime}`});
                                                    setInput("");
                                                }
                                            }}
                                            className={`border border-black dark:border-gray-300 px-4 py-2 cursor-pointer transition ${
                                                period.Room3 
                                                    ? selectedRoom?.periodIndex === index && selectedRoom?.roomNumber === 3
                                                        ? "bg-yellow-400 font-bold" 
                                                        : "hover:bg-gray-200"
                                                    : "opacity-50 cursor-not-allowed"
                                            }`}>
                                            {period.Room3 ? "Vacant" : "Occupied"}
                                        </td>
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