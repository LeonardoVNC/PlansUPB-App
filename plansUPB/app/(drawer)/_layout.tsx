import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { useThemeColors } from '../src/hooks/useThemeColors';

const DrawerLayout = () => {
  const { colors } = useThemeColors();

  return (
    <Drawer
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        drawerContentStyle: { backgroundColor: colors.drawerBackground },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.muted,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'PlansUPB',
          drawerLabel: 'Página Principal',
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
