import React from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import ScreenTemplate from '../../../../../src/components/ScreenTemplate';
import usePlans from '../../../../../src/hooks/usePlans';
import { Plan } from '../../../../../src/interfaces/plans.interfaces';
import CreatePlanForm from './components/CreatePlanForm';

function PlanCreateScreen() {
    const router = useRouter();
    const { createPlan } = usePlans();

    const handleSubmit = async (values: Omit<Plan, 'id'>) => {
        await createPlan(values);
        router.push('/plans');
    };

    return (
        <ScreenTemplate title="Nuevo Plan" subtitle="Crea un plan para ti o equipo">
            <View>
                <CreatePlanForm
                    onSubmit={handleSubmit}
                />
            </View>
        </ScreenTemplate>
    );
}

export default PlanCreateScreen;
