import { Card, Icon, Layout, Text } from "@ui-kitten/components";
import { View } from "react-native";
import { useThemeColors } from "../../../../../../src/hooks/useThemeColors";
import { Plan } from "../../../../../../src/interfaces/plans.interfaces";

function PlanStatusCard({ plan }: { plan: Plan }) {
    const { colors } = useThemeColors();

    return (
        <Card style={{ marginBottom: 24, padding: 16 }} status={plan.done ? 'success' : 'warning'}>
            <Layout style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Icon
                        name={plan.done ? 'checkmark-circle-2' : 'alert-circle-outline'}
                        pack="eva"
                        fill={plan.done ? colors.success : colors.primary}
                        style={{ width: 32, height: 32 }}
                    />
                    <Text category="h6" style={{ color: colors.text, fontWeight: 'bold' }}>
                        Estado del plan
                    </Text>
                </View>
                <Text
                    category="h6"
                    style={{
                        color: plan.done ? colors.success : colors.primary,
                        fontWeight: 'bold',
                        fontSize: 18,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        backgroundColor: plan.done ? colors.success + '20' : colors.primary + '20',
                        borderRadius: 20,
                    }}
                >
                    {plan.done ? 'Hecho' : 'Pendiente'}
                </Text>
            </Layout>
        </Card>
    );
}

export default PlanStatusCard;