import { ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Button, Text, Icon, Divider } from '@ui-kitten/components';
import { useThemeColors } from '@hooks/useThemeColors';
import SlideModal from './SlideModal';

interface CreationModalProps {
    visible: boolean;
    onSubmit: () => void;
    onClose: () => void;
    onCancel: () => void;
    title: string;
    confirmText?: string;
    cancelText?: string;
    confirmDisabled?: boolean;
    cancelDisabled?: boolean;
    children: ReactNode;
}

function CreationModal({
    visible,
    onSubmit,
    onClose,
    onCancel,
    title,
    confirmText = "Guardar",
    cancelText = "Cancelar",
    confirmDisabled,
    cancelDisabled,
    children
}: CreationModalProps) {

    const { colors } = useThemeColors();

    return (
        <SlideModal
            visible={visible}
            onClose={onClose}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text category="h5" style={{ color: colors.text }}>
                    {title}
                </Text>
                <TouchableOpacity onPress={onCancel}>
                    <Icon name="close" pack="eva" fill={colors.muted} style={{ width: 28, height: 28 }} />
                </TouchableOpacity>
            </View>

            <Divider style={{ marginBottom: 16, backgroundColor: colors.border }} />

            {children}

            <Divider style={{ marginVertical: 16, backgroundColor: colors.border }} />

            <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button
                    style={{ flex: 1 }}
                    status="basic"
                    onPress={onCancel}
                    disabled={cancelDisabled}
                >
                    {cancelText}
                </Button>
                <Button
                    style={{ flex: 1 }}
                    status="primary"
                    onPress={onSubmit}
                    disabled={confirmDisabled}
                >
                    {confirmText}
                </Button>
            </View>
        </SlideModal>
    );
}

export default CreationModal;