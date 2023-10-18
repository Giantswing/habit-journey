import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import AuthContextProvider from "./context/AuthContext";

export const metadata = {
  title: "Habit Journey",
  description: "A habit tracker that helps you build good habits.",
};

export default function RootLayout({ children, params: { lang } }) {
  return (
    <html lang={lang}>
      <body className={`${inter.className} 
      relative max-w-lg mx-auto`}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
