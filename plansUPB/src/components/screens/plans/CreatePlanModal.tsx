import React, { useEffect, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Input, Icon } from '@ui-kitten/components';
import CreationModal from '@common_components/CreationModal';
import usePlans from '@hooks/usePlans';
import { Plan } from '@interfaces/plans.interfaces';
import { useUserStore } from '@store/useUserStore';
import { formatSimpleDateHour } from '@utils/formatDate';

interface CreatePlanModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function CreatePlanModal({ visible, onClose }: CreatePlanModalProps) {
    const { user } = useUserStore();
    const { createPlan } = usePlans();
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
    const [isValidInfo, setIsValidInfo] = useState(false)

    useEffect(() => {
        const isDateValid = !isNaN(date.getTime());
        setIsValidInfo(title.trim().length > 0 && description.trim().length > 0 && isDateValid);
    }, [title, description, date]);

    const handleSubmit = () => {
        if (!isValidInfo || !user) {
            return
        }
        const values: Omit<Plan, 'id'> = {
            ownerCode: user?.code,
            title: title.trim(),
            category: category.trim(),
            date,
            description: description.trim(),
            status: 'open'
        }
        createPlan(values);
        resetForm();
        onClose();
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setDate(new Date());
    };

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
            <Input
                label="Categoría"
                placeholder="Ej: Cine"
                value={category}
                onChangeText={setCategory}
                style={{ marginBottom: 8 }}
                status={category.trim() ? 'success' : 'basic'}
                accessoryLeft={<Icon name="edit-2-outline" pack="eva" />}
            />
            <Input
                label="Fecha y Hora"
                value={formatSimpleDateHour(date)}
                placeholder="Selecciona fecha y hora"
                editable={false}
                onPressIn={() => setIsDatePickerVisible(true)}
                style={{ marginBottom: 8 }}
                status={isValidInfo ? 'success' : 'basic'}
                accessoryLeft={<Icon name="calendar-outline" pack="eva" />}
            />
            {/* Falta place, cover y poll  aun */}

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={(selectedDate) => {
                    setDate(selectedDate);
                    setIsDatePickerVisible(false);
                }}
                onCancel={() => { setIsDatePickerVisible(false) }}
                minimumDate={new Date()}
                date={date}
                display="default"
            />
        </CreationModal>
    );
}
