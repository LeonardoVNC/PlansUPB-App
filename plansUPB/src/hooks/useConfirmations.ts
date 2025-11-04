import { useMemo } from "react"
import { Plan, PlanConfirmation } from "@interfaces/plans.interfaces"
import { useUserStore } from "@store/useUserStore"
import { useConfirmationStore } from "@store/useConfirmationStore"
import * as confirmationService from '@services/confirmations.service'
import * as planService from '@services/plans.service'

export const useConfirmations = () => {
    const { confirmations, setConfirmations, invitedPlans, setInvitedPlans } = useConfirmationStore();
    const { user } = useUserStore();

    // Función principal de fetch que debe llamarse desde la screen
    const fetchInvitedPlans = async () => {
        if (!user) return;

        // 1. Obtener confirmaciones del usuario
        const userConfirmations = await confirmationService.getConfirmationsByUser(user.code);
        if (!userConfirmations) return;

        setConfirmations(userConfirmations);

        // 2. Obtener los planes asociados a esas confirmaciones
        const plans: Plan[] = [];
        for (const confirmation of userConfirmations) {
            const plan = await planService.getPlanById(confirmation.planId);
            if (plan) plans.push(plan);
        }
        setInvitedPlans(plans);
    }

    // Filtrar invitaciones pendientes
    const pendingInvitations = useMemo(() => {
        if (!user) return [];
        const plans = confirmations
            .filter(c => c.userCode === user.code && c.status === 'pending')
            .map(c => invitedPlans.find(p => p.id === c.planId))
            .filter((p): p is Plan => p !== undefined);
        
        // Eliminar duplicados por planId
        const uniquePlans = plans.filter((plan, index, self) => 
            index === self.findIndex(p => p.id === plan.id)
        );
        return uniquePlans;
    }, [confirmations, invitedPlans, user]);

    // Filtrar invitaciones aceptadas
    const acceptedInvitations = useMemo(() => {
        if (!user) return [];
        const plans = confirmations
            .filter(c => c.userCode === user.code && c.status === 'accepted')
            .map(c => invitedPlans.find(p => p.id === c.planId))
            .filter((p): p is Plan => p !== undefined);
        
        // Eliminar duplicados por planId
        const uniquePlans = plans.filter((plan, index, self) => 
            index === self.findIndex(p => p.id === plan.id)
        );
        return uniquePlans;
    }, [confirmations, invitedPlans, user])


    const respondToInvitation = async (planId: string, accept: boolean) => {
        if (!user) return;

        if (accept) {
            await confirmationService.updateConfirmation(planId, user.code, {
                status: 'accepted',
                confirmed: true,
                respondedAt: new Date()
            });
        } else {
            await confirmationService.removeConfirmation(planId, user.code);
        }
        await fetchInvitedPlans();
    }

    const setRSVP = async (planId: string, willAttend: boolean) => {
        if (!user) return;

        const existingConfirmation = confirmations.find(
            c => c.planId === planId && c.userCode === user.code
        );

        if (existingConfirmation) {
            await confirmationService.updateConfirmation(planId, user.code, { 
                confirmed: willAttend,
                respondedAt: new Date()
            });
        } else {
            await confirmationService.addConfirmation({
                planId,
                userCode: user.code,
                confirmed: willAttend,
                status: willAttend ? 'accepted' : 'declined',
                respondedAt: new Date()
            });
        }
        
        await fetchInvitedPlans();
    }

    const getUserRSVP = (planId: string): boolean | undefined => {
        if (!user) return undefined;
        const confirmation = confirmations.find(
            c => c.planId === planId && c.userCode === user.code
        );
        return confirmation?.confirmed;
    }

    const getAttendanceStats = (planId: string) => {
        const planConfirmations = confirmations.filter(c => c.planId === planId);

        const attending = planConfirmations.filter(c => c.confirmed === true).length;
        const notAttending = planConfirmations.filter(c => c.confirmed === false).length;
        const total = attending + notAttending;
        const percentage = total > 0 ? Math.round((attending / total) * 100) : 0;

        return { attending, notAttending, percentage, total };
    }

    return {
        fetchInvitedPlans,
        pendingInvitations,
        acceptedInvitations,
        respondToInvitation,
        setRSVP,
        getUserRSVP,
        getAttendanceStats,
    }
}
