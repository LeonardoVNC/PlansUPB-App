import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StatusBar, View, ActivityIndicator } from 'react-native';
import { Text } from '@ui-kitten/components';
import { globalStyles } from '@styles/globals';
import { useThemeColors } from '@hooks/useThemeColors';

interface TemplateProps {
    children: ReactNode;
    omitScroll?: boolean;
    floatingButton?: ReactNode;
    loading?: boolean;
    loadingMessage?: string;
}

function ScreenTemplate({ children, omitScroll = false, floatingButton, loading = false, loadingMessage = "Espere por favor" }: TemplateProps) {
    const { theme, colors } = useThemeColors();

    const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';

    const container = globalStyles().app_container
    const centerContainer = globalStyles().app_center_container
    const appScroll = globalStyles().app_scroll

    return (
        <SafeAreaView style={globalStyles().safeArea}>
            <StatusBar barStyle={barStyle} />
            {loading ? (
                <View style={centerContainer}>
                    {/* Quizá aqui podriamos agregar animaciones */}
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 18 }}>{loadingMessage}</Text>
                </View>
            ) : (
                <>
                    {omitScroll ? (
                        <View style={container}>
                            {children}
                        </View>
                    ) : (
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={appScroll}
                            bounces={true}
                            keyboardShouldPersistTaps="handled"
                        >
                            {children}
                        </ScrollView>
                    )}

                    {floatingButton}
                </>
            )}
        </SafeAreaView>
    );
}

export default ScreenTemplate;
