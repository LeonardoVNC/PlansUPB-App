import { useEffect, useMemo, useState } from "react";
import { Card, Icon, Text } from "@ui-kitten/components";
import BigChip from "@common_components/BigChip";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";
import { globalStyles } from "@styles/globals";
import { cardStatusMap, iconStatusMap, labelStatusMap } from "@styles/planStatusMap";
import PlanStatusActions from "./PlanStatusActions";
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring,
    withSequence,
    ZoomIn
} from 'react-native-reanimated';

function PlanStatusCard({ plan, isOwner = false }: { plan: Plan, isOwner?: boolean }) {
    const { colors } = useThemeColors();
    const [statusColor, setStatusColor] = useState<string>()
    const [status, setStatus] = useState<string>()
    const [statusLabel, setStatusLabel] = useState<string>()
    
    const chipScale = useSharedValue(1);
    const chipRotation = useSharedValue(0);

    const mainIcon = useMemo(() => {
        return (
            <Icon
                name={iconStatusMap.get(plan.status)}
                pack="eva"
                fill={statusColor}
                style={{ width: 20, height: 20 }}
            />
        );
    }, [plan.status, statusColor])

    useEffect(() => {
        changeStatusColor();
        setStatus(cardStatusMap.get(plan.status))
        setStatusLabel(labelStatusMap.get(plan.status))
        
        // Animar cuando cambia el estado
        chipScale.value = withSequence(
            withSpring(1.2, { damping: 10 }),
            withSpring(1, { damping: 10 })
        );
        chipRotation.value = withSequence(
            withSpring(5, { damping: 10 }),
            withSpring(-5, { damping: 10 }),
            withSpring(0, { damping: 10 })
        );
    }, [plan.status])

    const changeStatusColor = () => {
        if (plan.status === 'draft') {
            setStatusColor(colors.warning)
        } else if (plan.status === 'open') {
            setStatusColor(colors.primary)
        } else if (plan.status === 'closed') {
            setStatusColor(colors.success)
        } else {
            setStatusColor(colors.danger)
        }
    }

    const chipAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: chipScale.value },
            { rotate: `${chipRotation.value}deg` }
        ]
    }));

    return (
        <Card
            style={globalStyles().app_card}
            status={status}
            disabled
        >
            <Text category="h6" style={{ color: colors.text, marginBottom: 16, textAlign: 'center', lineHeight: 28 }}>
                Estado del plan
            </Text>

            <Animated.View style={chipAnimatedStyle}>
                <BigChip icon={mainIcon} color={statusColor || ""} text={statusLabel || ""} />
            </Animated.View>
            
            {isOwner && (<PlanStatusActions plan={plan} />)}
        </Card>
    );
}

export default PlanStatusCard;