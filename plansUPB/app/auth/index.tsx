import React from 'react';
import { Redirect } from 'expo-router';

export default function AuthRedirect() {
    return <Redirect href="/auth/login" />;
}
