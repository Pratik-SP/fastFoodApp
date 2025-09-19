import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from './SignIn';
import SignUpScreen from './SignUp';
import AuthLayout from './AuthLayout';

const Auth = createNativeStackNavigator();
function AuthNavigator() {
  return (
    <AuthLayout>
      <Auth.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Auth.Screen name="SignIn" component={SignInScreen} />
        <Auth.Screen name="SignUp" component={SignUpScreen} />
      </Auth.Navigator>
    </AuthLayout>
  );
}

export default AuthNavigator;
