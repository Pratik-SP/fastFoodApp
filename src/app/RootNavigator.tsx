import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './(auth)/AuthNavigator';
import TabsStackNavigator from './(tabs)/TabsStackNavigator';
import { useAppSelector } from '../redux-store/hooks';

const Stack = createNativeStackNavigator();
function RootNavigator() {
  const { isAuthenticated } = useAppSelector(state => state.auth);

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
