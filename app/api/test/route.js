// let firestoreKey;
// import { db } from "@/lib/firebase";
// import { doc, getDoc } from "firebase/firestore";

// async function getFirestoreKey() {
//     if (!firestoreKey) {
//         const keyRef = doc(db, "server", "data");
//         const keySnap = await getDoc(keyRef);
//         firestoreKey = keySnap.get("key");
//     }
//     return firestoreKey;
// }

export async function POST(request) {
    try {
        // const requestBody = JSON.parse(request.body);
        // const requestBody = request.body;
        // var result = "The data is " + requestBody.data + " and the key is " + requestBody.key;
        // return new Response(result, { status: 200, headers: { 'Content-Type': 'text/plain' } });

        return new Response(request.body, { status: 200, headers: { 'Content-Type': 'text/plain' } });

    } catch (err) {
        return new Response(err.toString(), { status: 500, headers: { 'Content-Type': 'text/plain' } });
    }
}