import "./globals.css";

/* Firebase */
import AuthContextProvider from "../context/AuthContext";
import { useAuthContext } from "../context/AuthContext";

/* Localization */
import { useLocale } from 'next-intl';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
const locales = ['en', 'es'];

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Habit Journey",
  description: "A habit tracker that helps you build good habits.",
};

export default async function RootLayout({ children, params: { locale } }) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${inter.className} 
      relative max-w-lg mx-auto`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
