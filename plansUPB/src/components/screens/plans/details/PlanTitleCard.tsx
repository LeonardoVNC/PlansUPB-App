import { Ionicons } from "@expo/vector-icons";
import { Card, Text } from "@ui-kitten/components";
import BigChip from "@common_components/BigChip";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";
import { globalStyles } from "@styles/globals";
import { cardStatusMap } from '@styles/planStatusMap';
import PlanCategory from "./PlanCategory";

function PlanTitleCard({ plan }: { plan: Plan }) {
    const { colors } = useThemeColors();

    return (
        <Card
            style={globalStyles().app_card}
            status={cardStatusMap.get(plan.status)}
            disabled
        >
            <Text category="h4" style={{ color: colors.text, marginBottom: 16, textAlign: 'center', lineHeight: 28 }}>
                {plan.title}
            </Text>

            <PlanCategory category={plan.category} />

            <Text category="p1" style={{ color: colors.muted, lineHeight: 24, textAlign: 'justify', marginBottom: 8 }}>
                {plan.description}
            </Text>

            {plan.cover && (
                <BigChip
                    icon={<Ionicons
                        name='cash-outline'
                        size={24}
                        color={colors.success}
                    />}
                    color={colors.success}
                    text={`${typeof plan.cover === 'number' ? plan.cover.toFixed(2) : parseFloat(plan.cover).toFixed(2)} Bs.`}
                />
            )}
        </Card>
    );
}

export default PlanTitleCard;
