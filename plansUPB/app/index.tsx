import React from 'react';
import { Redirect } from 'expo-router';
import { useUserStore } from '../src/store/useUserStore';

export default function RootRedirect() {
  const { logged } = useUserStore();

  if (logged) {
    return <Redirect href="home" />;
  } else {
    return <Redirect href="auth" />;
  }
}
