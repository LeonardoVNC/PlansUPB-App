import { FirebaseOptions } from "firebase/app";

const ENV_KEYS = {
    apiKey: "EXPO_PUBLIC_FIREBASE_API_KEY",
    authDomain: "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
    projectId: "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
    storageBucket: "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    appId: "EXPO_PUBLIC_FIREBASE_APP_ID",
    measurementId: "EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID",
} as const;

const REQUIRED_ENV_KEYS: Array<keyof typeof ENV_KEYS> = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
];

const firebaseEnv: Record<keyof typeof ENV_KEYS, string | undefined> = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const shouldUseEnvConfig =
    (process.env.EXPO_PUBLIC_FIREBASE_USE_ENV ?? "true").toLowerCase() !== "false";

const missingKeys = REQUIRED_ENV_KEYS.filter(
    (key) => !firebaseEnv[key]
).map((key) => ENV_KEYS[key]);

let warnedOnce = false;

export const getFirebaseConfig = (): FirebaseOptions => {
    if (shouldUseEnvConfig) {
        if (missingKeys.length > 0) {
            throw new Error(
                `Missing Firebase environment variables: ${missingKeys.join(
                    ", "
                )}. Please add them to your .env file.`
            );
        }
        return {
            apiKey: firebaseEnv.apiKey!,
            authDomain: firebaseEnv.authDomain!,
            projectId: firebaseEnv.projectId!,
            storageBucket: firebaseEnv.storageBucket!,
            messagingSenderId: firebaseEnv.messagingSenderId!,
            appId: firebaseEnv.appId!,
            measurementId: firebaseEnv.measurementId,
        };
    }

    if (!warnedOnce) {
        console.warn(
            "[firebase] Using fallback configuration because EXPO_PUBLIC_FIREBASE_USE_ENV=false."
        );
        warnedOnce = true;
    }

    return {
        apiKey: "demo-api-key",
        authDomain: "demo-auth-domain",
        projectId: "demo-project",
        storageBucket: "demo-storage-bucket",
        messagingSenderId: "demo-messaging-sender",
        appId: "demo-app-id",
    };
};
