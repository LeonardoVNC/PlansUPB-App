import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, View, TouchableOpacity } from 'react-native';
import { Card, Input, Button, Text, Icon, Divider } from '@ui-kitten/components';
import { useThemeColors } from '../../../../../src/hooks/useThemeColors';
import { Plan } from '../../../../../src/interfaces/plans.interfaces';
import { useUserStore } from '../../../../../src/store/useUserStore';
import usePlans from '../../../../../src/hooks/usePlans';

interface CreatePlanModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function CreatePlanModal({ visible, onClose }: CreatePlanModalProps) {
    const { user } = useUserStore();
    const { createPlan } = usePlans();
    const { colors } = useThemeColors();
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
                                Proponer un plan
                            </Text>
                            <TouchableOpacity onPress={handleCancel}>
                                <Icon name="close" pack="eva" fill={colors.muted} style={{ width: 28, height: 28 }} />
                            </TouchableOpacity>
                        </View>

                        <Divider style={{ marginBottom: 16, backgroundColor: colors.border }} />

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
                                onPress={handleSubmit}
                                disabled={!isValidInfo}
                            >
                                Crear Plan
                            </Button>
                        </View>
                    </ScrollView>
                </Card>
            </View>
        </Modal>
    );
}
