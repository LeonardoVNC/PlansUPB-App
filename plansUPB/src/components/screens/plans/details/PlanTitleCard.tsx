import { useMemo } from "react";
import { Card, Icon, Text } from "@ui-kitten/components";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";
import { cardStatusMap, iconStatusMap } from '@styles/planStatusMap';
import { Ionicons } from "@expo/vector-icons";
import PlanCategory from "./PlanCategory";

function PlanTitleCard({ plan }: { plan: Plan }) {
    const { colors } = useThemeColors();

    const mainIcon = useMemo(() => {
        let iconColor;
        if (plan.status === 'draft') {
            iconColor = colors.muted
        } else if (plan.status === 'open') {
            iconColor = colors.primary
        } else if (plan.status === 'closed') {
            iconColor = colors.success
        } else {
            iconColor = colors.danger
        }
        return (
            <Icon
                name={iconStatusMap.get(plan.status)}
                pack="eva"
                fill={iconColor}
                style={{ width: 48, height: 48, alignSelf: 'center', marginBottom: 16 }}
            />
        )
    }, [plan])

    return (
        <Card
            style={{ marginBottom: 24, padding: 16, borderRadius: 12 }}
            status={cardStatusMap.get(plan.status)}
            disabled
        >
            {mainIcon}

            <Text category="h4" style={{ color: colors.text, marginBottom: 16, textAlign: 'center', lineHeight: 28 }}>
                {plan.title}
            </Text>

            <PlanCategory category={plan.category}/>

            <Text category="p1" style={{ color: colors.muted, lineHeight: 24, textAlign: 'justify' }}>
                {plan.description}
            </Text>
        </Card>
    );
}

export default PlanTitleCard;