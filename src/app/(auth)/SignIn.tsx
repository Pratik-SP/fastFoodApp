import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import * as Sentry from '@sentry/react-native';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { AuthStackParamList } from '../../../type';
import { getCurrentUser, signIn } from '../lib/appwrite';
import useAuthStore from '../../store/auth.store';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

function SignIn() {
  const AuthNavigation = useNavigation<AuthNavProp>();
  const { setIsAuthenticated, setUser } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const submit = async () => {
    const { email, password } = form;

    if (!email || !password)
      return Alert.alert('Error', 'Please Enter a valid email & password!');

    setIsSubmitting(true);
    try {
      await signIn({ email, password });

      const user = await getCurrentUser();
      if (user) {
        setUser(user as any);
        setIsAuthenticated(true);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
      Sentry.captureEvent(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white p-5 h-full">
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={text => setForm(prev => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />

      <CustomInput
        placeholder="Enter your Password"
        value={form.password}
        onChangeText={text => setForm(prev => ({ ...prev, password: text }))}
        label="Password"
        secureTextEntry={true}
      />

      <CustomButton
        isLoading={isSubmitting}
        onPress={submit}
        title="Sign In"
        textStyle="text-white-100"
      />

      <View className="flex justify-center flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => AuthNavigation.navigate('SignUp')}>
          <Text className="base-bold text-primary">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SignIn;
