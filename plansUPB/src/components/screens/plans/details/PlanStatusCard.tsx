import { useEffect, useMemo, useState } from "react";
import { Card, Icon, Text } from "@ui-kitten/components";
import BigChip from "@common_components/BigChip";
import { useThemeColors } from "@hooks/useThemeColors";
import { Plan } from "@interfaces/plans.interfaces";
import { globalStyles } from "@styles/globals";
import { cardStatusMap, iconStatusMap, labelStatusMap } from "@styles/planStatusMap";
import PlanStatusActions from "./PlanStatusActions";

function PlanStatusCard({ plan, isOwner = false }: { plan: Plan, isOwner?: boolean }) {
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
            setStatusColor(colors.warning)
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

            <BigChip icon={mainIcon} color={statusColor || ""} text={statusLabel || ""} />
            
            {isOwner && (<PlanStatusActions plan={plan} />)}
        </Card>
    );
}

export default PlanStatusCard;