import "./globals.css";

/* Firebase */
import AuthContextProvider from "./context/AuthContext";
import { useAuthContext } from "./context/AuthContext";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Habit Journey",
  description: "A habit tracker that helps you build good habits.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} 
      relative max-w-lg mx-auto`}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
