import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { globalStyles } from '@styles/globals';
import ScreenTemplate from '@common_components/ScreenTemplate';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loading, error } = useAuth();
  const styles = globalStyles();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<'error' | 'success'>('error');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setMessageTone('error');
      setMessage('Por favor completa todos los campos');
      return;
    }

    try {
      setMessage(null);
      await signIn(email, password);
      router.replace('/(drawer)/home');
    } catch (e: any) {
      setMessageTone('error');
      setMessage(e?.message ?? 'No se pudo iniciar sesión.');
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const goToSignUp = () => {
    if (loading) return;
    router.push('/auth/register');
  };

  return (
    <ScreenTemplate>
      <View style={styles.app_center_container}>
        <Text style={styles.app_title}>Iniciar Sesión</Text>

          <View style={{ width: '100%', gap: 16 }}>
            <View>
              <Text style={styles.app_label}>Email</Text>
              <View style={styles.app_input_wrapper}>
                <Ionicons name="mail-outline" size={20} color="#0066CC" />
                <TextInput
                  style={styles.app_input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="tu-email@upb.edu"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                />
              </View>
            </View>

            <View>
              <Text style={styles.app_label}>Contraseña</Text>
              <View style={styles.app_input_wrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#0066CC" />
                <TextInput
                  style={styles.app_input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor="#999"
                  secureTextEntry={secureEntry}
                  textContentType="password"
                />
                <Pressable onPress={() => setSecureEntry((prev) => !prev)} hitSlop={8}>
                  <Ionicons
                    name={secureEntry ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#0066CC"
                  />
                </Pressable>
              </View>
            </View>

            {message && (
              <Text
                style={[
                  styles.app_feedback,
                  messageTone === 'error'
                    ? styles.app_feedback_error
                    : styles.app_feedback_success
                ]}
              >
                {message}
              </Text>
            )}

            <Pressable onPress={handleForgotPassword}>
              <Text style={styles.app_link}>¿Olvidaste tu contraseña?</Text>
            </Pressable>

            <TouchableOpacity
              style={[styles.app_button, loading && styles.app_button_disabled]}
              onPress={handleLogin}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.app_buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            <View style={styles.app_footer_row}>
              <Text style={styles.app_footer_text}>¿No tienes cuenta?</Text>
              <Pressable onPress={goToSignUp}>
                <Text style={styles.app_link}> Regístrate</Text>
              </Pressable>
            </View>
          </View>
        </View>
    </ScreenTemplate>
  );
}
