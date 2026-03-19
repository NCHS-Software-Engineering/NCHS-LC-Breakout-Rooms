interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "highlight";
}

export default function StatCard({
  label,
  value,
  subtitle,
  variant = "default",
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 ${
        variant === "highlight" ? "border-2 border-red-500" : ""
      }`}
    >
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <h2 className="text-2xl font-bold text-gray-900 mt-2">{value}</h2>
      {subtitle && <p className="text-gray-600 mt-2 text-sm">{subtitle}</p>}
    </div>
  );
}
