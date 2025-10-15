import React, { useEffect, useState } from 'react';
import { Input, Icon } from '@ui-kitten/components';
import { Plan } from '../../../../../src/interfaces/plans.interfaces';
import { useUserStore } from '../../../../../src/store/useUserStore';
import usePlans from '../../../../../src/hooks/usePlans';
import CreationModal from '@common_components/CreationModal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { formatSimpleDateHour } from '../../../../../src/utils/formatDate';

interface CreatePlanModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function CreatePlanModal({ visible, onClose }: CreatePlanModalProps) {
    const { user } = useUserStore();
    const { createPlan } = usePlans();
    const [title, setTitle] = useState("")
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
            title: title.trim(),
            description: description.trim(),
            date,
            owner: user?.code,
            done: false
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
                label="Fecha y Hora"
                value={formatSimpleDateHour(date)}
                placeholder="Selecciona fecha y hora"
                editable={false}
                onPressIn={() => setIsDatePickerVisible(true)}
                style={{ marginBottom: 8 }}
                status={isValidInfo ? 'success' : 'basic'}
                accessoryLeft={<Icon name="calendar-outline" pack="eva" />}
            />

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
