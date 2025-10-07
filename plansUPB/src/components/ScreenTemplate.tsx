import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Text } from '@ui-kitten/components';
import { globalStyles } from '../styles/globals';
import { useThemeColors } from '../hooks/useThemeColors';

interface TemplateProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

function ScreenTemplate({ title, subtitle, children }: TemplateProps) {
    const { theme } = useThemeColors();

    const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';

    return (
        <SafeAreaView style={globalStyles().safeArea}>
            <StatusBar barStyle={barStyle} />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={globalStyles().app_scroll}
                bounces={true}
                keyboardShouldPersistTaps="handled"
            >
                <>
                    <Text category="h4" style={{ marginBottom: 8 }}>
                        {title}
                    </Text>
                    <Text style={[globalStyles().app_subtitle, { marginBottom: 16 }]}>
                        {subtitle}
                    </Text>
                    {children}
                </>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ScreenTemplate;
