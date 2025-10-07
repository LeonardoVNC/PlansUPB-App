import * as Crypto from 'expo-crypto';

export const generateUUID = async (): Promise<string> => {
    const rnd = await Crypto.getRandomBytesAsync(16);
    let uuid = ""
    rnd.forEach((item) => {
        uuid = uuid + item + "-"
    })
    return uuid.toString();
};
