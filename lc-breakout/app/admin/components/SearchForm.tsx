interface SearchFormProps {
  searchType: "name" | "id";
  searchQuery: string;
  onSearchTypeChange: (type: "name" | "id") => void;
  onSearchQueryChange: (query: string) => void;
}

export default function SearchForm({
  searchType,
  searchQuery,
  onSearchTypeChange,
  onSearchQueryChange,
}: SearchFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900">Search Users</h2>
      <p className="text-gray-600 mt-1">
        Search by display name or by email.
      </p>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search-type" className="block text-sm font-semibold text-gray-700 mb-1">
            Search Type
          </label>
          <select
            id="search-type"
            value={searchType}
            onChange={(e) => {
              onSearchTypeChange(e.target.value as "name" | "id");
              onSearchQueryChange("");
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          >
            <option value="name">Name</option>
            <option value="id">Email</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="search-query" className="block text-sm font-semibold text-gray-700 mb-1">
            {searchType === "name" ? "Name" : "Student ID"}
          </label>
          <input
            id="search-query"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={searchType === "name" ? "e.g. Jane Smith" : "e.g. name@domain.com"}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          />
        </div>
      </div>
    </div>
  );
}
