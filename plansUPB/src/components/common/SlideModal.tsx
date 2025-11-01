import { ReactNode } from "react";
import { Modal, ScrollView, View } from "react-native";
import { Card } from "@ui-kitten/components";

interface ActionsProps {
    visible: boolean,
    onClose: () => void,
    children: ReactNode,
}

function SlideModal({ visible, onClose, children }: ActionsProps) {
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
                <Card
                    style={{
                        maxHeight: '60%',
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12
                    }}
                    disabled
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {children}
                    </ScrollView>
                </Card>
            </View>
        </Modal >
    );
}

export default SlideModal;