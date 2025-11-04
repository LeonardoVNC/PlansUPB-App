import { View, Alert } from "react-native";
import { Button } from "@ui-kitten/components";
import usePlans from "@hooks/usePlans";
import { Plan } from "@interfaces/plans.interfaces";
import { usePlanStore } from "@store/usePlanStore";
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring,
    withSequence,
    FadeIn,
    FadeOut,
    SharedValue
} from 'react-native-reanimated';

function PlanStatusActions({ plan }: { plan: Plan }) {
    const { removeActualPlan } = usePlanStore();
    const { changePlanStatus } = usePlans();
    
    const publishButtonScale = useSharedValue(1);
    const cancelButtonScale = useSharedValue(1);
    const completeButtonScale = useSharedValue(1);
    
    const animateButton = (buttonScale: SharedValue<number>) => {
        buttonScale.value = withSequence(
            withSpring(0.9, { damping: 10 }),
            withSpring(1, { damping: 10 })
        );
    };

    const handleOpenDraft = () => {
        animateButton(publishButtonScale);
        
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
        animateButton(cancelButtonScale);
        
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
        animateButton(completeButtonScale);
        
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

    const publishButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: publishButtonScale.value }]
    }));

    const cancelButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: cancelButtonScale.value }]
    }));

    const completeButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: completeButtonScale.value }]
    }));

    return (
        <View style={{ marginTop: 16 }}>
            {plan.status === 'draft' && (
                <Animated.View 
                    entering={FadeIn.duration(400)}
                    exiting={FadeOut.duration(200)}
                    style={publishButtonStyle}
                >
                    <Button
                        onPress={handleOpenDraft}
                        status="primary"
                        style={{ marginBottom: 8 }}
                    >
                        Publicar Plan
                    </Button>
                </Animated.View>
            )}
            {plan.status === 'open' && (
                <Animated.View 
                    entering={FadeIn.duration(400)}
                    exiting={FadeOut.duration(200)}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}
                >
                    <Animated.View style={[{ flex: 1 }, cancelButtonStyle]}>
                        <Button
                            onPress={handleCancelPlan}
                            status="danger"
                            style={{ flex: 1 }}
                        >
                            Cancelar
                        </Button>
                    </Animated.View>
                    <Animated.View style={[{ flex: 1 }, completeButtonStyle]}>
                        <Button
                            onPress={handleCompletePlan}
                            status="success"
                            style={{ flex: 1 }}
                        >
                            Completar
                        </Button>
                    </Animated.View>
                </Animated.View>
            )}
        </View>
    );
}

export default PlanStatusActions;