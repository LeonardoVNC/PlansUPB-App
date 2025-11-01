import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { Card, Divider, Icon, Text } from "@ui-kitten/components";
import { useThemeColors } from "@hooks/useThemeColors";
import { Action } from "@interfaces/action.interface";
import ActionButton from "./ActionButton";

interface ActionsProps {
    actions: Action[],
    title: string,
    visible: boolean,
    onClose: () => void,
}

function ActionsModal({ actions, title, visible, onClose }: ActionsProps) {
    const { colors } = useThemeColors();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'flex-end',
            }}>
                <Card style={{ maxHeight: '60%', borderRadius: 16 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text category="h5" style={{ color: colors.text }}>
                                {title}
                            </Text>
                            <TouchableOpacity onPress={onClose}>
                                <Icon name="close" pack="eva" fill={colors.muted} style={{ width: 28, height: 28 }} />
                            </TouchableOpacity>
                        </View>

                        <Divider style={{ marginBottom: 16, backgroundColor: colors.border }} />

                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            gap: 18,
                        }}>
                            {actions.map((action, index) => (
                                <ActionButton key={index} action={action} />
                            ))}
                        </View>
                    </ScrollView>
                </Card>
            </View>
        </Modal >
    );
}

export default ActionsModal;