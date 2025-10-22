import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@hooks/useThemeColors";
import { iconCategoryMap } from "@styles/planCategoryMap";
import { View } from "react-native";
import { Text } from "@ui-kitten/components";

function PlanCategory({ category }: { category: string }) {
    const { colors } = useThemeColors();

    const iconName = iconCategoryMap.get(category) || "book-outline";

    return (
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, justifyContent: 'center', marginBottom: 8 }}> 
            <Ionicons
                name={iconName as keyof typeof Ionicons.glyphMap}
                size={24}
                color={colors.subtitle}
            />
            <Text
                category="h6"
                style={{ color: colors.subtitle, textAlign: 'center' }}
            >
                {category}
            </Text>
        </View>
    );
}

export default PlanCategory;