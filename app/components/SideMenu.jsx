import { useAuthContext } from "../context/AuthContext";
import Toggle from "./Toggle";
import ToggleMultiple from "./ToggleMultiple";
import AppLogo from "./AppLogo";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useTranslation from "next-translate/useTranslation";

/* Icons */
import CloseIcon from "public/icons/Close.svg";

export default function SideMenu() {
  const { t, lang } = useTranslation("common");
  const { user, logout, darkMode, setDarkMode, soundEnabled, setSoundEnabled, language, setLanguage } = useAuthContext();
  const searchParams = useSearchParams();
  const showSideMenu = searchParams.get("settings") != undefined;
  const router = useRouter();

  return (
    <>
      <div
        className={`
        ${showSideMenu ? "translate-x" : "translate-x-full opacity-0"}
        p-4 pt-10 fixed max-w-lg top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full z-50 transtion-transform ease-out-expo duration-300 
        `}
      >
        <div className="relative flex justify-end block w-full mb-8 text-right">
          <Link href={`/?lang=${lang}`} as={`/${lang}`} scroll={false}>
            <CloseIcon className="w-12 h-auto text-pale-400" />
          </Link>
        </div>

        <div className="relative flex flex-col items-center gap-4 pb-4 mb-8 border-b border-pale-600">
          <AppLogo />
          <h2 className="text-2xl font-semibold text-center text-white uppercase">
            {t("Settings.welcome")}, {user?.displayName}
          </h2>
          <h4 className="text-lg text-center text-pale-400 ">{user?.email}</h4>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <h4 className="text-md text-white w-[50%]">{t("Settings.darkmode")}</h4>
            <Toggle firstOption={t("Settings.off")} secondOption={t("Settings.on")} getter={darkMode} setter={setDarkMode} />
          </div>

          <div className="flex items-center gap-2">
            <h4 className="text-md text-white w-[50%]">{t("Settings.sound")}</h4>
            <Toggle firstOption={t("Settings.off")} secondOption={t("Settings.on")} getter={soundEnabled} setter={setSoundEnabled} />
          </div>

          <div className="flex items-center gap-2">
            <h4 className="text-md text-white w-[50%]">{t("Settings.language")}</h4>
            <ToggleMultiple
              getter={language}
              setter={setLanguage}
              values={{
                en: t("Settings.english"),
                es: t("Settings.spanish"),
                de: t("Settings.deutsch"),
              }}
            />
          </div>
        </div>

        <div className="fixed gap-4 text-xl text-center text-white uppercase left-5 right-5 bottom-10">
          <button
            className="w-full p-3 font-semibold uppercase duration-200 border rounded-sm hover:bg-white hover:text-pale-900 hover:border-pale-900"
            onClick={() => {
              logout();
              router.push(`/?lang=${lang}`);

              // setShowSideMenu(false);
            }}
          >
            {t("Settings.logout")}
          </button>
        </div>
      </div>

      <Link
        href={`/?lang=${lang}`}
        as={`/${lang}`}
        scroll={false}
        className={`
      ${showSideMenu ? "bg-opacity-90 pointer-events-auto " : "bg-opacity-0 pointer-events-none "}
      fixed top-0 left-0 z-40 w-full h-full bg-pale-900  duration-300 ease-in-out
      `}
      ></Link>
    </>
  );
}
