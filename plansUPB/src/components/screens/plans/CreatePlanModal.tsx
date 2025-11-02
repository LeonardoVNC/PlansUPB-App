import React, { useEffect, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Input, Icon, Select, SelectItem, IndexPath, Divider, Text } from '@ui-kitten/components';
import CreationModal from '@common_components/CreationModal';
import { categories } from 'data/categories';
import usePlans from '@hooks/usePlans';
import { Plan } from '@interfaces/plans.interfaces';
import { useUserStore } from '@store/useUserStore';
import { formatSimpleDateHour } from '@utils/formatDate';
import { usePlanStore } from '@store/usePlanStore';

interface CreatePlanModalProps {
    visible: boolean;
    onClose: () => void;
    plan?: Plan;
}

export default function CreatePlanModal({ visible, onClose, plan }: CreatePlanModalProps) {
    const { user } = useUserStore();
    const { createPlan, updatePlan } = usePlans()
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [selectedIndex, setSelectedIndex] = useState<IndexPath | null>(null);
    const [date, setDate] = useState(new Date());
    const [cover, setCover] = useState("");
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
    const [isValidInfo, setIsValidInfo] = useState(false)

    const { removeActualPlan } = usePlanStore();

    useEffect(() => {
        if (plan) {
            setTitle(plan.title || "");
            setCategory(plan.category || "");
            setDescription(plan.description || "");
            setDate(plan.date ? new Date(plan.date) : new Date());
            setCover(plan.cover ? String(plan.cover) : "")
            const index = categories.indexOf(plan.category);
            setSelectedIndex(new IndexPath(index));
        }
    }, [plan]);

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
        if (!isValidInfo || !user) return;

        if (plan) {
            handleUpdate();
        } else {
            handleCreation();
        }
        resetForm();
        onClose();
    };

    const handleCreation = () => {
        if (!user) return

        let values: Omit<Plan, 'id'> = {
            ownerCode: user.code,
            title: title.trim(),
            category: category.trim(),
            date,
            description: description.trim(),
            status: 'draft'
        };
        if (cover) {
            const coverNumber = parseFloat(cover);
            if (isNaN(coverNumber)) {
                console.error("Cover con valor inválido");
                return;
            }
            values = { ...values, cover: coverNumber };
        }
        createPlan(values);
    }

    const handleUpdate = () => {
        if (!plan || !user) return

        const coverNumber = cover ? parseFloat(cover) : undefined;
        if (cover && isNaN(coverNumber as number)) {
            console.error("Cover con valor inválido");
            return;
        }
        const updated: Partial<Plan> = {
            title: title.trim(),
            category: category.trim(),
            date,
            description: description.trim(),
            ...(cover && { cover: coverNumber }),
        };
        updatePlan(plan.id, updated);
        removeActualPlan()
    }

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
            title={!!plan ? 'Editar plan' : 'Proponer un plan'}
            confirmText={!!plan ? 'Guardar cambios' : 'Crear Plan'}
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
