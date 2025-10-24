import { View } from "react-native";
import { Card, Icon, Layout, Text } from "@ui-kitten/components";
import { useThemeColors } from "@hooks/useThemeColors";
import { User } from "@interfaces/user.interfaces";
import { globalStyles } from "@styles/globals";
import { Image } from "react-native";

function PlanOwnerCard({ owner }: { owner: User }) {
    const { colors } = useThemeColors();

    return (
        <Card 
            style={globalStyles().app_card}
            status="primary" 
            disabled
        >
            <Layout style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {owner.photoUrl ? (
                    <Image
                        source={{ uri: owner.photoUrl }}
                        style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                ) : (
                    <Icon name="person-outline" pack="eva" fill={colors.primary} style={{ width: 36, height: 36 }} />
                )}
                <View style={{ flex: 1 }}>
                    <Text category="h6" style={{ color: colors.text, fontWeight: 'bold', marginBottom: 4 }}>
                        Organizador:
                    </Text>
                    <Text category="p1" style={{ color: colors.primary, fontSize: 16 }}>
                        {owner.name}
                    </Text>
                    <Text category="p1" style={{ color: colors.primary, fontSize: 10 }}>
                        @{owner.username}
                    </Text>
                    {owner.career && (
                        <Text category="p2" style={{ color: colors.subtitle, fontSize: 12, marginTop: 4 }}>
                            Carrera: {owner.career}
                        </Text>
                    )}
                </View>
            </Layout>
        </Card>
    );
}

export default PlanOwnerCard;