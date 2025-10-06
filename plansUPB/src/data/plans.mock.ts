import { Plan, PlanConfirmation } from '../interfaces/plans.interfaces';

export const mockPlans: Plan[] = [
    {
        id: '1',
        owner: '8080',
        title: 'Momento semana hamburguesa o algo asi',
        description: 'Reunión para comer hamburguesas y rompernos el bolsillo',
        date: new Date('2024-10-18T20:00:00'),
        done: false,
    },
    {
        id: '2',
        owner: '8080',
        title: 'Peli al multi',
        description: 'Vamo a ver una peli',
        date: new Date('2024-10-20T20:00:00'),
        done: false,
    },
    {
        id: '3',
        owner: '1234', 
        title: 'Estudiar para App Redes',
        description: 'Nos vamos a poner a estudiar para el examen pq si no nos va a comer el tiempo pipipi',
        date: new Date('2024-10-15T15:00:00'),
        done: true,
    },
    {
        id: '4',
        owner: '5678',
        title: 'Invadir el bloque A',
        description: 'Vamos a invadir las aulas de FACED a ver si dejan de mandarnos a Obrajes todo el semestre :c',
        date: new Date('2024-10-25T16:00:00'),
        done: false,
    },
];

export const mockConfirmations: PlanConfirmation[] = [
    { planId: '1', userId: '8080', confirmed: true },
    { planId: '1', userId: '1234', confirmed: false, comment: 'Comentario general de prueba en plan hola' },
    { planId: '2', userId: '8080', confirmed: true },
    { planId: '3', userId: '8080', confirmed: true, comment: 'Procede a comentar*' },
    { planId: '4', userId: '1234', confirmed: true },
];

