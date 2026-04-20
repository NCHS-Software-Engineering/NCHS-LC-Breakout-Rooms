export interface Occupant {
  reservationId: string;
  id: string;
  name: string;
  email: string;
  period?: string;
  startTime?: string;
  endTime?: string;
}

export interface AdminRoom {
  id: string;
  name: string;
  currentOccupant: Occupant | null;
}

export interface AdminReservation {
  id: string;
  roomId: string;
  roomNumber: number;
  guestName: string;
  email: string;
  date: string;
  period: string;
  slotId: number;
  startTime: string;
  endTime: string;
}

export interface ManagedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  cooldownEndsAt?: string | null;
  role?: "admin" | "teacher" | "student";
}

export interface PeriodOption {
  slotId: number;
  label: string;
  startTime: string;
  endTime: string;
  roomAvailability: {
    1: boolean;
    2: boolean;
    3: boolean;
  };
}
