import { Card, Text } from "@ui-kitten/components";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";
import { cardStatusMap } from '@styles/planStatusMap';
import PlanCategory from "./PlanCategory";

function PlanTitleCard({ plan }: { plan: Plan }) {
    const { colors } = useThemeColors();

    return (
        <Card
            style={{ marginBottom: 24, padding: 16, borderRadius: 12 }}
            status={cardStatusMap.get(plan.status)}
            disabled
        >
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