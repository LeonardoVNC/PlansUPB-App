import React from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Animated } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useThemeColors } from '@hooks/useThemeColors';
import { POST_CATEGORIES, PostCategory } from '@interfaces/post.interfaces';
import { Ionicons } from '@expo/vector-icons';

interface PostFiltersProps {
    searchQuery: string;
    selectedCategories: PostCategory[];
    onSearchChange: (query: string) => void;
    onToggleCategory: (category: PostCategory) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
    totalPosts: number;
    filteredCount: number;
    isVisible: boolean;
}

export default function PostFilters({
    searchQuery,
    selectedCategories,
    onSearchChange,
    onToggleCategory,
    onClearFilters,
    hasActiveFilters,
    totalPosts,
    filteredCount,
    isVisible
}: PostFiltersProps) {
    const { colors } = useThemeColors();

    if (!isVisible) return null;

    return (
        <View style={{ 
            backgroundColor: colors.surface, 
            paddingVertical: 12,
            paddingHorizontal: 16, 
            marginBottom: 12,
        }}>
            {/* Barra de búsqueda */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.background,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: colors.border,
            }}>
                <Ionicons name="search-outline" size={20} color={colors.subtitle} style={{ marginRight: 8 }} />
                <TextInput
                    placeholder="Buscar en publicaciones..."
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    style={{ flex: 1, color: colors.text, fontSize: 16 }}
                    placeholderTextColor={colors.subtitle}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => onSearchChange('')}>
                        <Ionicons name="close-circle" size={20} color={colors.subtitle} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Tags de categorías */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
            >
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    {POST_CATEGORIES.map((category) => {
                        const isSelected = selectedCategories.includes(category);
                        const isDisabled = !isSelected && selectedCategories.length >= 2;
                        
                        return (
                            <TouchableOpacity
                                key={category}
                                onPress={() => onToggleCategory(category)}
                                disabled={isDisabled}
                                style={{
                                    paddingHorizontal: 16,
                                    paddingVertical: 8,
                                    borderRadius: 20,
                                    backgroundColor: isSelected ? colors.primary : colors.background,
                                    borderWidth: 1,
                                    borderColor: isSelected ? colors.primary : colors.border,
                                    opacity: isDisabled ? 0.5 : 1,
                                }}
                            >
                                <Text 
                                    category="c1" 
                                    style={{ 
                                        color: isSelected ? colors.contrastText : colors.text,
                                        fontWeight: isSelected ? '600' : 'normal'
                                    }}
                                >
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Información y botón limpiar */}
            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: 12
            }}>
                <Text category="c1" style={{ color: colors.subtitle }}>
                    {hasActiveFilters 
                        ? `${filteredCount} de ${totalPosts} publicaciones`
                        : `${totalPosts} publicaciones`
                    }
                </Text>
                
                {hasActiveFilters && (
                    <TouchableOpacity
                        onPress={onClearFilters}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 8,
                            backgroundColor: colors.background,
                            borderWidth: 1,
                            borderColor: colors.border,
                        }}
                    >
                        <Ionicons name="close-outline" size={16} color={colors.subtitle} style={{ marginRight: 4 }} />
                        <Text category="c1" style={{ color: colors.subtitle }}>
                            Limpiar
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
