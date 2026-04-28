"use client";

export default function SkipLink() {
  const handleSkipClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleSkipClick}
      className="absolute left-0 top-0 -translate-x-full px-4 py-2 bg-red-600 text-white font-bold focus:translate-x-0 focus:z-50 transition-transform duration-200"
      aria-label="Skip to Main Content"
    >
      Skip to Main Content
    </a>
  );
}
