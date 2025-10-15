import React from 'react';
import { View } from 'react-native';
import { Input, Select, SelectItem, Text, Button, Icon, IndexPath } from '@ui-kitten/components';
import { useThemeColors } from '@hooks/useThemeColors';
import { POST_CATEGORIES, PostCategory } from '@interfaces/post.interfaces';

interface PostFiltersProps {
    searchQuery: string;
    selectedCategory: PostCategory | 'Todas';
    onSearchChange: (query: string) => void;
    onCategoryChange: (category: PostCategory | 'Todas') => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
    totalPosts: number;
    filteredCount: number;
}

export default function PostFilters({
    searchQuery,
    selectedCategory,
    onSearchChange,
    onCategoryChange,
    onClearFilters,
    hasActiveFilters,
    totalPosts,
    filteredCount
}: PostFiltersProps) {
    const { colors } = useThemeColors();

    const categories = ['Todas', ...POST_CATEGORIES];
    const selectedIndex = new IndexPath(categories.indexOf(selectedCategory));

    const SearchIcon = (props: any) => (
        <Icon {...props} name="search-outline" />
    );

    const FilterIcon = (props: any) => (
        <Icon {...props} name="funnel-outline" />
    );

    const CloseIcon = (props: any) => (
        <Icon {...props} name="close-outline" />
    );

    return (
        <View style={{ 
            backgroundColor: colors.surface, 
            padding: 16, 
            borderRadius: 12, 
            marginBottom: 16,
            marginHorizontal: 16,
            borderWidth: 1,
            borderColor: colors.border,
        }}>
            <Input
                placeholder="Buscar en publicaciones..."
                value={searchQuery}
                onChangeText={onSearchChange}
                accessoryLeft={SearchIcon}
                style={{ marginBottom: 12 }}
                size="medium"
            />

            <Select
                placeholder="Filtrar por categoría"
                value={selectedCategory}
                selectedIndex={selectedIndex}
                onSelect={(index) => {
                    const selectedIndex = Array.isArray(index) ? index[0] : index;
                    onCategoryChange(categories[selectedIndex.row] as PostCategory | 'Todas');
                }}
                accessoryLeft={FilterIcon}
                style={{ marginBottom: 12 }}
                size="medium"
            >
                {categories.map((category, index) => (
                    <SelectItem key={index} title={category} />
                ))}
            </Select>

            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
            }}>
                <Text category="c1" style={{ color: colors.subtitle }}>
                    {hasActiveFilters 
                        ? `${filteredCount} de ${totalPosts} publicaciones`
                        : `${totalPosts} publicaciones`
                    }
                </Text>
                
                {hasActiveFilters && (
                    <Button
                        size="tiny"
                        status="basic"
                        accessoryLeft={CloseIcon}
                        onPress={onClearFilters}
                    >
                        Limpiar
                    </Button>
                )}
            </View>
        </View>
    );
}