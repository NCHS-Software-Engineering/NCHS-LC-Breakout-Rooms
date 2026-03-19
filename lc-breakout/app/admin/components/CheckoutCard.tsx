interface CheckoutCardProps {
  room: string;
  guestName: string;
  endTime: string;
}

export default function CheckoutCard({ room, guestName, endTime }: CheckoutCardProps) {
  return (
    <div className="border border-red-100 rounded-lg p-4 bg-linear-to-br from-white to-red-50 hover:border-red-300 transition-colors duration-200">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <p className="text-sm font-semibold text-gray-500 uppercase">{room}</p>
      </div>
      <p className="text-lg font-bold text-gray-900 mb-2">{guestName}</p>
      <p className="text-sm text-red-600 font-medium flex items-center gap-1">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Checkout by {endTime}
      </p>
    </div>
  );
}
