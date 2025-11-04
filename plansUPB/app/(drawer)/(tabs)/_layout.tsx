import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { useThemeColors } from '@hooks/useThemeColors';
import { useTabStore, TabName } from '@store/useTabStore';
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const tabConfig: Record<TabName, { title: string; icon: [IoniconName, IoniconName] }> = {
  home: { title: 'Discusiones', icon: ['chatbubbles-outline', 'chatbubbles'] },
  plans_general: { title: 'Planes', icon: ['calendar-outline', 'calendar'] },
  plans_self: { title: 'Mis Planes', icon: ['file-tray-outline', 'file-tray'] },
  plans_invs: { title: 'Invitaciones', icon: ['mail-outline', 'mail'] },
  plans_fav: { title: 'Guardados', icon: ['bookmarks-outline', 'bookmarks'] },
  maps: { title: 'Mapa', icon: ['map-outline', 'map'] },
};

const TabsLayout = () => {
  const { colors } = useThemeColors();
  const { order, hidden } = useTabStore();

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
        const hiddenNames = Object.entries(hidden || {})
          .filter(([_, isHidden]) => Boolean(isHidden))
          .map(([name]) => name);

        const baseRoutes = props.state.routes.filter(
          (route) => !['plans', 'votes'].includes(route.name)
        );

        let visibleRoutes = baseRoutes.filter(
          (route) => !hiddenNames.includes(route.name)
        );
        if (visibleRoutes.length === 0) visibleRoutes = baseRoutes;

        const visibleIndices = visibleRoutes.map(route =>
          props.state.routes.findIndex(r => r.key === route.key)
        );

        const visibleDescriptors = Object.fromEntries(
          Object.entries(props.descriptors).filter(([_, descriptor]) =>
            visibleIndices.includes(
              props.state.routes.findIndex(r => r.key === descriptor.route.key)
            )
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
      {order
        .filter((name) => !hidden?.[name])
        .map((name) => {
          const cfg = tabConfig[name];
          return (
            <Tabs.Screen
              key={name}
              name={name}
              options={{
                title: cfg.title,
                tabBarIcon: ({ color, focused, size }) => (
                  <Ionicons name={focused ? cfg.icon[1] : cfg.icon[0]} size={size} color={color} />
                ),
              }}
            />
          );
        })}

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