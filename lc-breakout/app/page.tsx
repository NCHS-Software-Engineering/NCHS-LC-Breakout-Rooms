import Image from "next/image";
import ReserveInfo from "./components/ReserveInfo";

export default function Home() {
  return (
    <main className="flex min-h-full min-h-screen flex-col justify-between p-24">
      <ReserveInfo />
    </main>
  );
}
