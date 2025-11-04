import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useUserStore } from '@store/useUserStore';
import { registerForPushNotificationsAsync } from '@services/notifications.service';
import { useRouter } from 'expo-router';

export const useNotifications = () => {
    const { user } = useUserStore();
    const router = useRouter();
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    useEffect(() => {
        if (user?.code) {
            registerForPushNotificationsAsync(user.code);
        }

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notificación recibida:', notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Usuario tocó la notificación:', response);
            
            const data = response.notification.request.content.data;
            
            if (data.type === 'new_post') {
                router.push('/(drawer)/(tabs)/home');
            } else if (data.type === 'plan_invitation') {
                router.push('/(drawer)/(tabs)/plans_invs');
            }
        });

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, [user, router]);

    return {
        // todo
    };
};
