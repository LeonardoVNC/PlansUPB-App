import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import usePlans from "@hooks/usePlans";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";
import { globalStyles } from "@styles/globals";
import { Card, Layout, Text, Button } from "@ui-kitten/components";
import PlacePickerModal from "./PlanPlacePickerModal"
import { usePlanStore } from "@store/usePlanStore";
import { openMapsApp } from "@utils/placeHandler";

function PlanPlaceCard({ plan, isOwner = false }: { plan: Plan, isOwner?: boolean }) {
    const [hasPlace, setHasPlace] = useState(false)
    const [isPickerVisible, setIsPickerVisible] = useState(false)
    const { removeActualPlan } = usePlanStore();
    const { colors } = useThemeColors()
    const { updatePlan } = usePlans()

    useEffect(() => {
        setHasPlace(!!(plan.place && plan.place.name));
    }, [plan.place]);

    const showOpenButton = hasPlace
    const showAddButton = !hasPlace && isOwner && plan.status === 'draft'

    const goToMapsApp = async () => {
        if (!plan.place) return
        const { lat, lng, name } = plan.place
        try {
            openMapsApp(name, lat, lng)
        } catch (err) {
            Alert.alert('Error', 'No se puede abrir Maps');
        }
    };

    const handleSavePlace = (place: { name: string; lat: number; lng: number }) => {
        if (!plan) return;
        updatePlan(plan.id, { place });
        setIsPickerVisible(false);
        removeActualPlan()
    };

    return (
        <>
            <Card
                style={globalStyles().app_card}
                status={hasPlace ? 'success' : 'info'}
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

                    <Layout style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            category="p1"
                            style={{
                                color: colors.subtitle,
                                fontSize: 16,
                                fontWeight: '500',
                                textAlign: (showOpenButton || showAddButton) ? 'left' : 'center',
                                flex: 1,
                            }}
                        >
                            {hasPlace && plan.place ? plan.place.name : 'Sin lugar definido'}
                        </Text>

                        {showOpenButton && plan.place && (
                            <Button
                                onPress={goToMapsApp}
                                status="primary"
                                size="small"
                                accessoryLeft={<Ionicons name="map-outline" size={16} color="white" />}
                                style={{ marginLeft: 12 }}
                            >
                                Abrir ubicación
                            </Button>
                        )}

                        {showAddButton && (
                            <Button
                                onPress={() => setIsPickerVisible(true)}
                                status="info"
                                size="small"
                                accessoryLeft={<Ionicons name="add-outline" size={16} color="white" />}
                                style={{ marginLeft: 12 }}
                            >
                                Agregar lugar
                            </Button>
                        )}
                    </Layout>
                </Layout>
            </Card>

            <PlacePickerModal
                visible={isPickerVisible}
                onClose={() => setIsPickerVisible(false)}
                onSave={handleSavePlace}
                initialPlace={plan.place}
            />
        </>
    );
}

export default PlanPlaceCard;