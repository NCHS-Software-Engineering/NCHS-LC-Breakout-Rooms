export interface Period {
  label: string;
  start: string;
  end: string;
}

export interface ScheduleByDay {
  [key: string]: Period[];
}

export const SCHOOL_SCHEDULE: ScheduleByDay = {
  Monday: [
    { label: "Period 1", start: "7:45 AM", end: "8:35 AM" },
    { label: "Period 2", start: "8:41 AM", end: "9:34 AM" },
    { label: "Period 3", start: "9:40 AM", end: "10:30 AM" },
    { label: "Period 4", start: "10:36 AM", end: "11:26 AM" },
    { label: "Period 5", start: "11:32 AM", end: "12:22 PM" },
    { label: "Period 6", start: "12:28 PM", end: "1:18 PM" },
    { label: "Period 7", start: "1:24 PM", end: "2:14 PM" },
    { label: "Period 8", start: "2:20 PM", end: "3:10 PM" },
  ],
  Tuesday: [
    { label: "Period 1", start: "7:45 AM", end: "8:30 AM" },
    { label: "Period 2", start: "8:35 AM", end: "9:20 AM" },
    { label: "SOAR", start: "9:25 AM", end: "10:10 AM" },
    { label: "Period 3", start: "10:15 AM", end: "11:00 AM" },
    { label: "Period 4", start: "11:05 AM", end: "11:50 AM" },
    { label: "Period 5", start: "11:55 AM", end: "12:40 PM" },
    { label: "Period 6", start: "12:45 PM", end: "1:30 PM" },
    { label: "Period 7", start: "1:35 PM", end: "2:20 PM" },
    { label: "Period 8", start: "2:25 PM", end: "3:10 PM" },
  ],
  Wednesday: [
    { label: "Period 1", start: "9:00 AM", end: "9:42 AM" },
    { label: "Period 2", start: "9:47 AM", end: "10:29 AM" },
    { label: "Period 3", start: "10:34 AM", end: "11:16 AM" },
    { label: "Period 4", start: "11:21 AM", end: "12:03 PM" },
    { label: "Period 5", start: "12:08 PM", end: "12:49 PM" },
    { label: "Period 6", start: "12:54 PM", end: "1:36 PM" },
    { label: "Period 7", start: "1:41 PM", end: "2:23 PM" },
    { label: "Period 8", start: "2:28 PM", end: "3:10 PM" },
  ],
  Thursday: [
    { label: "Period 1", start: "7:45 AM", end: "8:30 AM" },
    { label: "Period 2", start: "8:35 AM", end: "9:20 AM" },
    { label: "SOAR", start: "9:25 AM", end: "10:10 AM" },
    { label: "Period 3", start: "10:15 AM", end: "11:00 AM" },
    { label: "Period 4", start: "11:05 AM", end: "11:50 AM" },
    { label: "Period 5", start: "11:55 AM", end: "12:40 PM" },
    { label: "Period 6", start: "12:45 PM", end: "1:30 PM" },
    { label: "Period 7", start: "1:35 PM", end: "2:20 PM" },
    { label: "Period 8", start: "2:25 PM", end: "3:10 PM" },
  ],
  Friday: [
    { label: "Period 1", start: "7:45 AM", end: "8:35 AM" },
    { label: "Period 2", start: "8:41 AM", end: "9:34 AM" },
    { label: "Period 3", start: "9:40 AM", end: "10:30 AM" },
    { label: "Period 4", start: "10:36 AM", end: "11:26 AM" },
    { label: "Period 5", start: "11:32 AM", end: "12:22 PM" },
    { label: "Period 6", start: "12:28 PM", end: "1:18 PM" },
    { label: "Period 7", start: "1:24 PM", end: "2:14 PM" },
    { label: "Period 8", start: "2:20 PM", end: "3:10 PM" },
  ],
};
