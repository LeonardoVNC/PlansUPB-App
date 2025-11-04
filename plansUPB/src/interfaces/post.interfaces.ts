export interface Post {
    id: string;
    author: string;
    authorName: string;
    content: string;
    category: string;
    likes: string[];
    createdAt: Date;
    imageUrl?: string;
}

export const POST_CATEGORIES = [
    'General',
    'Académico',
    'Deportes',
    'Cultura',
    'Tecnología',
    'Entretenimiento',
    'Anuncios',
    'Otros'
] as const;

export type PostCategory = typeof POST_CATEGORIES[number];
