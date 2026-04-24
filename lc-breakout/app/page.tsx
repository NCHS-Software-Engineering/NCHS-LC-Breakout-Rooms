import ReserveInfo from "./components/ReserveInfo";
import UserInfo from "./components/UserInfo";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 pb-8 pt-6 sm:px-6 sm:pt-8 lg:px-10 lg:pb-12">
      <UserInfo />
      <ReserveInfo />
    </main>
  );
}
