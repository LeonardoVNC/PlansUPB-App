import { useCallback, useEffect, useState } from "react"
import { Plan, PlanConfirmation } from "@interfaces/plans.interfaces"
import { useUserStore } from "@store/useUserStore"
import * as confirmationService from '@services/confirmations.service'
import * as planService from '@services/plans.service'

export const useConfirmations = () => {
    const [confirmations, setConfirmations] = useState<PlanConfirmation[]>([])
    const [invPlansList, setInvPlansList] = useState<Plan[]>([])

    const { user } = useUserStore();

    const fetchConfirmations = async () => {
        if (!user) return

        const confirmations = await confirmationService.getConfirmationsByUser(user?.code)
        if (!confirmations) return

        setConfirmations(confirmations)
    }

    const confirmsToPlans = useCallback(async () => {
        const invs: Plan[] = []
        for (const confirmation of confirmations) {
            const plan = await planService.getPlanById(confirmation.planId)
            if (plan) invs.push(plan)
        }
        return invs
    }, [confirmations])

    useEffect(() => {
        fetchConfirmations();
    }, [])

    useEffect(() => {
        const fetchPlans = async () => {
            const invitations = await confirmsToPlans()
            setInvPlansList(invitations)
        }
        fetchPlans();
    }, [confirmations])


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
    }

    return {
        confirmations,
        invPlansList,
        respondToInvitation,
    }

    // const setRSVP = (planId: string, willAttend: boolean) => {
    //     if (!user) return;

    //     updateConfirmation(planId, user.code, { 
    //         confirmed: willAttend,
    //         respondedAt: new Date()
    //     });

    //     if (willAttend) {
    //         const existingConfirmation = confirmations.find(
    //             c => c.planId === planId && c.userCode === user.code
    //         );
    //         if (!existingConfirmation) {
    //             addConfirmation({
    //                 planId,
    //                 userCode: user.code,
    //                 confirmed: true,
    //                 status: 'accepted',
    //                 respondedAt: new Date()
    //             });
    //         }
    //     }
    // }

    // const getUserRSVP = (planId: string): boolean | undefined => {
    //     if (!user) return undefined;
    //     const confirmation = confirmations.find(
    //         c => c.planId === planId && c.userCode === user.code
    //     );
    //     return confirmation?.confirmed;
    // }

    // const getAttendanceStats = (planId: string) => {
    //     const plan = getPlanById(planId);
    //     if (!plan) return { attending: 0, notAttending: 0, percentage: 0, total: 0 };

    //     const planConfirmations = confirmations.filter(c => c.planId === planId);

    //     const attending = planConfirmations.filter(c => c.confirmed === true).length + 1;
    //     const notAttending = planConfirmations.filter(c => c.confirmed === false).length;
    //     const total = attending + notAttending;
    //     const percentage = total > 0 ? Math.round((attending / total) * 100) : 100;

    //     return { attending, notAttending, percentage, total };
    // }

}
