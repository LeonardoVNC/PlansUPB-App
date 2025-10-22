import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Card, Icon, Text } from "@ui-kitten/components";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";
import { cardStatusMap, iconStatusMap, labelStatusMap } from "@styles/planStatusMap";
import { globalStyles } from "@styles/globals";

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
                style={{ width: 20, height: 20 }}
            />
        );
    }, [plan.status, statusColor])

    useEffect(() => {
        changeStatusColor();
        setStatus(cardStatusMap.get(plan.status))
        setStatusLabel(labelStatusMap.get(plan.status))
    }, [plan.status])

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
            style={globalStyles().app_card}
            status={status}
            disabled
        >
            <Text category="h6" style={{ color: colors.text, marginBottom: 16, textAlign: 'center', lineHeight: 28 }}>
                Estado del plan
            </Text>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: statusColor + '20',
                    alignItems: 'center',
                    marginBottom: 8,
                    paddingVertical: 4,
                    gap: 8,
                    borderRadius: 12,
                    overflow: 'hidden',
                }}
            >
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