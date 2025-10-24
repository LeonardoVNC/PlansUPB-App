import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Input, CheckBox, Text, Icon, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import CreationModal from '@common_components/CreationModal';
import { useCreatePoll, CloseCriteria, TiebreakMethod } from '@hooks/useCreatePoll';
import { useThemeColors } from '@hooks/useThemeColors';
import { formatSimpleDateHour } from '@utils/formatDate';

interface CreatePollModalProps {
    visible: boolean;
    onClose: () => void;
    onCreatePoll: (poll: any) => void;
    planId?: string;
}

export default function CreatePollModal({ visible, onClose, onCreatePoll, planId }: CreatePollModalProps) {
    const { colors } = useThemeColors();
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

    const {
        formData,
        updateField,
        addOption,
        removeOption,
        updateOption,
        preparePollData,
        resetForm
    } = useCreatePoll();

    const closeCriteriaOptions: { value: CloseCriteria; label: string }[] = [
        { value: 'none', label: 'Sin criterio de cierre' },
        { value: 'deadline', label: 'Fecha límite' },
        { value: 'quorum', label: 'Número de votos (quorum)' },
    ];

    const tiebreakOptions: { value: TiebreakMethod; label: string }[] = [
        { value: 'oldest_first', label: 'Más antiguo primero' },
        { value: 'creator_decides', label: 'Creador decide' },
    ];

    const getCloseCriteriaIndex = () => {
        const criteriaIndex = closeCriteriaOptions.findIndex(opt => opt.value === formData.closeCriteria);
        return new IndexPath(criteriaIndex >= 0 ? criteriaIndex : 0);
    };

    const getTiebreakIndex = () => {
        const tiebreakIndex = tiebreakOptions.findIndex(opt => opt.value === formData.tiebreakMethod);
        return new IndexPath(tiebreakIndex >= 0 ? tiebreakIndex : 0);
    };

    const handleCreate = async () => {
        const pollData = await preparePollData(planId);
        if (!pollData) return;

        onCreatePoll(pollData);
        resetForm();
        onClose();
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    const handleConfirmDate = (selectedDate: Date) => {
        updateField('closeDate', selectedDate);
        setIsDatePickerVisible(false);
    };

    const isFormValid = () => {
        const validOptions = formData.options.filter(opt => opt.trim() !== '');
        return formData.question.trim().length > 0 && validOptions.length >= 2;
    };

    return (
        <>
            <CreationModal
                visible={visible}
                onSubmit={handleCreate}
                onClose={onClose}
                onCancel={handleCancel}
                title="Nueva Encuesta"
                confirmText="Crear Encuesta"
                confirmDisabled={!isFormValid()}
            >
                <Input
                    label="Pregunta *"
                    placeholder="¿Qué hora prefieres?"
                    value={formData.question}
                    onChangeText={(text) => updateField('question', text)}
                    style={{ marginBottom: 16 }}
                    multiline
                />

                <Input
                    label="Descripción (opcional)"
                    placeholder="Agrega más contexto..."
                    value={formData.description}
                    onChangeText={(text) => updateField('description', text)}
                    style={{ marginBottom: 16 }}
                    multiline
                    numberOfLines={3}
                />

                <CheckBox
                    checked={formData.allowMultiple}
                    onChange={(checked) => updateField('allowMultiple', checked)}
                    style={{ marginBottom: 16 }}
                >
                    Permitir múltiples opciones
                </CheckBox>

                {/* Poll Options */}
                <Text category="s1" style={{ color: colors.text, marginBottom: 8 }}>
                    Opciones * (mínimo 2)
                </Text>
                {formData.options.map((option, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'center' }}>
                        <Input
                            placeholder={`Opción ${index + 1}`}
                            value={option}
                            onChangeText={(value) => updateOption(index, value)}
                            style={{ flex: 1 }}
                        />
                        {formData.options.length > 2 && (
                            <TouchableOpacity
                                onPress={() => removeOption(index)}
                                style={{ marginLeft: 8, padding: 8 }}
                            >
                                <Icon name="trash-2-outline" pack="eva" fill={colors.error} style={{ width: 24, height: 24 }} />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                {formData.options.length < 5 && (
                    <TouchableOpacity
                        onPress={addOption}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: 8,
                            marginBottom: 16
                        }}
                    >
                        <Icon name="plus-circle-outline" pack="eva" fill={colors.primary} style={{ width: 24, height: 24 }} />
                        <Text style={{ color: colors.primary, marginLeft: 8 }}>
                            Agregar opción (máx. 5)
                        </Text>
                    </TouchableOpacity>
                )}

                <Text category="s1" style={{ color: colors.text, marginBottom: 8, marginTop: 8 }}>
                    Criterio de cierre
                </Text>
                <Select
                    selectedIndex={getCloseCriteriaIndex()}
                    onSelect={(index) => {
                        const selectedIndex = index as IndexPath;
                        updateField('closeCriteria', closeCriteriaOptions[selectedIndex.row].value);
                    }}
                    value={closeCriteriaOptions[getCloseCriteriaIndex().row].label}
                    style={{ marginBottom: 16 }}
                >
                    {closeCriteriaOptions.map((option) => (
                        <SelectItem key={option.value} title={option.label} />
                    ))}
                </Select>

                {formData.closeCriteria === 'deadline' && (
                    <Input
                        label="Fecha y hora de cierre *"
                        value={formData.closeDate ? formatSimpleDateHour(formData.closeDate) : 'Seleccionar fecha'}
                        placeholder="Selecciona fecha y hora"
                        editable={false}
                        onPressIn={() => setIsDatePickerVisible(true)}
                        style={{ marginBottom: 16 }}
                        accessoryRight={(props) => <Icon {...props} name="calendar-outline" pack="eva" />}
                    />
                )}

                {formData.closeCriteria === 'quorum' && (
                    <Input
                        label="Número de votos para cerrar *"
                        placeholder="Ej: 8"
                        value={formData.quorumCount}
                        onChangeText={(text) => updateField('quorumCount', text)}
                        keyboardType="numeric"
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Text category="s1" style={{ color: colors.text, marginBottom: 8, marginTop: 8 }}>
                    Método de desempate
                </Text>
                <Select
                    selectedIndex={getTiebreakIndex()}
                    onSelect={(index) => {
                        const selectedIndex = index as IndexPath;
                        updateField('tiebreakMethod', tiebreakOptions[selectedIndex.row].value);
                    }}
                    value={tiebreakOptions[getTiebreakIndex().row].label}
                    style={{ marginBottom: 16 }}
                >
                    {tiebreakOptions.map((option) => (
                        <SelectItem key={option.value} title={option.label} />
                    ))}
                </Select>
            </CreationModal>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirmDate}
                onCancel={() => setIsDatePickerVisible(false)}
                minimumDate={new Date()}
                date={formData.closeDate || new Date()}
            />
        </>
    );
}
