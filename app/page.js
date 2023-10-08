import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

export default function Home() {
  return (
    <main className="light:bg-blue-500">
      <span className="py-32 text-green-200 sm:text-blue-500 text-4xl">
        Hello world <FcGoogle /> How is it going?
      </span>
    </main>
  );
}
