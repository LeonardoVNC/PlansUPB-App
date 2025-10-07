import { Card, Icon, Layout, Text } from "@ui-kitten/components";
import { View } from "react-native";
import { formatWeekDay, formatDate, formatHour } from '../../../../../../src/utils/formatDate';
import { useThemeColors } from "../../../../../../src/hooks/useThemeColors";
import { Plan } from "../../../../../../src/interfaces/plans.interfaces";

function PlanDateCard({ plan }: { plan: Plan }) {
    const { colors } = useThemeColors();

    return (
        <Card style={{ marginBottom: 20, padding: 16 }} status="basic">
            <Layout style={{ flexDirection: 'column', gap: 12 }}>
                {/* TODO se pueden sacar sections chiquitas de aqui */}
                <Layout style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Icon name="calendar-outline" pack="eva" fill={colors.primary} style={{ width: 24, height: 24 }} />
                        <Text category="s1" style={{ color: colors.text, fontWeight: 'bold' }}>
                            Día de la semana
                        </Text>
                    </View>
                    <Text category="p1" style={{ color: colors.subtitle, fontSize: 16, fontWeight: '500' }}>
                        {formatWeekDay(plan.date).charAt(0).toUpperCase() + formatWeekDay(plan.date).slice(1)}
                    </Text>
                </Layout>

                <Layout style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Icon name="calendar-outline" pack="eva" fill={colors.primary} style={{ width: 24, height: 24 }} />
                        <Text category="s1" style={{ color: colors.text, fontWeight: 'bold' }}>
                            Fecha
                        </Text>
                    </View>
                    <Text category="p1" style={{ color: colors.subtitle, fontSize: 16 }}>
                        {formatDate(plan.date)}
                    </Text>
                </Layout>

                <Layout style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Icon name="clock-outline" pack="eva" fill={colors.primary} style={{ width: 24, height: 24 }} />
                        <Text category="s1" style={{ color: colors.text, fontWeight: 'bold' }}>
                            Hora
                        </Text>
                    </View>
                    <Text category="p1" style={{ color: colors.subtitle, fontSize: 16 }}>
                        {formatHour(plan.date)}
                    </Text>
                </Layout>
            </Layout>
        </Card>
    );
}

export default PlanDateCard;