import { Plan, PlanConfirmation, PlanStatus } from '@interfaces/plans.interfaces';

export const mockPlanStatus: PlanStatus[] = [
    {id: '1', description: 'draft'},
    {id: '2', description: 'open'},
    {id: '3', description: 'closed'},
    {id: '4', description: 'canceled'}
]

export const mockPlans: Plan[] = [
    {
        id: '1',
        ownerCode: '8080',
        title: 'Plan test',
        categoryId: '4',
        placeId: '1',
        date: new Date('2024-11-20T20:00:00'),
        description: 'Pequeño plan de prueba para comprobar que todo funcione más o menos como se espera',
        cover: 10.0,
        statusId: '2'
    },
    {
        id: '2',
        ownerCode: '7070',
        title: 'Plan test 2',
        categoryId: '1',
        placeId: '2',
        date: new Date('2024-11-25T20:00:00'),
        description: 'Pequeño plan de prueba para comprobar que todo funcione más o menos como se espera, ahora es personal',
        statusId: '2'
    },
]

export const mockConfirmations: PlanConfirmation[] = [
    { planId: '2', userCode: '8080', confirmed: true, comment: 'Ahi nos vidrios bleh' }
];