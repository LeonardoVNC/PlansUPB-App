import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@hooks/useAuth';
import { globalStyles } from '@styles/globals';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, loading } = useAuth();
  const styles = globalStyles();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [career, setCareer] = useState('');
  const [school, setSchool] = useState('');
  const [faculty, setFaculty] = useState('');
  
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureConfirmEntry, setSecureConfirmEntry] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<'error' | 'success'>('error');

  const handleRegister = async () => {
    setMessage(null);

    if (!code.trim() || !name.trim() || !username.trim() || !email.trim() || 
        !password || !confirmPassword || !career.trim() || !school.trim() || !faculty.trim()) {
      setMessageTone('error');
      setMessage('Por favor completa todos los campos obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      setMessageTone('error');
      setMessage('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setMessageTone('error');
      setMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await signUp(
        {
          code: code.trim(),
          name: name.trim(),
          username: username.trim(),
          email: email.trim(),
          bio: bio.trim() || undefined,
          isActive: true,
          role: 'User',
          career: career.trim(),
          school: school.trim(),
          faculty: faculty.trim(),
        },
        password
      );
      
      setMessageTone('success');
      setMessage('Cuenta creada con éxito');
      
      setTimeout(() => {
        router.replace('/(drawer)/home');
      }, 1000);
    } catch (error: any) {
      setMessageTone('error');
      setMessage(error?.message ?? 'No se pudo crear la cuenta');
    }
  };

  const goToLogin = () => {
    if (loading) {
      Alert.alert('Espera', 'Estamos creando tu cuenta.');
      return;
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={styles.app_title}>Crear Cuenta</Text>
          <Text style={styles.app_subtitle}>Únete a PlansUPB</Text>
        </View>

        <View style={{ gap: 16 }}>
          {/* Código UPB */}
          <View>
            <Text style={styles.app_label}>Código UPB *</Text>
            <View style={styles.app_input_wrapper}>
              <Ionicons name="school-outline" size={20} color="#0066CC" />
              <TextInput
                style={styles.app_input}
                value={code}
                onChangeText={setCode}
                placeholder="8080"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Nombre completo */}
          <View>
            <Text style={styles.app_label}>Nombre Completo *</Text>
            <View style={styles.app_input_wrapper}>
              <Ionicons name="person-outline" size={20} color="#0066CC" />
              <TextInput
                style={styles.app_input}
                value={name}
                onChangeText={setName}
                placeholder="Juan Pérez"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Username */}
          <View>
            <Text style={styles.app_label}>Usuario *</Text>
            <View style={styles.app_input_wrapper}>
              <Ionicons name="at-outline" size={20} color="#0066CC" />
              <TextInput
                style={styles.app_input}
                value={username}
                onChangeText={setUsername}
                placeholder="juanperez"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Email */}
          <View>
            <Text style={styles.app_label}>Email *</Text>
            <View style={styles.app_input_wrapper}>
              <Ionicons name="mail-outline" size={20} color="#0066CC" />
              <TextInput
                style={styles.app_input}
                value={email}
                onChangeText={setEmail}
                placeholder="juan.perez@upb.edu"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Carrera */}
          <View>
            <Text style={styles.app_label}>Carrera *</Text>
            <View style={styles.app_input_wrapper}>
              <Ionicons name="book-outline" size={20} color="#0066CC" />
              <TextInput
                style={styles.app_input}
                value={career}
                onChangeText={setCareer}
                placeholder="Ingeniería de Sistemas"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Escuela */}
          <View>
            <Text style={styles.app_label}>Escuela *</Text>
            <View style={styles.app_input_wrapper}>
              <Ionicons name="business-outline" size={20} color="#0066CC" />
              <TextInput
                style={styles.app_input}
                value={school}
                onChangeText={setSchool}
                placeholder="DTI, CSJ, etc."
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Facultad */}
          <View>
            <Text style={styles.app_label}>Facultad *</Text>
            <View style={styles.app_input_wrapper}>
              <Ionicons name="library-outline" size={20} color="#0066CC" />
              <TextInput
                style={styles.app_input}
                value={faculty}
                onChangeText={setFaculty}
                placeholder="FIA, FACED, etc."
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Bio (opcional) */}
          <View>
            <Text style={styles.app_label}>Biografía (Opcional)</Text>
            <View style={styles.app_input_wrapper}>
              <Ionicons name="text-outline" size={20} color="#0066CC" />
              <TextInput
                style={[styles.app_input, { minHeight: 60 }]}
                value={bio}
                onChangeText={setBio}
                placeholder="Cuéntanos sobre ti..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Contraseña */}
          <View>
            <Text style={styles.app_label}>Contraseña *</Text>
            <View style={styles.app_input_wrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#0066CC" />
              <TextInput
                style={styles.app_input}
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#999"
                secureTextEntry={secureEntry}
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

          {/* Confirmar contraseña */}
          <View>
            <Text style={styles.app_label}>Confirmar Contraseña *</Text>
            <View style={styles.app_input_wrapper}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#0066CC" />
              <TextInput
                style={styles.app_input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#999"
                secureTextEntry={secureConfirmEntry}
              />
              <Pressable onPress={() => setSecureConfirmEntry((prev) => !prev)} hitSlop={8}>
                <Ionicons
                  name={secureConfirmEntry ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#0066CC"
                />
              </Pressable>
            </View>
          </View>

          {/* Mensaje de feedback */}
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

          {/* Botón de registro */}
          <TouchableOpacity
            style={[styles.app_button, loading && styles.app_button_disabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.app_buttonText}>Crear Cuenta</Text>
            )}
          </TouchableOpacity>

          {/* Link a login */}
          <View style={styles.app_footer_row}>
            <Text style={styles.app_footer_text}>¿Ya tienes cuenta?</Text>
            <Pressable onPress={goToLogin}>
              <Text style={styles.app_link}> Inicia sesión</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
