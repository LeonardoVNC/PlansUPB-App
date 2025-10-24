import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthContext } from '@context/AuthContext';

export default function RootRedirect() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(drawer)/home" />;
  } else {
    return <Redirect href="/auth" />;
  }
}
