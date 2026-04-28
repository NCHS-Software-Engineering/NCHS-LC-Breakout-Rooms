import AdminLoginForm from "../components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-red-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              LC Breakout Rooms Management
            </p>
          </div>
          
          <AdminLoginForm />
          
          <div className="mt-6 text-center text-sm text-gray-600 border-t border-gray-200 pt-6">
            <p>
              For account issues, please contact{" "}
              <span className="font-semibold text-red-600">system administrator</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
