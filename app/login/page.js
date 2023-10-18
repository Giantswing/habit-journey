"use client";

import { useAuthContext } from "@/app/context/AuthContext";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, TwitterAuthProvider, signInWithPopup } from "firebase/auth";

import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore/lite";

import AppLogo from "@/app/components/AppLogo";

import GoogleIcon from "public/icons/Google.svg";
import TwitterIcon from "public/icons/Twitter.svg";

import { useRouter } from "next/navigation";
import useTranslation from 'next-translate/useTranslation'

import { useEffect } from "react";

export default function LoginPage() {
  const { t, lang } = useTranslation('common');
  const router = useRouter();
  const { user, setUser } = useAuthContext();


  async function loginSelected(selectProvider) {
    var provider;
    if (selectProvider == 'google') {
      provider = new GoogleAuthProvider();
    }
    else if (selectProvider == 'twitter') {
      provider = new TwitterAuthProvider();
    }

    const res = await signInWithPopup(auth, provider).then(async (result) => {

      const docRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        await setDoc(
          docRef,
          {
            name: result.user.displayName,
            email: result.user.email,
            lastLoginDate: parseInt(new Date().getDate()),
          },
          { merge: true }
        );

        if (!docSnap.data().score) {
          await setDoc(docRef, {
            score: 0,
            theme: 'light',
            soundEnabled: true,
            lastLoginDate: parseInt(new Date().getDate()),
            language: lang,

          }, { merge: true });
        }

        if (!docSnap.data().language) {
          await setDoc(docRef, {
            language: lang,
          }, { merge: true });
        }

      } else {
        await setDoc(
          docRef,
          {
            name: result.user.displayName,
            email: result.user.email,
            score: 0,
            theme: 'light',
            soundEnabled: true,
            lastLoginDate: parseInt(new Date().getDate()),
            language: lang,
          },
          { merge: true }
        );
      }
      // router.push(`/`)
      setUser(result.user);
    });
  }


  // useEffect(() => {
  //   if (user) {
  //     router.push(`/`)
  //   }
  // }, [user]);

  return (
    <main className="flex flex-col items-center justify-center h-screen ">
      <section className="flex flex-col items-center justify-center px-12 py-8 border rounded-md shadow-pale-400">
        <AppLogo />
        <h1 className="mt-8 mb-8 text-xl text-center uppercase">{t('LoginPage.title')}</h1>

        <div className="flex flex-col gap-6">
          <button className="flex flex-col items-center px-6 py-2 text-lg leading-tight duration-100 bg-white border rounded-full shadow-md border-pale-800 text-pale-800 shadow-transparent hover:-translate-y-1 hover:shadow-pale-700 md:flex-row md:gap-4" onClick={() => loginSelected("google")}>
            <GoogleIcon className="w-6 h-auto mb-2 md:mb-0" />
            {t('LoginPage.loginWithGoogle')}
          </button>

          <button className="flex flex-col items-center px-6 py-2 mb-4 text-lg leading-tight text-white duration-100 border rounded-full shadow-md bg-cyan-600 border-pale-800 shadow-transparent hover:-translate-y-1 hover:shadow-pale-700 md:flex-row md:gap-4" onClick={() => loginSelected("twitter")}>

            <TwitterIcon className="w-6 h-auto mb-2 md:mb-0" />
            {t('LoginPage.loginWithTwitter')}
          </button>
        </div>
      </section>
    </main>
  );
}
