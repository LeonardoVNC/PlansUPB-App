import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenTemplate from "@common_components/ScreenTemplate";
import usePlans from "@hooks/usePlans";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";
import MapScreen from "@screen_components/maps/MapScreen";
import { usePlanStore } from "@store/usePlanStore";
import { globalStyles } from "@styles/globals";

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
                <MapScreen plans={placePlans}/>
            ) : (
                <View style={centerContainer}>
                    <Ionicons name="calendar-number-outline" size={48} color={colors.primary} />
                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 16 }}>
                        No hay planes con ubicaciones disponibles en este momento
                    </Text>
                </View>
            )}
        </ScreenTemplate>
    );
}

export default MapPlansScreen;