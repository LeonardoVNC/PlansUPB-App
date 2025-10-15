import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { globalStyles } from '../styles/globals';
import { useThemeColors } from '../hooks/useThemeColors';

interface TemplateProps {
    children: ReactNode;
    omitScroll?: boolean;
    floatingButton?: ReactNode;
}

function ScreenTemplate({ children, omitScroll = false, floatingButton }: TemplateProps) {
    const { theme } = useThemeColors();

    const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';

    return (
        <SafeAreaView style={globalStyles().safeArea}>
            <StatusBar barStyle={barStyle} />
            {omitScroll ? (
                <>
                    {children}
                </>
            ) : (
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={globalStyles().app_scroll}
                    bounces={true}
                    keyboardShouldPersistTaps="handled"
                >
                    {children}
                </ScrollView>
            )}

            {floatingButton}
        </SafeAreaView>
    );
}

export default ScreenTemplate;
