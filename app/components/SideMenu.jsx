import { AiOutlineClose } from "react-icons/ai";
import { useAuthContext } from "../context/AuthContext";

export default function SideMenu({ showSideMenu, setShowSideMenu }) {
  const { user } = useAuthContext();
  return (
    <>
      <div
        className={`
        ${showSideMenu ? "translate-x" : "translate-x-full "}
        p-4 pt-7 fixed max-w-lg top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full z-50 transtion-transform ease-out-expo duration-300 
        `}
      >
        <div className="relative block w-full mb-8 text-right">
          <button className="text-white " onClick={() => setShowSideMenu(false)}>
            <AiOutlineClose size={30} />
          </button>
        </div>

        <h2 className="text-4xl text-center text-white uppercase">Welcome back, {user?.displayName}</h2>
      </div>

      <div
        onClick={() => setShowSideMenu(false)}
        className={`
      ${showSideMenu ? "bg-opacity-70 pointer-events-auto " : "bg-opacity-0 pointer-events-none "}
      fixed top-0 left-0 z-40 w-full h-full bg-black  duration-300 ease-in-out
      `}
      ></div>
    </>
  );
}
