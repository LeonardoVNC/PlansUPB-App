import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text, Icon, Button } from '@ui-kitten/components';
import { useThemeColors } from '@hooks/useThemeColors';
import { useConfirmations } from '@hooks/useConfirmations';
import { useUserStore } from '@store/useUserStore';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring,
    withSequence,
    FadeIn,
    ZoomIn
} from 'react-native-reanimated';

interface RSVPCardProps {
    planId: string;
    ownerCode: string;
}

export default function RSVPCard({ planId, ownerCode }: RSVPCardProps) {
    const { colors } = useThemeColors();
    const { user } = useUserStore();
    const { getUserRSVP, setRSVP, getAttendanceStats } = useConfirmations();
    
    const userRSVP = getUserRSVP(planId);
    const stats = getAttendanceStats(planId);
    const isOwner = user?.code === ownerCode;
    
    const buttonScale = useSharedValue(1);

    const handleRSVP = async (willAttend: boolean) => {
        buttonScale.value = withSequence(
            withSpring(0.95, { damping: 10 }),
            withSpring(1.1, { damping: 10 }),
            withSpring(1, { damping: 10 })
        );
        
        await setRSVP(planId, willAttend);
    };
    
    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }]
    }));

    if (isOwner) {
        return (
            <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Icon
                        name="people"
                        pack="eva"
                        fill={colors.primary}
                        style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    <Text category="h6" style={{ color: colors.text }}>
                        Asistencia
                    </Text>
                </View>

                <View style={{ 
                    backgroundColor: colors.primary + '10', 
                    padding: 16, 
                    borderRadius: 8,
                    marginBottom: 8
                }}>
                    <Text category="h3" style={{ color: colors.primary, textAlign: 'center', marginBottom: 4 }}>
                        {stats.percentage}%
                    </Text>
                    <Text category="c1" style={{ color: colors.subtitle, textAlign: 'center' }}>
                        de asistencia confirmada
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <Icon
                                name="checkmark-circle-2"
                                pack="eva"
                                fill={colors.success}
                                style={{ width: 20, height: 20, marginRight: 4 }}
                            />
                            <Text category="h5" style={{ color: colors.success }}>
                                {stats.attending}
                            </Text>
                        </View>
                        <Text category="c1" style={{ color: colors.subtitle }}>
                            Asistirán
                        </Text>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <Icon
                                name="close-circle"
                                pack="eva"
                                fill={colors.danger}
                                style={{ width: 20, height: 20, marginRight: 4 }}
                            />
                            <Text category="h5" style={{ color: colors.danger }}>
                                {stats.notAttending}
                            </Text>
                        </View>
                        <Text category="c1" style={{ color: colors.subtitle }}>
                            No asistirán
                        </Text>
                    </View>
                </View>
            </Card>
        );
    }

    return (
        <Card style={{ marginBottom: 16, borderRadius: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Icon
                    name="calendar"
                    pack="eva"
                    fill={colors.primary}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                />
                <Text category="h6" style={{ color: colors.text }}>
                    ¿Asistirás a este plan?
                </Text>
            </View>

            {userRSVP === undefined ? (
                <Animated.View entering={FadeIn.duration(400)}>
                    <Text category="p2" style={{ color: colors.subtitle, marginBottom: 12 }}>
                        Confirma tu asistencia para que el organizador pueda planificar mejor.
                    </Text>
                    <Animated.View style={[{ flexDirection: 'row', gap: 12 }, buttonAnimatedStyle]}>
                        <Button
                            style={{ flex: 1 }}
                            status="success"
                            onPress={() => handleRSVP(true)}
                            accessoryLeft={(props) => <Icon {...props} name="checkmark-circle-2" pack="eva" />}
                        >
                            Sí, asistiré
                        </Button>
                        <Button
                            style={{ flex: 1 }}
                            status="danger"
                            appearance="outline"
                            onPress={() => handleRSVP(false)}
                            accessoryLeft={(props) => <Icon {...props} name="close-circle" pack="eva" />}
                        >
                            No asistiré
                        </Button>
                    </Animated.View>
                </Animated.View>
            ) : (
                <Animated.View entering={ZoomIn.duration(400).springify()}>
                    <View style={{ 
                        backgroundColor: userRSVP ? colors.success + '10' : colors.danger + '10',
                        padding: 12,
                        borderRadius: 8,
                        marginBottom: 12,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Icon
                            name={userRSVP ? 'checkmark-circle-2' : 'close-circle'}
                            pack="eva"
                            fill={userRSVP ? colors.success : colors.danger}
                            style={{ width: 24, height: 24, marginRight: 8 }}
                        />
                        <Text category="s1" style={{ color: userRSVP ? colors.success : colors.danger }}>
                            {userRSVP ? '✓ Confirmaste tu asistencia' : '✗ Indicaste que no asistirás'}
                        </Text>
                    </View>

                    <TouchableOpacity 
                        onPress={() => handleRSVP(!userRSVP)}
                        style={{ 
                            padding: 8,
                            alignItems: 'center'
                        }}
                    >
                        <Text category="c1" style={{ color: colors.primary, textDecorationLine: 'underline' }}>
                            Cambiar respuesta
                        </Text>
                    </TouchableOpacity>

                    <View style={{ 
                        marginTop: 12,
                        paddingTop: 12,
                        borderTopWidth: 1,
                        borderTopColor: colors.border
                    }}>
                        <Text category="c1" style={{ color: colors.subtitle, marginBottom: 8 }}>
                            Asistencia general:
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text category="h6" style={{ color: colors.success }}>
                                    {stats.attending}
                                </Text>
                                <Text category="c2" style={{ color: colors.subtitle }}>
                                    Sí
                                </Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text category="h6" style={{ color: colors.danger }}>
                                    {stats.notAttending}
                                </Text>
                                <Text category="c2" style={{ color: colors.subtitle }}>
                                    No
                                </Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text category="h6" style={{ color: colors.primary }}>
                                    {stats.percentage}%
                                </Text>
                                <Text category="c2" style={{ color: colors.subtitle }}>
                                    Asistencia
                                </Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            )}
        </Card>
    );
}
