import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

async function logout(router) {
    try {
        await signOut(auth);
        router.push("/login");
    } catch (err) {
        console.log(err);
    }
}

export default logout;