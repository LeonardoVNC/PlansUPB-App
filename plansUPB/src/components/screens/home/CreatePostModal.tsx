import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Input, Button, Text, Icon, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { useCreatePost } from '@hooks/useCreatePost';
import { useThemeColors } from '@hooks/useThemeColors';
import { useUserStore } from '@store/useUserStore';
import SlideModal from '@common_components/SlideModal';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary, validateCloudinaryConfig } from '@services/cloudinary.service';

interface CreatePostModalProps {
    visible: boolean;
    onClose: () => void;
    onCreatePost: (post: any) => void;
}

export default function CreatePostModal({ visible, onClose, onCreatePost }: CreatePostModalProps) {
    const { colors } = useThemeColors();
    const { user } = useUserStore();
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    
    const {
        formData,
        updateField,
        preparePostData,
        resetForm,
        categories
    } = useCreatePost();

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert(
                    'Permisos necesarios',
                    'Necesitamos acceso a tu galería para subir imágenes'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
    };

    const handleCreate = async () => {
        if (!user) {
            Alert.alert('Error', 'Debes iniciar sesión para crear una publicación');
            return;
        }

        try {
            setUploading(true);

            let uploadedImageUrl: string | undefined = undefined;

            if (selectedImage) {
                if (!validateCloudinaryConfig()) {
                    Alert.alert(
                        'Configuración incompleta',
                        'Cloudinary no está configurado. La imagen no se subirá.'
                    );
                } else {
                    uploadedImageUrl = await uploadImageToCloudinary(selectedImage, 'posts');
                }
            }

            const postData = await preparePostData(user.code, user.name, uploadedImageUrl);
            if (!postData) {
                setUploading(false);
                return;
            }

            onCreatePost(postData);
            handleCancel();
        } catch (error) {
            console.error('Error creating post:', error);
            Alert.alert('Error', 'No se pudo crear la publicación');
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        resetForm();
        setSelectedImage(null);
        setUploading(false);
        onClose();
    };

    const isFormValid = formData.content.trim().length > 0 && formData.category.length > 0;

    const getCategoryIndex = () => {
        const index = categories.findIndex(cat => cat === formData.category);
        return new IndexPath(index >= 0 ? index : 0);
    };

    return (
        <SlideModal
            visible={visible}
            onClose={handleCancel}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text category="h6" style={{ marginBottom: 16, color: colors.text }}>
                    Nueva Publicación
                </Text>

                <Input
                    label="Contenido *"
                    placeholder="¿Qué quieres compartir?"
                    value={formData.content}
                    onChangeText={(text) => updateField('content', text)}
                    style={{ marginBottom: 16 }}
                    multiline
                    numberOfLines={6}
                    textStyle={{ minHeight: 120 }}
                    disabled={uploading}
                />

                <Text category="label" style={{ color: colors.text, marginBottom: 8 }}>
                    Categoría *
                </Text>
                <Select
                    selectedIndex={getCategoryIndex()}
                    value={formData.category || 'Seleccionar categoría'}
                    onSelect={(index) => {
                        const selectedIndex = index as IndexPath;
                        updateField('category', categories[selectedIndex.row]);
                    }}
                    disabled={uploading}
                    style={{ marginBottom: 16 }}
                >
                    {categories.map((category) => (
                        <SelectItem key={category} title={category} />
                    ))}
                </Select>

                <Text category="label" style={{ color: colors.text, marginBottom: 8 }}>
                    Imagen (opcional)
                </Text>

                {selectedImage ? (
                    <View style={{ marginBottom: 16 }}>
                        <Image 
                            source={{ uri: selectedImage }}
                            style={{ 
                                width: '100%', 
                                height: 200, 
                                borderRadius: 12,
                                backgroundColor: colors.border 
                            }}
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            onPress={removeImage}
                            disabled={uploading}
                            style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: colors.danger + 'CC',
                                borderRadius: 20,
                                padding: 8
                            }}
                        >
                            <Icon name="trash-2" pack="eva" fill="#FFFFFF" style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Button
                        appearance="outline"
                        status="info"
                        onPress={pickImage}
                        disabled={uploading}
                        accessoryLeft={(props) => <Icon {...props} name="image" pack="eva" />}
                        style={{ marginBottom: 16 }}
                    >
                        Seleccionar imagen
                    </Button>
                )}

                {uploading && (
                    <View style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: 12,
                        backgroundColor: colors.primary + '20',
                        borderRadius: 8,
                        marginBottom: 16
                    }}>
                        <ActivityIndicator size="small" color={colors.primary} />
                        <Text category="p2" style={{ color: colors.primary, marginLeft: 8 }}>
                            Subiendo imagen...
                        </Text>
                    </View>
                )}

                <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                    <Button
                        style={{ flex: 1 }}
                        appearance="outline"
                        onPress={handleCancel}
                        disabled={uploading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        style={{ flex: 1 }}
                        onPress={handleCreate}
                        disabled={!isFormValid || uploading}
                    >
                        {uploading ? 'Publicando...' : 'Publicar'}
                    </Button>
                </View>
            </ScrollView>
        </SlideModal>
    );
}
