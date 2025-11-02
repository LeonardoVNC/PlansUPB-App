import { Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ActionsModal from "@common_components/ActionsModal";
import { useThemeColors } from "@hooks/useThemeColors";
import { Action } from "@interfaces/action.interface";
import { Plan } from "@interfaces/plans.interfaces";
import { openMapsApp } from "@utils/placeHandler";

interface MapActionsProps {
    plan: Plan,
    visible: boolean,
    onClose: () => void
}

function MapActionsModal({ plan, visible, onClose }: MapActionsProps) {
    const { colors } = useThemeColors();

    const goToPlan = () => {
        router.replace(`plans/${plan.id}`)
    }

    const openMaps = () => {
        if (!plan.place) return
        const { lat, lng, name } = plan.place
        try {
            openMapsApp(name, lat, lng)
        } catch (err) {
            Alert.alert('Error', 'No se puede abrir Maps');
        }
    }

    const actions: Action[] = [
        {
            name: "Detalles del Plan",
            action: goToPlan,
            icon: <Ionicons name="calendar" size={28} color={colors.contrastText} />
        }, {
            name: "Cómo llegar",
            action: openMaps,
            icon: <Ionicons name="map" size={28} color={colors.contrastText} />
        },
    ]

    return (
        <ActionsModal
            actions={actions}
            title={`Ubicación: ${plan.title}`}
            visible={visible}
            onClose={onClose}
        />
    );
}

export default MapActionsModal;