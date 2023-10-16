export async function POST(request) {
    const CryptoJS = require("crypto-js");

    const res = await request.json();
    const data = res.data;

    const serverKey = process.env.MY_APP_SECRET;

    const decryptedData = CryptoJS.AES.decrypt(data, serverKey).toString(CryptoJS.enc.Utf8);

    return new Response(decryptedData, {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    }
    );
}