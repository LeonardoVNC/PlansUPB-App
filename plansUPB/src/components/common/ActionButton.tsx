import { TouchableOpacity, View } from 'react-native';
import { Text } from '@ui-kitten/components';
import { useThemeColors } from "@hooks/useThemeColors";
import { Action } from '@interfaces/action.interface';

function ActionButton({ action }: { action: Action }) {
    const { colors } = useThemeColors();

    return (
        <View style={{ alignItems: 'center', width: 60 }}>
            <TouchableOpacity
                onPress={action.action}
                style={{
                    backgroundColor: colors.primary,
                    borderRadius: 12,
                    padding: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    aspectRatio: 1,
                }}
            >
                <View style={{ alignItems: 'center' }}>
                    {action.icon}
                </View>
            </TouchableOpacity>

            <Text style={{ color: colors.text, marginTop: 8, textAlign: 'center', fontSize: 12 }}>
                {action.name}
            </Text>
        </View>
    );
}

export default ActionButton;