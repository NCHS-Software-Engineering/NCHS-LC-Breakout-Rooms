"use client";

import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
}

export default function PageHeader({ title, showBackButton = true }: PageHeaderProps) {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-md border-b border-red-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="text-red-600 hover:text-red-800 font-semibold transition duration-200 flex items-center gap-2 group cursor-pointer"
            aria-label="Go back to previous page"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
    </nav>
  );
}
