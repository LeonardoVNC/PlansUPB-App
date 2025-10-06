import React, { ReactNode } from "react";
import { globalStyles } from "../styles/globals";
import { SafeAreaView, ScrollView, StatusBar, Text } from "react-native";
import { useThemeColors } from "../hooks/useThemeColors";

function ScreenTemplate({ title, subtitle, children }: { title: string, subtitle: string, children: ReactNode }) {
    const { theme } = useThemeColors();
    return (
        <SafeAreaView style={globalStyles().safeArea}>
            <StatusBar barStyle={theme == 'dark' ? "dark-content" : "light-content"} />
            <ScrollView contentContainerStyle={globalStyles().app_container}>
                <>
                    <Text style={globalStyles().app_title}>
                        {title}
                    </Text>
                    <Text style={globalStyles().app_subtitle}>
                        {subtitle}
                    </Text>
                    {children}
                </>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ScreenTemplate;