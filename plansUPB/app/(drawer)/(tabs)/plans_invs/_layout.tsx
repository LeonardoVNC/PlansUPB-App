import React from 'react';
import { Stack } from 'expo-router';

export default function InvPlansLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
