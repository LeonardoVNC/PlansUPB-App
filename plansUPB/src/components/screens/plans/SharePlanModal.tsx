import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Share } from 'react-native';
import { Text, Button, Icon, Input, Divider } from '@ui-kitten/components';
import * as Linking from 'expo-linking';
import { useThemeColors } from '@hooks/useThemeColors';
import { useUsers } from '@hooks/useUsers';
import { User } from '@interfaces/user.interfaces';
import CreationModal from '@common_components/CreationModal';

interface SharePlanModalProps {
    visible: boolean;
    onClose: () => void;
    onShare: (userCodes: string[]) => void;
    planId: string;
    planTitle: string;
}

export default function SharePlanModal({ visible, onClose, onShare, planId, planTitle }: SharePlanModalProps) {
    const { colors } = useThemeColors();
    const { availableUsers, loading } = useUsers();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = availableUsers.filter((user: User) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.code.includes(searchQuery)
    );

    const toggleUserSelection = (userCode: string) => {
        if (selectedUsers.includes(userCode)) {
            setSelectedUsers(selectedUsers.filter((code: string) => code !== userCode));
        } else {
            setSelectedUsers([...selectedUsers, userCode]);
        }
    };

    const handleShare = () => {
        if (selectedUsers.length > 0) {
            onShare(selectedUsers);
            setSelectedUsers([]);
            setSearchQuery('');
            onClose();
        }
    };

    const handleClose = () => {
        setSelectedUsers([]);
        setSearchQuery('');
        onClose();
    };

    const renderUser = ({ item }: { item: User }) => {
        const isSelected = selectedUsers.includes(item.code);

        return (
            <TouchableOpacity
                onPress={() => toggleUserSelection(item.code)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    backgroundColor: isSelected ? colors.primary + '20' : 'transparent',
                    borderRadius: 8,
                    marginBottom: 8,
                }}
            >
                {item.photoUrl ? (
                    <Image
                        source={{ uri: item.photoUrl }}
                        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                    />
                ) : (
                    <View
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: colors.primary,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 12,
                        }}
                    >
                        <Text category="h6" style={{ color: 'white' }}>
                            {item.name.charAt(0)}
                        </Text>
                    </View>
                )}

                <View style={{ flex: 1 }}>
                    <Text category="s1" style={{ color: colors.text }}>
                        {item.name}
                    </Text>
                    <Text category="c1" style={{ color: colors.subtitle }}>
                        @{item.username} • {item.career}
                    </Text>
                </View>

                {isSelected && (
                    <Icon
                        name="checkmark-circle-2"
                        pack="eva"
                        fill={colors.primary}
                        style={{ width: 24, height: 24 }}
                    />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <CreationModal
            visible={visible}
            onClose={handleClose}
            onCancel={handleClose}
            onSubmit={handleShare}
            title="Compartir Plan"
            confirmText={`Enviar (${selectedUsers.length})`}
            confirmDisabled={selectedUsers.length === 0}
        >
            <Text category="p2" style={{ color: colors.subtitle, marginBottom: 16 }}>
                {planTitle}
            </Text>

            {/* TODO: deep link
            <Button
                status="info"
                appearance="outline"
                onPress={handleShareAsLink}
                accessoryLeft={(props) => <Icon {...props} name="link-2" pack="eva" />}
                style={{ marginBottom: 16 }}
            >
                Compartir como Link
            </Button>

            <Divider style={{ marginBottom: 16, backgroundColor: colors.border }} />
            */}

            <Text category="s1" style={{ color: colors.text, marginBottom: 12 }}>
                Enviar a usuarios
            </Text>

            <Input
                placeholder="Buscar usuario..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                accessoryLeft={(props) => <Icon {...props} name="search" pack="eva" />}
                style={{ marginBottom: 12 }}
            />

            <Text category="c1" style={{ color: colors.subtitle, marginBottom: 8 }}>
                {selectedUsers.length} seleccionado{selectedUsers.length !== 1 ? 's' : ''}
            </Text>

            {loading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text category="c1" style={{ color: colors.subtitle }}>
                        Cargando usuarios...
                    </Text>
                </View>
            ) : (
                <ScrollView 
                    style={{ maxHeight: 250 }}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                >
                    {filteredUsers.map((user) => (
                        <View key={user.code}>
                            {renderUser({ item: user })}
                        </View>
                    ))}
                </ScrollView>
            )}
        </CreationModal>
    );
}
