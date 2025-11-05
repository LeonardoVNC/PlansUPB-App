import React from 'react';
import { View } from 'react-native';
import { Card, Text, Button, Icon } from '@ui-kitten/components';
import { useThemeColors } from '@hooks/useThemeColors';
import { Plan } from '@interfaces/plans.interfaces';

interface InvitationCardProps {
    plan: Plan;
    onAccept: () => void;
    onDecline: () => void;
}

export default function InvitationCard({ plan, onAccept, onDecline }: InvitationCardProps) {
    const { colors } = useThemeColors();

    return (
        <Card style={{ marginBottom: 16, borderRadius: 12, borderColor: colors.primary, borderWidth: 2, backgroundColor: '#f1f5f9' }}>
            <View style={{ 
                backgroundColor: colors.primary + '10',
                padding: 8,
                borderRadius: 6,
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Icon
                    name="email"
                    pack="eva"
                    fill={colors.primary}
                    style={{ width: 20, height: 20, marginRight: 8 }}
                />
                <Text category="s2" style={{ color: colors.primary, fontWeight: 'bold' }}>
                    NUEVA INVITACIÓN
                </Text>
            </View>

            <Text category="h6" style={{ color: colors.text, marginBottom: 8 }}>
                {plan.title}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Icon
                    name="calendar"
                    pack="eva"
                    fill={colors.subtitle}
                    style={{ width: 16, height: 16, marginRight: 6 }}
                />
                <Text category="p2" style={{ color: colors.subtitle }}>
                    {new Date(plan.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>
            </View>

            {plan.place && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Icon
                        name="pin"
                        pack="eva"
                        fill={colors.subtitle}
                        style={{ width: 16, height: 16, marginRight: 6 }}
                    />
                    <Text category="p2" style={{ color: colors.subtitle }}>
                        {plan.place.name}
                    </Text>
                </View>
            )}

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                <Button
                    style={{ flex: 1 }}
                    status="success"
                    onPress={onAccept}
                    accessoryLeft={(props) => <Icon {...props} name="checkmark-circle-2" pack="eva" />}
                >
                    Aceptar
                </Button>
                <Button
                    style={{ flex: 1 }}
                    status="danger"
                    appearance="outline"
                    onPress={onDecline}
                    accessoryLeft={(props) => <Icon {...props} name="close-circle" pack="eva" />}
                >
                    Rechazar
                </Button>
            </View>
        </Card>
    );
}
