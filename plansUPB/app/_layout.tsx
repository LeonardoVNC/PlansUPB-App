import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import { useThemeStore } from '../src/store/useThemeStore';
import { mappingLight, mappingDark } from '../src/styles/mappings';

const getEvaTheme = (theme: 'light' | 'dark') => {
  const base = theme === 'dark' ? eva.dark : eva.light;
  const customMapping = theme === 'dark' ? mappingDark : mappingLight;
  return { ...base, ...customMapping };
};

export default function RootLayout() {
  const { theme } = useThemeStore();
  const evaTheme = getEvaTheme(theme);

  const statusBarStyle = theme === 'dark' ? 'light' : 'dark';

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={evaTheme}>
        <SafeAreaProvider>
          <StatusBar style={statusBarStyle} />
          <Stack>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </ApplicationProvider>
    </>
  );
}
