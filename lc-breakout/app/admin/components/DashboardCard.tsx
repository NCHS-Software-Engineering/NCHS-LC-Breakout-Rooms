import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function DashboardCard({
  title,
  description,
  children,
  action,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
      <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {children}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
