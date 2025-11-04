import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { collection, doc, setDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

const NOTIFICATION_TOKENS_COLLECTION = 'notification_tokens';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync(userCode: string) {
    let token = '';

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
            alert('¡Se requieren permisos de notificación para recibir actualizaciones!');
            return;
        }
        
        try {
            const tokenData = await Notifications.getExpoPushTokenAsync();
            token = tokenData.data;
            
            await saveTokenToFirestore(userCode, token);
            
        } catch (error) {
            console.error('Error al obtener el token de notificación:', error);
        }
    } else {
        console.log('Las notificaciones push solo funcionan en dispositivos físicos');
    }

    return token;
}

async function saveTokenToFirestore(userCode: string, token: string) {
    try {
        const q = query(
            collection(db, NOTIFICATION_TOKENS_COLLECTION),
            where('userCode', '==', userCode)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            const tokenRef = doc(collection(db, NOTIFICATION_TOKENS_COLLECTION));
            await setDoc(tokenRef, {
                id: tokenRef.id,
                userCode,
                token,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } else {
            const docRef = snapshot.docs[0].ref;
            await updateDoc(docRef, {
                token,
                updatedAt: new Date(),
            });
        }
        
        console.log('Token de notificación guardado exitosamente');
    } catch (error) {
        console.error('Error al guardar token en Firestore:', error);
    }
}

export async function getAllTokens() {
    try {
        const snapshot = await getDocs(collection(db, NOTIFICATION_TOKENS_COLLECTION));
        return snapshot.docs.map(doc => doc.data().token);
    } catch (error) {
        console.error('Error al obtener tokens:', error);
        return [];
    }
}

export async function getTokenByUserCode(userCode: string) {
    try {
        const q = query(
            collection(db, NOTIFICATION_TOKENS_COLLECTION),
            where('userCode', '==', userCode)
        );
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
            return snapshot.docs[0].data().token;
        }
        return null;
    } catch (error) {
        console.error('Error al obtener token del usuario:', error);
        return null;
    }
}

export async function sendPushNotification(expoPushToken: string, title: string, body: string, data?: any) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
        data: data || {},
        priority: 'high',
    };

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const result = await response.json();
        console.log('Notificación enviada:', result);
        return result;
    } catch (error) {
        console.error('Error al enviar notificación:', error);
        throw error;
    }
}

export async function sendBatchNotifications(tokens: string[], title: string, body: string, data?: any) {
    const messages = tokens.map(token => ({
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: data || {},
        priority: 'high',
    }));

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages),
        });

        const result = await response.json();
        console.log('Notificaciones enviadas:', result);
        return result;
    } catch (error) {
        console.error('Error al enviar notificaciones:', error);
        throw error;
    }
}

export async function notifyNewPost(postAuthorName: string, postCategory: string) {
    try {
        const tokens = await getAllTokens();
        if (tokens.length === 0) {
            console.log('No hay tokens registrados para enviar notificaciones');
            return;
        }

        await sendBatchNotifications(
            tokens,
            '📢 Nueva publicación',
            `${postAuthorName} publicó algo en ${postCategory}`,
            { type: 'new_post', category: postCategory }
        );
    } catch (error) {
        console.error('Error al notificar nuevo post:', error);
    }
}

export async function notifyPlanInvitation(userCode: string, planTitle: string, inviterName: string) {
    try {
        const token = await getTokenByUserCode(userCode);
        if (!token) {
            console.log(`No se encontró token para el usuario ${userCode}`);
            return;
        }

        await sendPushNotification(
            token,
            '🎉 Nueva invitación a plan',
            `${inviterName} te invitó a: ${planTitle}`,
            { type: 'plan_invitation', planTitle }
        );
    } catch (error) {
        console.error('Error al notificar invitación:', error);
    }
}
