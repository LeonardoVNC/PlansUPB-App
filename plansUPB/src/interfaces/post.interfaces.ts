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

export interface PostState {
    posts: Post[];
    addPost: (post: Post) => void;
    updatePost: (postId: string, updates: Partial<Post>) => void;
    removePost: (postId: string) => void;
    toggleLike: (postId: string, userId: string) => void;
    getPostsByAuthor: (authorId: string) => Post[];
    getPostsByCategory: (category: string) => Post[];
    getPostById: (postId: string) => Post | undefined;
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
