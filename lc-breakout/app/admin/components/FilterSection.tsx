interface FilterSectionProps {
  searchName: string;
  searchRoom: string;
  searchDate: string;
  sortBy: "date" | "name" | "room";
  sortOrder: "asc" | "desc";
  onSearchNameChange: (value: string) => void;
  onSearchRoomChange: (value: string) => void;
  onSearchDateChange: (value: string) => void;
  onSortByChange: (value: "date" | "name" | "room") => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
  onClearFilters: () => void;
}

export default function FilterSection({
  searchName,
  searchRoom,
  searchDate,
  sortBy,
  sortOrder,
  onSearchNameChange,
  onSearchRoomChange,
  onSearchDateChange,
  onSortByChange,
  onSortOrderChange,
  onClearFilters,
}: FilterSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search by Name or Email
          </label>
          <input
            type="text"
            placeholder="Enter name or email..."
            value={searchName}
            onChange={(e) => onSearchNameChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Filter by Room
          </label>
          <select
            value={searchRoom}
            onChange={(e) => onSearchRoomChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
          >
            <option value="">All Rooms</option>
            <option value="1">Room 1</option>
            <option value="2">Room 2</option>
            <option value="3">Room 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Filter by Date
          </label>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => onSearchDateChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg active:scale-95 transform cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as "date" | "name" | "room")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="room">Room</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Order
          </label>
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as "asc" | "desc")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-900"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </div>
  );
}
