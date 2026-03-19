export type Period = {
  SlotID: number;
  DayNum: number;
  DayName: string;
  PeriodName: string;
  StartTime: string;
  EndTime: string;
  Room1: boolean;
  Room2: boolean;
  Room3: boolean;
};

export type SelectedRoom = {
  slotID: number;
  roomNumber: number;
  period: string;
  room: string;
  time: string;
};


