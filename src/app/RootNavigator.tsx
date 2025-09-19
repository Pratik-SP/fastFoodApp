import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './(auth)/AuthNavigator';
import TabsStackNavigator from './(tabs)/TabsStackNavigator';
import useAuthStore from '../store/auth.store';

const Stack = createNativeStackNavigator();
function RootNavigator() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={TabsStackNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
