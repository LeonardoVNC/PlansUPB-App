import { View } from "react-native";
import { Card, Icon, Layout, Text } from "@ui-kitten/components";
import { useThemeColors } from "@hooks/useThemeColors";
import { User } from "@interfaces/user.interfaces";

function PlanOwnerCard({ owner }: { owner: User }) {
    const { colors } = useThemeColors();

    return (
        <Card style={{ marginBottom: 20, padding: 16 }} status="basic" disabled>
            <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Icon name="person-outline" pack="eva" fill={colors.primary} style={{ width: 32, height: 32 }} />
                <View style={{ flex: 1 }}>
                    <Text category="s1" style={{ color: colors.text, fontWeight: 'bold', marginBottom: 4 }}>
                        Organizador:
                    </Text>
                    <Text category="p1" style={{ color: colors.primary, fontSize: 16 }}>
                        {owner.name}
                    </Text>
                    <Text category="p1" style={{ color: colors.primary, fontSize: 10 }}>
                        {owner.username}
                    </Text>
                </View>
            </Layout>
        </Card>
    );
}

export default PlanOwnerCard;