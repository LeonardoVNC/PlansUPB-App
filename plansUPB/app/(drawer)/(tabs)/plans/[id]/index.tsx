import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Spinner, Text } from "@ui-kitten/components";
import ScreenTemplate from "../../../../../src/components/ScreenTemplate";
import { Plan } from "../../../../../src/interfaces/plans.interfaces";
import usePlans from '../../../../../src/hooks/usePlans';

function PlanDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const [loading, setLoading] = useState(true)
    const [actualPlan, setActualPlan] = useState<Plan>()
    const { getPlanById } = usePlans();

    useEffect(() => {
        setLoading(true)
        const plan = getPlanById(id)
        if (plan) {
            setActualPlan(plan)
            setLoading(false);
        }
    }, [])
    
    if (loading) {
        return ( 
            <ScreenTemplate title='Cargando...' subtitle='Espere un momento por favor...'>
                <Spinner/>
            </ScreenTemplate>
        )
    }

    return ( 
        <ScreenTemplate title={actualPlan?.title || "Detalles del plan"} subtitle={`Detalles sobre ${actualPlan?.title}`}>

            <Text>OLA {id}</Text>
        </ScreenTemplate>
    );
}

export default PlanDetailScreen;