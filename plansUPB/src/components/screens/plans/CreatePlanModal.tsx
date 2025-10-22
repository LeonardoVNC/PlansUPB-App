import React, { useEffect, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Input, Icon, Select, SelectItem, IndexPath, Divider, Text } from '@ui-kitten/components';
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
    const [selectedIndex, setSelectedIndex] = useState<IndexPath | null>(null);
    const [date, setDate] = useState(new Date());
    const [cover, setCover] = useState("");
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
    const [isValidInfo, setIsValidInfo] = useState(false)

    const categories = ["Comida", "Cine", "Juegos", "Estudio", "Otro"]

    useEffect(() => {
        const isDateValid = !isNaN(date.getTime());
        setIsValidInfo(
            !!user &&
            title.trim().length > 0 &&
            category.trim().length > 0 &&
            description.trim().length > 0 &&
            isDateValid
        );
    }, [user, title, category, description, date]);

    const handleSubmit = () => {
        if (!isValidInfo || !user) {
            return
        }

        let values: Omit<Plan, 'id'> = {
            ownerCode: user?.code,
            title: title.trim(),
            category: category.trim(),
            date,
            description: description.trim(),
            status: 'open'
        }
        if (cover) {
            const coverNumber = parseFloat(cover);
            if (isNaN(coverNumber)) {
                console.error("Cover con valor inválido")
                return
            }
            values = {...values, cover: coverNumber}
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
        setCategory("");
        setCover("");
        setSelectedIndex(null);
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

            <Select
                label="Categoría"
                placeholder="Selecciona una categoria"
                selectedIndex={selectedIndex ?? undefined}
                onSelect={(index) => {
                    const i = index as IndexPath;
                    setSelectedIndex(i);
                    setCategory(categories[i.row]);
                }}
                style={{ marginBottom: 8 }}
                value={category.trim()}
                status={category.trim() ? 'success' : 'basic'}
                accessoryLeft={<Icon name="bookmark-outline" pack="eva" />}
            >
                {categories.map((c) => (
                    <SelectItem title={c} key={c} />
                ))}
            </Select>

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

            <Divider style={{ marginVertical: 6 }} />

            <Input
                label="Cover"
                value={cover}
                placeholder='0'
                onChangeText={(text) => {
                    const numericText = text.replace(/[^0-9.]/g, '');
                    setCover(numericText);
                }}
                keyboardType="numeric"
                style={{ marginBottom: 8 }}
                accessoryLeft={<Icon name="credit-card-outline" pack="eva" />}
                accessoryRight={<Text style={{ fontSize: 16 }}>Bs.</Text>}
            />

            {/* Falta place, y poll  aun */}

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
