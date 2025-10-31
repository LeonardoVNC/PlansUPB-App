import { View, Alert } from "react-native";
import { Button } from "@ui-kitten/components";
import usePlans from "@hooks/usePlans";
import { Plan } from "@interfaces/plans.interfaces";
import { usePlanStore } from "@store/usePlanStore";

function PlanStatusActions({ plan }: { plan: Plan }) {
    const { removeActualPlan } = usePlanStore();
    const { changePlanStatus } = usePlans();
    
    const handleOpenDraft = () => {
        Alert.alert(
            'Abrir plan',
            '¿Quieres abrir el plan? Una vez abierto no se podrá editar su información',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', onPress: () => handleConfirmAction('open') },
            ]
        );
    };

    const handleCancelPlan = () => {
        Alert.alert(
            'Cancelar plan',
            '¿Quieres cancelar el plan?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', onPress: () => handleConfirmAction('cancelled') },
            ]
        );
    };

    const handleCompletePlan = () => {
        Alert.alert(
            'Completar plan',
            '¿Quieres marcar el plan como completado?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Confirmar', onPress: () => handleConfirmAction('closed') },
            ]
        );
    };

    const handleConfirmAction = (status: string) => {
        changePlanStatus(plan.id, status)
        removeActualPlan()
    }

    return (
        <View style={{ marginTop: 16 }}>
            {plan.status === 'draft' && (
                <Button
                    onPress={handleOpenDraft}
                    status="primary"
                    style={{ marginBottom: 8 }}
                >
                    Publicar Plan
                </Button>
            )}
            {plan.status === 'open' && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                    <Button
                        onPress={handleCancelPlan}
                        status="danger"
                        style={{ flex: 1 }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onPress={handleCompletePlan}
                        status="success"
                        style={{ flex: 1 }}
                    >
                        Completar
                    </Button>
                </View>
            )}
        </View>
    );
}

export default PlanStatusActions;