import { View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useThemeColors } from '@hooks/useThemeColors';

function Chip({ text }: { text: string }) {
    const { colors } = useThemeColors();

    return (
        <View style={{
            backgroundColor: colors.primary + '20',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            alignSelf: 'flex-start',
            marginBottom: 8
        }}>
            <Text category="c2" style={{ color: colors.primary, fontWeight: 'bold' }}>
                {text}
            </Text>
        </View>
    );
}

export default Chip;