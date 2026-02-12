import AdminLoginForm from "../components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              LC Breakout Rooms Management
            </p>
          </div>
          
          <AdminLoginForm />
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              For account issues, please contact{" "}
              <span className="font-semibold">system administrator</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
