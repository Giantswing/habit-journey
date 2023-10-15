import { subtleCrypto, TextDecoder } from 'crypto';

// Define a function to encrypt the habits data using your encryption key
async function encryptHabits(habits, encryptionKey) {
    const encoder = new TextEncoder();
    const encodedHabits = encoder.encode(habits);

    const algorithm = { name: 'AES-GCM', iv: window.crypto.getRandomValues(new Uint8Array(12)) };
    const key = await subtleCrypto.importKey('raw', encoder.encode(encryptionKey), 'AES-GCM', false, ['encrypt']);
    const encryptedData = await subtleCrypto.encrypt(algorithm, key, encodedHabits);

    return {
        data: new TextEncoder().encode('Encrypted:' + btoa(new Uint8Array(encryptedData))),
        iv: new TextEncoder().encode(btoa(algorithm.iv))
    };
}

export default encryptHabits;