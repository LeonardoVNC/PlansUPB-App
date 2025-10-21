import { Plan, PlanConfirmation } from '@interfaces/plans.interfaces';

export const mockPlans: Plan[] = [
    {
        id: '1',
        ownerCode: '8080',
        title: 'Plan test',
        category: 'Estudio',
        placeName: 'Multicine',
        placeLat: -16.51069892816923,
        placeLng: -68.12209527707684,
        date: new Date('2024-11-20T20:00:00'),
        description: 'Pequeño plan de prueba para comprobar que todo funcione más o menos como se espera',
        cover: 10.0,
        status: 'open'
    },
    {
        id: '2',
        ownerCode: '7070',
        title: 'Plan test 2',
        category: 'Comida',
        placeName: 'Multicine',
        placeLat: -16.511000182385946,
        placeLng: -68.12455582784277,
        date: new Date('2024-11-25T20:00:00'),
        description: 'Pequeño plan de prueba para comprobar que todo funcione más o menos como se espera, ahora es personal',
        status: 'open'
    },
]

export const mockConfirmations: PlanConfirmation[] = [
    { planId: '2', userCode: '8080', confirmed: true, comment: 'Ahi nos vidrios bleh' }
];