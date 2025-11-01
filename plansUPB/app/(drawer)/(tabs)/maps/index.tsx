import { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import ScreenTemplate from "@common_components/ScreenTemplate";
import usePlans from "@hooks/usePlans";
import { usePlanStore } from "@store/usePlanStore";
import { Plan } from "@interfaces/plans.interfaces";
import { Alert, Text, View } from "react-native";
import { globalStyles } from "@styles/globals";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@hooks/useThemeColors";
import { router } from "expo-router";
import ActionsModal from "@common_components/ActionsModal";
import { Action } from "@interfaces/action.interface";
import { openMapsApp } from "@utils/placeHandler";

function MapPlansScreen() {
    const [placePlans, setPlacePlans] = useState<Plan[]>([])
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
    const [isActionsVisible, setIsActionsVisible] = useState(false)

    const { allPlans, loading, setLoading } = usePlanStore();
    const { fetchAllPlans } = usePlans();
    const { colors } = useThemeColors();

    const fetchPlans = async () => {
        setLoading(true)
        await fetchAllPlans();
        setLoading(false)
    }

    useEffect(() => {
        fetchPlans()
    }, [])

    useEffect(() => {
        const plansWithPlace = allPlans.filter(plan => plan.place && plan.status === 'open');
        setPlacePlans(plansWithPlace)
    }, [allPlans])

    const handleMarker = (plan: Plan) => {
        setSelectedPlan(plan)
        setIsActionsVisible(true)
    }

    const handleCloseActions = () => {
        setSelectedPlan(null)
        setIsActionsVisible(false)
    }

    const goToPlan = () => {
        if (!selectedPlan) return
        router.replace(`plans/${selectedPlan.id}`)
    }

    const openMaps = () => {
        if (!selectedPlan || !selectedPlan.place) return
        const { lat, lng, name } = selectedPlan.place
        try {
            openMapsApp(name, lat, lng)
        } catch (err) {
            Alert.alert('Error', 'No se puede abrir Maps');
        }
    }

    const actions: Action[] = [
        {
            name: "Ver Plan",
            action: goToPlan,
            icon: <Ionicons name="calendar" size={28} color={colors.contrastText} />
        }, {
            name: "Abrir ubicación",
            action: openMaps,
            icon: <Ionicons name="map" size={28} color={colors.contrastText} />
        },
    ]

    const centerContainer = globalStyles().app_center_container

    return (
        <ScreenTemplate
            omitScroll
            loading={loading}
            loadingMessage='Cargando ubicaciones'
        >
            {placePlans.length > 0 ? (
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: placePlans[0].place!.lat,
                        longitude: placePlans[0].place!.lng,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                >
                    {placePlans.map(plan => (
                        <Marker
                            key={plan.id}
                            coordinate={{
                                latitude: plan.place!.lat,
                                longitude: plan.place!.lng,
                            }}
                            title={plan.title}
                            description={plan.place!.name}
                            onPress={() => { handleMarker(plan) }}
                        />
                    ))}
                </MapView>
            ) : (
                <View style={centerContainer}>
                    <Ionicons name="calendar-number-outline" size={48} color={colors.primary} />
                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 16 }}>
                        No hay planes con ubicaciones disponibles en este momento
                    </Text>
                </View>
            )}

            <ActionsModal
                actions={actions}
                title="Opciones del plan"
                visible={isActionsVisible}
                onClose={handleCloseActions}
            />
        </ScreenTemplate>
    );
}

export default MapPlansScreen;
