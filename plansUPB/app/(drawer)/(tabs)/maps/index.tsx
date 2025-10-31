import { use, useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import ScreenTemplate from "@common_components/ScreenTemplate";
import usePlans from "@hooks/usePlans";
import { usePlanStore } from "@store/usePlanStore";
import { Plan } from "@interfaces/plans.interfaces";
import { Text, View } from "react-native";
import { globalStyles } from "@styles/globals";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@hooks/useThemeColors";

function MapPlansScreen() {
    const [placePlans, setPlacePlans] = useState<Plan[]>([])

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
                        />
                    ))}
                </MapView>
            ) : (
                <View style={centerContainer}>
                    <Ionicons name="calendar-number-outline" size={48} color={colors.primary}/>
                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 16 }}>No hay planes con ubicaciones disponibles en este momento</Text>
                </View>
            )}
        </ScreenTemplate>
    );
}

export default MapPlansScreen;
