import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';

import { createUser } from '../lib/appwrite';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { AuthStackParamList } from '../../../type';
import { useAppDispatch } from '../../redux-store/hooks';
import { fetchAuthenticatedUser } from '../../redux-store/authSlice';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList>;

function SignUp() {
  const AuthNavigation = useNavigation<AuthNavProp>();
  const dispatch = useAppDispatch();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = async () => {
    const { name, email, password } = form;
    if (!name || !email || !password)
      return Alert.alert('Error', 'Please Enter a valid email & password!');

    setIsSubmitting(true);
    try {
      await createUser({ name, email, password });
      dispatch(fetchAuthenticatedUser());
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white p-5 h-full">
      <CustomInput
        placeholder="Enter your name"
        value={form.name}
        onChangeText={text => setForm(prev => ({ ...prev, name: text }))}
        label="Name"
        keyboardType="default"
      />

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
        title="Sign Up"
        textStyle="text-white-100"
      />

      <View className="flex justify-center flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => AuthNavigation.navigate('SignIn')}>
          <Text className="base-bold text-primary">Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SignUp;
