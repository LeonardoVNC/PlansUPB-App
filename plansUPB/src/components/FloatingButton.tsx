import { Button, Icon } from "@ui-kitten/components";
import { useThemeColors } from "../hooks/useThemeColors";

interface FloatingButtonProps {
    onPress: () => void;
    status?: string;
    size?: number;
    iconName: string;
    iconFill?: string;
}

function FloatingButton({ onPress, status = "primary", size = 56, iconName, iconFill = '#FFF' }: FloatingButtonProps) {
    const { colors } = useThemeColors();

    return (
        <Button
            onPress={onPress}
            status={status}
            style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                borderRadius: size / 2,
                width: size,
                height: size,
                elevation: 8,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                backgroundColor: colors.primary,
                borderWidth: 0,
            }}
            appearance="filled"
            accessoryLeft={(props) => (
                <Icon
                    {...props}
                    name={iconName}
                    pack="eva"
                    fill={iconFill}
                    style={{ width: 24, height: 24, alignSelf: 'center' }}
                />
            )}
        />
    );
}

export default FloatingButton;