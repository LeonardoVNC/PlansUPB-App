import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Card, Icon, Layout, Text } from "@ui-kitten/components";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";
import { globalStyles } from "@styles/globals";
import { formatWeekDay, formatDate, formatHour, getRelativeDate } from '@utils/formatDate';

function PlanDateCard({ plan }: { plan: Plan }) {
    const [isCloseDate, setIsCloseDate] = useState(false)
    const { colors, theme } = useThemeColors();

    useEffect(() => {
        const diffTime = plan.date.getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        setIsCloseDate(diffDays >= 0 && diffDays <= 7)
    }, [plan.date])

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
                {!isCloseDate && (
                    <>
                        <CardRow
                            icon="calendar-outline"
                            title="Día de la semana"
                            text={formatWeekDay(plan.date).charAt(0).toUpperCase() + formatWeekDay(plan.date).slice(1)}
                        />

                    </>
                )}
                <CardRow
                    icon="calendar-outline"
                    title="Fecha"
                    text={isCloseDate ? getRelativeDate(plan.date) : formatDate(plan.date)}
                />
                <CardRow
                    icon="clock-outline"
                    title="Hora"
                    text={formatHour(plan.date)}
                />
            </>
        )
    }, [plan.date, theme, isCloseDate])

    return (
        <Card
            style={globalStyles().app_card}
            status="basic"
            disabled
        >
            <Layout style={{ flexDirection: 'column', gap: 12 }}>
                {rows}
            </Layout>
        </Card>
    );
}

export default PlanDateCard;