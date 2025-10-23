import { Card, Text } from "@ui-kitten/components";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";
import { cardStatusMap } from '@styles/planStatusMap';
import { globalStyles } from "@styles/globals";
import PlanCategory from "./PlanCategory";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

            <Text category="p1" style={{ color: colors.muted, lineHeight: 24, textAlign: 'justify' }}>
                {plan.description}
            </Text>

            {plan.cover && (
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, justifyContent: 'center', margin: 6}}>
                    <Ionicons
                        name='cash-outline'
                        size={24}
                        color={colors.subtitle}
                    />
                    <Text
                        category="s4"
                        style={{ color: colors.subtitle, textAlign: 'center' }}
                    >
                        {typeof plan.cover === 'number' ? plan.cover.toFixed(2) : parseFloat(plan.cover).toFixed(2)} Bs.
                    </Text>
                </View>
            )}
        </Card>
    );
}

export default PlanTitleCard;
