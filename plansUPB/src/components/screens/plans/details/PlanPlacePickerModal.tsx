import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Layout, Input, Button } from '@ui-kitten/components';
import CreationModal from '@common_components/CreationModal';

interface PlacePickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (place: { name: string; lat: number; lng: number }) => void;
    initialPlace?: { name: string; lat: number; lng: number };
}

export default function PlacePickerModal({ visible, onClose, onSave, initialPlace }: PlacePickerModalProps) {
    const [location, setLocation] = useState({
        latitude: initialPlace?.lat || 7.137146,
        longitude: initialPlace?.lng || -73.122742,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
    })
    const [placeName, setPlaceName] = useState(initialPlace?.name || '')
    const [isValidInfo, setIsValidInfo] = useState(false)

    useEffect(() => {
        setIsValidInfo(placeName.trim().length > 0)
    }, [placeName])

    useEffect(() => {
        if (visible) {
            getCurrentLocation();
        }
    }, [visible]);

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Necesitamos acceso a tu ubicación');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLocation(prev => ({
                ...prev,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }));
        } catch (err) {
            Alert.alert('Error', 'No se pudo obtener tu ubicación');
        }
    };

    const handleMapPress = (e: any) => {
        e.persist();
        setLocation(prev => ({
            ...prev,
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
        }));
    };

    const handleSubmit = () => {
        onSave({
            name: placeName.trim(),
            lat: location.latitude,
            lng: location.longitude,
        });
        onClose();
    };

    return (
        <CreationModal
            visible={visible}
            onSubmit={handleSubmit}
            onClose={onClose}
            onCancel={onClose}
            title="Seleccionar ubicación"
            confirmText="Guardar ubicación"
            confirmDisabled={!isValidInfo}
        >
            <Layout style={{ gap: 16 }}>
                <MapView
                    style={styles.map}
                    region={location}
                    onPress={handleMapPress}
                >
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        draggable
                        onDragEnd={handleMapPress}
                    />
                </MapView>

                <Input
                    label="Nombre del lugar"
                    placeholder="Ej: Plaza España"
                    value={placeName}
                    onChangeText={setPlaceName}
                    style={{ marginVertical: 8, }}
                    status={placeName.trim() ? 'success' : 'basic'}
                    accessoryLeft={<Ionicons name="location" size={20} />}
                />

                <Button
                    status="info"
                    onPress={getCurrentLocation}
                    accessoryLeft={<Ionicons name="locate" size={20} color="white" />}
                >
                    Usar mi ubicación actual
                </Button>
            </Layout>
        </CreationModal>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: Dimensions.get('window').height * 0.3,
        borderRadius: 8,
    }
});