import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Card, Icon, Text } from "@ui-kitten/components";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";
import { cardStatusMap, iconStatusMap, labelStatusMap } from "@styles/planStatusMap";

function PlanStatusCard({ plan }: { plan: Plan }) {
    const { colors } = useThemeColors();
    const [statusColor, setStatusColor] = useState<string>()
    const [status, setStatus] = useState<string>()
    const [statusLabel, setStatusLabel] = useState<string>()

    const mainIcon = useMemo(() => {
        return (
            <Icon
                name={iconStatusMap.get(plan.status)}
                pack="eva"
                fill={statusColor}
                style={{ width: 32, height: 32 }}
            />
        )
    }, [plan, statusColor])

    useEffect(() => {
        changeStatusColor();
        setStatus(cardStatusMap.get(plan.status))
        setStatusLabel(labelStatusMap.get(plan.status))
    }, [plan])

    const changeStatusColor = () => {
        if (plan.status === 'draft') {
            setStatusColor(colors.muted)
        } else if (plan.status === 'open') {
            setStatusColor(colors.primary)
        } else if (plan.status === 'closed') {
            setStatusColor(colors.success)
        } else {
            setStatusColor(colors.danger)
        }
    }

    return (
        <Card
            style={{ marginBottom: 24, padding: 16, borderRadius: 12 }}
            status={status}
            disabled
        >
            <Text category="h6" style={{ color: colors.text, marginBottom: 16, textAlign: 'center', lineHeight: 28 }}>
                Estado del plan
            </Text>

            <View
                style={{
                    flexDirection: 'row',
                    gap: 8,
                    justifyContent: 'center',
                    marginBottom: 8,
                    alignItems: 'center',
                    borderRadius: 12,
                    paddingVertical: 4,
                    backgroundColor: statusColor + '20'
                }}>
                {mainIcon}
                <Text
                    category="h6"
                    style={{
                        color: statusColor,
                        fontSize: 18,
                    }}
                >
                    {statusLabel}
                </Text>
            </View>
        </Card>
    );
}

export default PlanStatusCard;