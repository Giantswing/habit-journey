import { AiOutlineClose } from "react-icons/ai";
import { useAuthContext } from "../context/AuthContext";
import Toggle from "./Toggle";
import AppLogo from "./AppLogo";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SideMenu() {
  const { user, logout, darkMode, setDarkMode, soundEnabled, setSoundEnabled } = useAuthContext();
  const searchParams = useSearchParams();
  const showSideMenu = searchParams.get("settings") != undefined;
  const router = useRouter();

  return (
    <>
      <div
        className={`
        ${showSideMenu ? "translate-x" : "translate-x-full opacity-0"}
        p-4 pt-7 fixed max-w-lg top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full z-50 transtion-transform ease-out-expo duration-300 
        `}
      >
        <div className="relative flex justify-end block w-full mb-8 text-right">
          <Link href="/" className="text-white">
            <AiOutlineClose size={30} />
          </Link>
        </div>

        <div className="relative flex flex-col items-center gap-4 pb-4 mb-8 border-b border-pale-600">
          <AppLogo />
          <h2 className="text-4xl font-semibold text-center text-white uppercase">Welcome back, {user?.displayName}</h2>
          <h4 className="text-lg text-center text-pale-400 ">{user?.email}</h4>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <h4 className="text-lg text-white w-[50%]">Dark mode</h4>
          <Toggle firstOption="Off" secondOption="On" getter={darkMode} setter={setDarkMode} />
        </div>

        <div className="flex items-center gap-2">
          <h4 className="text-lg text-white w-[50%]">Sound effects</h4>
          <Toggle firstOption="Off" secondOption="On" getter={soundEnabled} setter={setSoundEnabled} />
        </div>

        <div className="fixed gap-4 text-xl text-center text-white uppercase left-5 right-5 bottom-10">
          <button
            className="w-full p-3 font-semibold uppercase duration-200 border rounded-sm hover:bg-white hover:text-pale-900 hover:border-pale-900"
            onClick={() => {
              logout();
              router.push("/");

              // setShowSideMenu(false);
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        onClick={() => router.push("/")}
        className={`
      ${showSideMenu ? "bg-opacity-90 pointer-events-auto " : "bg-opacity-0 pointer-events-none "}
      fixed top-0 left-0 z-40 w-full h-full bg-pale-900  duration-300 ease-in-out
      `}
      ></div>
    </>
  );
}
