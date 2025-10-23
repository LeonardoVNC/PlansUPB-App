import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";
import { globalStyles } from "@styles/globals";
import { Card, Layout, Text, Button } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { View, Linking, Alert } from "react-native";

function PlanPlaceCard({ plan, isOwner = false }: { plan: Plan, isOwner?: boolean }) {
    const [hasPlace, setHasPlace] = useState(false)
    const { colors } = useThemeColors()

    useEffect(() => {
        setHasPlace(!!plan.place);
    }, [plan.place]);

    const goToMapsApp = () => {
        if (plan.place) {
            const { lat, lng } = plan.place;
            const url = `geo:${lat},${lng}?q=${lat},${lng}`;
            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert('Error', 'No se puede abrir Maps');
                }
            });
        }
    };

    const handleFormPlace = () => {
        console.log('Falta el form para agrear lugar... si es q es form...');
    };

    return (
        <Card
            style={globalStyles().app_card}
            status={hasPlace && hasPlace ? 'success' : 'info'}
            disabled
        >
            <Layout style={{ flexDirection: 'column', gap: 16 }}>
                <View style={{ alignItems: 'center' }}>
                    <Ionicons
                        name="location-outline"
                        size={32}
                        color={colors.primary}
                        style={{ marginBottom: 8 }}
                    />
                    <Text
                        category="h6"
                        style={{ color: colors.text, textAlign: 'center', fontWeight: 'bold' }}
                    >
                        Punto de Encuentro
                    </Text>
                </View>

                <Layout style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text
                        category="p1"
                        style={{ color: colors.subtitle, fontSize: 16, fontWeight: '500', ...(isOwner || hasPlace ? {} : { textAlign: 'center' }) }}
                    >
                        {hasPlace && plan.place ? plan.place.name : 'Sin lugar definido'}
                    </Text>
                    {hasPlace && plan.place ? (
                        // Quizá haya q cambiar los botones, se ven muy... nativos dx
                        <Button
                            onPress={goToMapsApp}
                            status="primary"
                            size="small"
                            accessoryLeft={<Ionicons name="map-outline" size={16} color="white" />}
                        >
                            Abrir ubicación
                        </Button>
                    ) : isOwner && (
                        <Button
                            onPress={handleFormPlace}
                            status="info"
                            size="small"
                            accessoryLeft={<Ionicons name="add-outline" size={16} color="white" />}
                        >
                            Agregar lugar
                        </Button>
                    )}
                </Layout>
            </Layout>
        </Card>
    );
}

export default PlanPlaceCard;