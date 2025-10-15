import React from 'react';
import { Modal, ScrollView, View, TouchableOpacity } from 'react-native';
import { Card, Input, Button, Text, Icon, Divider } from '@ui-kitten/components';
import { useCreatePost } from '@hooks/useCreatePost';
import { useThemeColors } from '@hooks/useThemeColors';

interface CreatePostModalProps {
    visible: boolean;
    onClose: () => void;
    onCreatePost: (post: any) => void;
    userCode: string;
    userName: string;
}

export default function CreatePostModal({ visible, onClose, onCreatePost, userCode, userName }: CreatePostModalProps) {
    const { colors } = useThemeColors();
    
    const {
        formData,
        updateField,
        preparePostData,
        resetForm,
        categories
    } = useCreatePost();

    const handleCreate = async () => {
        const postData = await preparePostData(userCode, userName);
        if (!postData) return;
        
        onCreatePost(postData);
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
                                Nueva Publicación
                            </Text>
                            <TouchableOpacity onPress={handleCancel}>
                                <Icon name="close" pack="eva" fill={colors.muted} style={{ width: 28, height: 28 }} />
                            </TouchableOpacity>
                        </View>

                        <Divider style={{ marginBottom: 16, backgroundColor: colors.border }} />

                        <Input
                            label="Contenido *"
                            placeholder="¿Qué quieres compartir?"
                            value={formData.content}
                            onChangeText={(text) => updateField('content', text)}
                            style={{ marginBottom: 16 }}
                            multiline
                            numberOfLines={6}
                            textStyle={{ minHeight: 120 }}
                        />

                        <Text category="label" style={{ color: colors.text, marginBottom: 8 }}>
                            Categoría *
                        </Text>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            style={{ marginBottom: 16 }}
                        >
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category}
                                        onPress={() => updateField('category', category)}
                                        style={{
                                            paddingHorizontal: 16,
                                            paddingVertical: 8,
                                            borderRadius: 20,
                                            backgroundColor: formData.category === category 
                                                ? colors.primary 
                                                : colors.border,
                                            borderWidth: 1,
                                            borderColor: formData.category === category 
                                                ? colors.primary 
                                                : colors.border
                                        }}
                                    >
                                        <Text 
                                            category="c1" 
                                            style={{ 
                                                color: formData.category === category 
                                                    ? '#FFFFFF' 
                                                    : colors.text,
                                                fontWeight: formData.category === category ? 'bold' : 'normal'
                                            }}
                                        >
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <Input
                            label="URL de imagen (opcional)"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={formData.imageUrl || ''}
                            onChangeText={(text) => updateField('imageUrl', text)}
                            style={{ marginBottom: 16 }}
                            accessoryLeft={(props) => <Icon {...props} name="image" pack="eva" />}
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
                                onPress={handleCreate}
                            >
                                Publicar
                            </Button>
                        </View>
                    </ScrollView>
                </Card>
            </View>
        </Modal>
    );
}
