import { useState } from 'react';
import { generateUUID } from '../utils/idGenerator';
import { POST_CATEGORIES } from '../interfaces/post.interfaces';

export interface CreatePostData {
    content: string;
    category: string;
    imageUrl?: string;
}

export const useCreatePost = (initialState?: Partial<CreatePostData>) => {
    const [formData, setFormData] = useState<CreatePostData>({
        content: '',
        category: POST_CATEGORIES[0],
        imageUrl: undefined,
        ...initialState
    });

    const updateField = (field: keyof CreatePostData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = (): boolean => {
        if (!formData.content.trim()) {
            alert('Por favor ingresa el contenido de la publicación');
            return false;
        }

        if (formData.content.trim().length < 10) {
            alert('El contenido debe tener al menos 10 caracteres');
            return false;
        }

        return true;
    };

    const preparePostData = async (userCode: string, userName: string, overrideImageUrl?: string) => {
        if (!validateForm()) return null;

        const imageUrl = overrideImageUrl !== undefined ? overrideImageUrl : formData.imageUrl;

        return {
            id: await generateUUID(),
            author: userCode,
            authorName: userName,
            content: formData.content.trim(),
            category: formData.category,
            likes: [],
            createdAt: new Date(),
            imageUrl: imageUrl?.trim() || undefined
        };
    };

    const resetForm = () => {
        setFormData({
            content: '',
            category: POST_CATEGORIES[0],
            imageUrl: undefined
        });
    };

    return {
        formData,
        updateField,
        preparePostData,
        resetForm,
        categories: POST_CATEGORIES
    };
};
