import React from 'react';
import { Modal, ScrollView, View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Card, Input, Button, Text, CheckBox, Icon, Divider } from '@ui-kitten/components';
import { useCreatePoll } from '@hooks/useCreatePoll';
import { useThemeColors } from '@hooks/useThemeColors';
import { useUserStore } from '@store/useUserStore';

interface CreatePollModalProps {
    visible: boolean;
    onClose: () => void;
    onCreatePoll: (poll: any) => void;
}

export default function CreatePollModal({ visible, onClose, onCreatePoll }: CreatePollModalProps) {
    const { colors } = useThemeColors();
    const { user } = useUserStore();

    const {
        formData,
        updateField,
        addOption,
        removeOption,
        updateOption,
        preparePollData,
        resetForm
    } = useCreatePoll();

    const handleCreate = async () => {
        if (!user) {
            alert('Debes iniciar sesión para crear una encuesta');
            return;
        }
        
        const pollData = await preparePollData(user.code);
        if (!pollData) return;

        onCreatePoll(pollData);
        resetForm();
        onClose();
    };

    const handleCancel = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                padding: 16
            }}>
                <Card style={{ maxHeight: '90%', borderRadius: 16 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text category="h5" style={{ color: colors.text }}>
                                Nueva Encuesta
                            </Text>
                            <TouchableOpacity onPress={handleCancel}>
                                <Icon name="close" pack="eva" fill={colors.muted} style={{ width: 28, height: 28 }} />
                            </TouchableOpacity>
                        </View>

                        <Divider style={{ marginBottom: 16, backgroundColor: colors.border }} />

                        <Input
                            label="Pregunta *"
                            placeholder="¿Cual es la mejor carrera 🗿🔥?"
                            value={formData.question}
                            onChangeText={(text) => updateField('question', text)}
                            style={{ marginBottom: 16 }}
                            multiline
                        />

                        <Input
                            label="Descripción (opcional)"
                            placeholder="Agrega más contexto a tu encuesta..."
                            value={formData.description}
                            onChangeText={(text) => updateField('description', text)}
                            style={{ marginBottom: 16 }}
                            multiline
                            numberOfLines={3}
                        />

                        <Text category="s1" style={{ color: colors.text, marginBottom: 8 }}>
                            Opciones *
                        </Text>
                        {formData.options.map((option, index) => (
                            <View key={index} style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'center' }}>
                                <Input
                                    placeholder={`Opción ${index + 1}`}
                                    value={option}
                                    onChangeText={(value) => updateOption(index, value)}
                                    style={{ flex: 1, marginRight: 8 }}
                                />
                                {formData.options.length > 2 && (
                                    <TouchableOpacity onPress={() => removeOption(index)}>
                                        <Icon name="trash-2" pack="eva" fill={colors.danger} style={{ width: 24, height: 24 }} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}

                        <Button
                            size="small"
                            appearance="ghost"
                            status="primary"
                            onPress={addOption}
                            style={{ marginBottom: 16, alignSelf: 'flex-start' }}
                            accessoryLeft={(props) => <Icon {...props} name="plus" pack="eva" />}
                        >
                            Agregar opción
                        </Button>

                        <Divider style={{ marginVertical: 16, backgroundColor: colors.border }} />

                        <Text category="s1" style={{ color: colors.text, marginBottom: 12 }}>
                            Configuración
                        </Text>

                        <CheckBox
                            checked={formData.allowMultiple}
                            onChange={(checked) => updateField('allowMultiple', checked)}
                            style={{ marginBottom: 12 }}
                        >
                            {(evaProps: StyleProp<ViewStyle>) => (
                                <View style={{ marginLeft: 8 }}>
                                    <Text category="p1" style={[{ color: colors.text }, evaProps]}>
                                        Permitir selección múltiple
                                    </Text>
                                    <Text category="c1" style={[{ color: colors.subtitle }, evaProps]}>
                                        Los usuarios pueden elegir varias opciones
                                    </Text>
                                </View>
                            )}
                        </CheckBox>

                        <CheckBox
                            checked={formData.hasCloseDate}
                            onChange={(checked) => updateField('hasCloseDate', checked)}
                            style={{ marginBottom: 12 }}
                        >
                            {(evaProps: StyleProp<ViewStyle>) => (
                                <View style={{ marginLeft: 8 }}>
                                    <Text category="p1" style={[{ color: colors.text }, evaProps]}>
                                        Establecer fecha de cierre
                                    </Text>
                                    <Text category="c1" style={[{ color: colors.subtitle }, evaProps]}>
                                        La encuesta se cerrará automáticamente
                                    </Text>
                                </View>
                            )}
                        </CheckBox>

                        {formData.hasCloseDate && (
                            <Input
                                label="Días para cerrar"
                                placeholder="7"
                                value={formData.closeDays}
                                onChangeText={(text) => updateField('closeDays', text)}
                                keyboardType="numeric"
                                disabled={!formData.hasCloseDate}
                                style={{ marginBottom: 16 }}
                            />
                        )}

                        <Divider style={{ marginVertical: 16, backgroundColor: colors.border }} />

                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <Button
                                style={{ flex: 1 }}
                                status="basic"
                                onPress={handleCancel}
                            >
                                Cancelar
                            </Button>
                            <Button
                                style={{ flex: 1 }}
                                status="primary"
                                onPress={handleCreate}
                            >
                                Crear Encuesta
                            </Button>
                        </View>
                    </ScrollView>
                </Card>
            </View>
        </Modal>
    );
}
