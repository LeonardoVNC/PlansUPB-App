import { Card, Icon, Text } from "@ui-kitten/components";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";

function PlanTitleCard({ plan }: { plan: Plan }) {
    const { colors } = useThemeColors();

    return (
        <Card style={{ marginBottom: 24, padding: 20 }} status={plan.done ? 'success' : 'info'} disabled>
            <Icon
                name={plan.done ? 'checkmark-circle-2' : 'clock-outline'}
                pack="eva"
                fill={plan.done ? colors.success : colors.primary}
                style={{ width: 48, height: 48, alignSelf: 'center', marginBottom: 16 }}
            />

            <Text category="h4" style={{ color: colors.text, marginBottom: 16, textAlign: 'center', lineHeight: 28 }}>
                {plan.title}
            </Text>

            <Text category="p1" style={{ color: colors.muted, lineHeight: 24, textAlign: 'justify' }}>
                {plan.description}
            </Text>
        </Card>
    );
}

export default PlanTitleCard;