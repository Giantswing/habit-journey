export async function POST(request) {
    const CryptoJS = require("crypto-js");

    const res = await request.json();
    const data = res.data;
    const serverKey = process.env.MY_APP_SECRET;

    const encryptedData = CryptoJS.AES.encrypt(data, serverKey).toString();

    return new Response(encryptedData, {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    }
    );
}