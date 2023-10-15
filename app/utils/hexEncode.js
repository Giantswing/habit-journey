function HexEncode(input) {
    const buffer = new TextEncoder().encode(input); // Convert the input string to a byte array
    let result = '';

    for (const byte of new Uint8Array(buffer)) {
        // Convert each byte to its hexadecimal representation and append to the result
        result += byte.toString(16).padStart(2, '0'); // Ensure each byte is two characters wide
    }

    return result;
}

export default HexEncode;