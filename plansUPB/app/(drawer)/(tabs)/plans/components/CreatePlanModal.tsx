import React, { useEffect, useState } from 'react';
import { Input,Icon} from '@ui-kitten/components';
import { Plan } from '../../../../../src/interfaces/plans.interfaces';
import { useUserStore } from '../../../../../src/store/useUserStore';
import usePlans from '../../../../../src/hooks/usePlans';
import CreationModal from '../../../../../src/components/CreationModal';

interface CreatePlanModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function CreatePlanModal({ visible, onClose }: CreatePlanModalProps) {
    const { user } = useUserStore();
    const { createPlan } = usePlans();
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [isValidInfo, setIsValidInfo] = useState(false)
    //TODO fecha y hora

    useEffect(() => {
        setIsValidInfo(title.trim().length > 0 && description.trim().length > 0)
    }, [title, description])

    const handleSubmit = () => {
        if (!isValidInfo || !user) {
            return
        }
        const values: Omit<Plan, 'id'> = {
            title: title.trim(),
            description: description.trim(),
            date: new Date, //TODO fecha y hora x2
            owner: user?.code,
            done: false
        }
        createPlan(values);
        resetForm();
        onClose();
    }

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setTitle("")
        setDescription("")
    }

    return (
        <CreationModal
            visible={visible}
            onSubmit={handleSubmit}
            onClose={onClose}
            onCancel={handleCancel}
            title='Proponer un plan'
            confirmText='Crear Plan'
            confirmDisabled={!isValidInfo}
        >
            <Input
                label="Título"
                placeholder="Ej: Salir al cine"
                value={title}
                onChangeText={setTitle}
                style={{ marginBottom: 8 }}
                status={title.trim() ? 'success' : 'basic'}
                accessoryLeft={<Icon name="edit-2-outline" pack="eva" />}
            />
            <Input
                label="Descripción"
                placeholder="Detalles extra del plan..."
                value={description}
                onChangeText={setDescription}
                style={{ marginBottom: 8 }}
                status={description.trim() ? 'success' : 'basic'}
                accessoryLeft={<Icon name="message-square-outline" pack="eva" />}
                multiline
                numberOfLines={4}
                textStyle={{ minHeight: 80, lineHeight: 20 }}
            />
        </CreationModal>
    );
}
