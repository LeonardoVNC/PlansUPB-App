import { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { Card, Layout, Text, Button } from "@ui-kitten/components";
import ActionsModal from "@common_components/ActionsModal";
import usePlans from "@hooks/usePlans";
import { useThemeColors } from "@hooks/useThemeColors";
import { Action } from "@interfaces/action.interface";
import { Plan } from "@interfaces/plans.interfaces";
import { globalStyles } from "@styles/globals";
import { usePlanStore } from "@store/usePlanStore";
import { openMapsApp } from "@utils/placeHandler";
import PlacePickerModal from "./PlanPlacePickerModal"

function PlanPlaceCard({ plan, isOwner = false }: { plan: Plan, isOwner?: boolean }) {
    const [hasPlace, setHasPlace] = useState(false)
    const [actions, setActions] = useState<Action[]>([])
    const [isPickerVisible, setIsPickerVisible] = useState(false)
    const [isActionsVisible, setIsActionsVisible] = useState(false)
    const { removeActualPlan } = usePlanStore();
    const { colors } = useThemeColors()
    const { updatePlan } = usePlans()

    useEffect(() => {
        setHasPlace(!!(plan.place && plan.place.name));
    }, [plan.place]);

    const showAddButton = !hasPlace && isOwner && plan.status === 'draft'

    useEffect(() => {
        const actionList: Action[] = [...publicActions];
        if (hasPlace && isOwner && plan.status === 'draft') {
            actionList.push({
                name: hasPlace ? "Editar lugar" : "Agregar lugar",
                action: handleEditPlace,
                icon: <Ionicons name="location" size={24} color={colors.contrastText} />
            })
        }

        setActions(actionList)
    }, [isOwner, plan.status])

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
        setIsActionsVisible(false);
        removeActualPlan()
    };

    const handleMarkerPress = () => {
        setIsActionsVisible(true)
    }

    const handleEditPlace = () => {
        setIsActionsVisible(false)
        setIsPickerVisible(true)
    }

    const publicActions: Action[] = [
        {
            name: "Abrir ubicación",
            action: goToMapsApp,
            icon: <Ionicons name="map" size={24} color={colors.contrastText} />
        }
    ]

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

                    {hasPlace && plan.place && (
                        <View
                            style={{
                                height: 160,
                                borderRadius: 8,
                                overflow: 'hidden',
                                marginBottom: 8,
                                position: 'relative',
                                zIndex: 0,
                                elevation: 0,
                            }}
                            collapsable={false}
                        >
                            <MapView
                                style={{ flex: 1 }}
                                initialRegion={{
                                    latitude: plan.place.lat,
                                    longitude: plan.place.lng,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }}
                                scrollEnabled={false}
                                pointerEvents="auto"
                            >
                                <Marker
                                    coordinate={{
                                        latitude: plan.place.lat,
                                        longitude: plan.place.lng,
                                    }}
                                    title={plan.title}
                                    description={plan.place.name}
                                    onPress={handleMarkerPress}
                                />
                            </MapView>
                        </View>
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
            </Card>

            <PlacePickerModal
                visible={isPickerVisible}
                onClose={() => setIsPickerVisible(false)}
                onSave={handleSavePlace}
                initialPlace={plan.place}
            />

            <ActionsModal
                actions={actions}
                title={`${plan ? `Ubicación: ${plan.title}` : "Opciones de la ubicación"}`}
                visible={isActionsVisible}
                onClose={() => setIsActionsVisible(false)}
            />
        </>
    );
}

export default PlanPlaceCard;