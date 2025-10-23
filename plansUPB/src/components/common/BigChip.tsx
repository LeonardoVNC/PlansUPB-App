import { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "@ui-kitten/components";

interface BigChipProps {
    icon: ReactNode,
    color: string,
    text: string
}

function BigChip({ icon, color, text }: BigChipProps) {
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: color + '20',
                alignItems: 'center',
                marginBottom: 8,
                paddingVertical: 4,
                gap: 8,
                borderRadius: 12,
                overflow: 'hidden',
            }}
        >
            {icon}
            <Text
                category="h6"
                style={{
                    color: color,
                    fontSize: 18,
                }}
            >
                {text}
            </Text>
        </View>
    );
}

export default BigChip;