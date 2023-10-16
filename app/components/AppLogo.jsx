import Image from "next/image";
import getVersion from "../utils/getVersion";

export default function AppLogo() {
  const version = getVersion();
  return (
    <div className="relative">
      <Image src="/habit-journey-logo.png" alt="Habit Journey Logo" width={80} height={80} className="" />
      <span className="absolute bottom-0 text-xs font-semibold text-white text-shadow-sm shadow-black right-2 ">{version}</span>
    </div>
  );
}
