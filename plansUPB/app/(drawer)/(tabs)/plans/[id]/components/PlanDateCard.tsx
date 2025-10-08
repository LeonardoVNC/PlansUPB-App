import { useMemo } from "react";
import { View } from "react-native";
import { Card, Icon, Layout, Text } from "@ui-kitten/components";
import { formatWeekDay, formatDate, formatHour } from '../../../../../../src/utils/formatDate';
import { useThemeColors } from "../../../../../../src/hooks/useThemeColors";
import { Plan } from "../../../../../../src/interfaces/plans.interfaces";

function PlanDateCard({ plan }: { plan: Plan }) {
    const { colors, theme } = useThemeColors();

    const CardRow = ({ icon, title, text }: { icon: string, title: string, text: string }) => {
        return (
            <Layout style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Icon name={icon} pack="eva" fill={colors.primary} style={{ width: 24, height: 24 }} />
                    <Text category="s1" style={{ color: colors.text, fontWeight: 'bold' }}>
                        {title}
                    </Text>
                </View>
                <Text category="p1" style={{ color: colors.subtitle, fontSize: 16, fontWeight: '500' }}>
                    {text}
                </Text>
            </Layout>
        )
    }

    const rows = useMemo(() => {
        return (
            <>
                <CardRow 
                    icon="calendar-outline" 
                    title="Día de la semana" 
                    text={formatWeekDay(plan.date).charAt(0).toUpperCase() + formatWeekDay(plan.date).slice(1)}
                />
                <CardRow 
                    icon="calendar-outline" 
                    title="Fecha" 
                    text={formatDate(plan.date)}
                />
                <CardRow 
                    icon="clock-outline" 
                    title="Hora" 
                    text={formatHour(plan.date)}
                />
            </>
        )
    }, [plan, theme])

    return (
        <Card style={{ marginBottom: 20, padding: 16 }} status="basic" disabled>
            <Layout style={{ flexDirection: 'column', gap: 12 }}>
                {rows}
            </Layout>
        </Card>
    );
}

export default PlanDateCard;