import { Poll } from '../interfaces/vote.interfaces';

export const mockPolls: Poll[] = [
    {
        id: 'poll1',
        question: '¿Cuual es la mejor carrera 🗿🔥?',
        description: 'Cual te parece la mejor carrera',
        allowMultiple: false,
        createdAt: new Date('2024-10-07T10:00:00'),
        closesAt: new Date('2024-10-10T23:59:59'),
        options: [
            { id: 'opt1', text: 'Viernes', votes: 5 },
            { id: 'opt2', text: 'Sábado', votes: 8 },
            { id: 'opt3', text: 'Domingo', votes: 2 },
        ],
        votes: [
            { userId: '8080', optionId: 'opt2' },
            { userId: '1234', optionId: 'opt1' },
            { userId: '5678', optionId: 'opt2' },
        ],
        createdBy: '8080',
    },
    {
        id: 'poll2',
        question: '¿Qué película vemos en el cine?',
        description: 'Ayúdenme a decidir qué película ver este fin de semana',
        allowMultiple: false,
        createdAt: new Date('2024-10-06T14:30:00'),
        options: [
            { id: 'opt4', text: 'Deadpool & Wolverine', votes: 12 },
            { id: 'opt5', text: 'Spiderman', votes: 7 },
            { id: 'opt6', text: 'Mision Imposible', votes: 4 },
        ],
        votes: [
            { userId: '8080', optionId: 'opt4' },
            { userId: '1234', optionId: 'opt4' },
            { userId: '5678', optionId: 'opt5' },
        ],
        createdBy: '1234',
    },
    {
        id: 'poll3',
        question: '¿Qué juegos jugamos el viernes?',
        description: 'Selecciona todos los juegos que te gustaría jugar',
        allowMultiple: true,
        createdAt: new Date('2024-10-05T18:00:00'),
        closesAt: new Date('2024-10-08T20:00:00'),
        options: [
            { id: 'opt7', text: 'Among Us', votes: 6 },
            { id: 'opt8', text: 'Valorant', votes: 9 },
            { id: 'opt9', text: 'Mario Kart', votes: 11 },
            { id: 'opt10', text: 'Smash Bros', votes: 8 },
        ],
        votes: [
            { userId: '8080', optionId: 'opt8' },
            { userId: '8080', optionId: 'opt9' },
            { userId: '1234', optionId: 'opt7' },
            { userId: '1234', optionId: 'opt9' },
            { userId: '5678', optionId: 'opt9' },
            { userId: '5678', optionId: 'opt10' },
        ],
        createdBy: '5678',
    },
    {
        id: 'poll4',
        question: '¿Dónde almorzamos mañana?',
        allowMultiple: false,
        createdAt: new Date('2024-10-07T12:00:00'),
        options: [
            { id: 'opt11', text: 'Cafetería UPB', votes: 3 },
            { id: 'opt12', text: 'Patio de comidas Megacenter', votes: 7 },
            { id: 'opt13', text: 'Algún restaurante en Obrajes', votes: 2 },
        ],
        votes: [
            { userId: '8080', optionId: 'opt12' },
            { userId: '1234', optionId: 'opt12' },
        ],
        createdBy: '8080',
    },
];
