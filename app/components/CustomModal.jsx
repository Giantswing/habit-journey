import Image from "next/image";
import CloseIcon from "public/icons/Close.svg";

export default function CustomModal({ children, displayState, onClose, title }) {
  return (
    <>
      <section
        className={`p-3 mb-4 border-2
        ${displayState ? "scale-100" : "scale-0"}
        
         fixed max-w-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[97%] bg-white rounded-md shadow-lg z-50 transtion-transform ease-out-expo duration-100
         dark:bg-pale-800 dark:border-pale-700 dark:shadow-[0_-15px_50px_rgba(0,0,0,0.2)]
        `}
      >
        <h2 className={`pb-3 mb-4 border-b font-semibold text-center text-pale-800 dark:text-pale-200`}>{title}</h2>
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute top-4 right-4 text-pale-600 dark:text-pale-300"
        >
          <CloseIcon className="text-lg" />
        </button>

        {children}
      </section>

      <div
        onClick={() => {
          onClose();
        }}
        className={`duration-300 fixed z-40 top-0 left-0 w-full h-full bg-pale-900  ${
          displayState ? "block bg-opacity-80 pointer-events-auto" : "bg-opacity-0 pointer-events-none"
        }`}
      ></div>
    </>
  );
}
