import * as Crypto from 'expo-crypto';

export const generateUUID = async (): Promise<string> => {
    const uuid = await Crypto.getRandomBytesAsync(16);
    return uuid.toString();
};
