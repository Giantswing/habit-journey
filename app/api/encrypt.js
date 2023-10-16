let firestoreKey;
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

async function getFirestoreKey() {
    if (!firestoreKey) {
        const keyRef = doc(db, "server", "data");
        const keySnap = await getDoc(keyRef);
        firestoreKey = keySnap.data().key;
    }
    return firestoreKey;
}

export default async function handler(req, res) {
    const firestoreKey = await getFirestoreKey();
    const secretKey = process.env.MY_APP_SECRET;
    const { data } = req.body;

    const encryptedData = firestoreKey + " | " + secretKey + " | " + data;

    // Perform your encryption here using the secretKey and data
    // const encryptedData = encrypt(data, secretKey);
    // const encryptedData = data;

    res.status(200).json({ encryptedData });
}