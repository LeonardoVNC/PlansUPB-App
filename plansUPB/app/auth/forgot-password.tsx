import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { globalStyles } from '@styles/globals';
import ScreenTemplate from '@common_components/ScreenTemplate';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { sendPasswordReset, loading } = useAuth();
  const styles = globalStyles();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<'error' | 'success'>('error');

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setMessageTone('error');
      setMessage('Por favor ingresa tu email');
      return;
    }

    try {
      setMessage(null);
      await sendPasswordReset(email);
      setMessageTone('success');
      setMessage('Te enviamos un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.');
    } catch (error: any) {
      setMessageTone('error');
      setMessage(error?.message ?? 'No pudimos enviar el correo de recuperación.');
    }
  };

  const goToLogin = () => {
    router.back();
  };

  return (
    <ScreenTemplate>
      <View style={styles.app_center_container}>
        <Ionicons name="lock-open-outline" size={80} color="#0066CC" style={{ marginBottom: 24 }} />
        
        <Text style={styles.app_title}>Recuperar Contraseña</Text>
        <Text style={[styles.app_info_text, { marginBottom: 24, textAlign: 'center' }]}>
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
        </Text>

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

            <TouchableOpacity
              style={[styles.app_button, loading && styles.app_button_disabled]}
              onPress={handleResetPassword}
              disabled={loading || !email}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.app_buttonText}>Enviar Enlace</Text>
              )}
            </TouchableOpacity>

            <View style={styles.app_footer_row}>
              <Text style={styles.app_footer_text}>¿Recordaste tu contraseña?</Text>
              <Pressable onPress={goToLogin}>
                <Text style={styles.app_link}> Inicia sesión</Text>
              </Pressable>
            </View>
          </View>
        </View>
    </ScreenTemplate>
  );
}
