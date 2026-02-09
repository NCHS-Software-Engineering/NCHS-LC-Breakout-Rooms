import Image from "next/image";
import ReserveInfo from "./components/ReserveInfo";

export default function Home() {
  return (
    <main className="flex min-h-full min-h-screen flex-col justify-between pr-24 pl-24 pb-24 pt-10">
      <ReserveInfo />
    </main>
  );
}
