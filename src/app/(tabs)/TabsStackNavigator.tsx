import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabsNavigator from './TabsNavigator';
import MenuItemDetails from './MenuItemDetails';

const TabsStack = createNativeStackNavigator();
function TabsStackNavigator() {
  return (
    <TabsStack.Navigator screenOptions={{ headerShown: false }}>
      <TabsStack.Screen name="Tabs" component={TabsNavigator} />
      <TabsStack.Screen name="ItemDetails" component={MenuItemDetails} />
      
    </TabsStack.Navigator>
  );
}

export default TabsStackNavigator;
