import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { useThemeColors } from '@hooks/useThemeColors';

const TabsLayout = () => {
  const { colors } = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.border,
        },
      }}
      tabBar={(props) => {
        const visibleRoutes = props.state.routes.filter(
          (route) => !['plans', 'votes'].includes(route.name)
        );

        const visibleIndices = visibleRoutes.map(route =>
          props.state.routes.findIndex(r => r.key === route.key)
        );

        const visibleDescriptors = Object.fromEntries(
          Object.entries(props.descriptors).filter(([key, descriptor]) =>
            visibleIndices.includes(descriptor.route.key ? props.state.routes.findIndex(r => r.key === descriptor.route.key) : -1)
          )
        );

        const activeRouteKey = props.state.routes[props.state.index]?.key;
        const newIndex = visibleRoutes.findIndex(route => route.key === activeRouteKey);
        const finalIndex = Math.max(0, newIndex);

        return (
          <BottomTabBar
            {...props}
            state={{ ...props.state, routes: visibleRoutes, index: finalIndex }}
            descriptors={visibleDescriptors}
          />
        );
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Discusiones',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plans_general"
        options={{
          title: 'Planes',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plans_self"
        options={{
          title: 'Mis Planes',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'file-tray' : 'file-tray-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plans_invs"
        options={{
          title: 'Invitaciones',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'mail' : 'mail-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plans_fav"
        options={{
          title: 'Guardados',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'bookmarks' : 'bookmarks-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="plans"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="votes"
        options={{
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;