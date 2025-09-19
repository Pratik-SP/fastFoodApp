import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import Index from './Index';
import Search from './Search';
import Cart from './Cart';
import Profile from './Profile';
import TabBarIcon from '../../components/TabBarIcon';

const Tab = createBottomTabNavigator();

// TabBarIcon renderers moved outside of TabsNavigator to avoid inline component definitions
const HomeTabBarIcon = ({ focused }: { focused: boolean }) => (
  <TabBarIcon title="Home" focused={focused} />
);

const SearchTabBarIcon = ({ focused }: { focused: boolean }) => (
  <TabBarIcon title="Search" focused={focused} />
);

const CartTabBarIcon = ({ focused }: { focused: boolean }) => (
  <TabBarIcon title="Cart" focused={focused} />
);

const ProfileTabBarIcon = ({ focused }: { focused: boolean }) => (
  <TabBarIcon title="Profile" focused={focused} />
);

function TabsNavigator() {
  return (
    <View className="flex-1 bg-white">
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            marginHorizontal: 20,
            height: 80,
            position: 'absolute',
            bottom: 10,
            backgroundColor: 'white',
            shadowColor: '#1a1a1a',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          },
        }}
      >
        <Tab.Screen
          name="Index"
          options={{
            title: 'Home',
            tabBarIcon: HomeTabBarIcon,
          }}
          component={Index}
        />

        <Tab.Screen
          name="Search"
          options={{
            title: 'Search',
            tabBarIcon: SearchTabBarIcon,
          }}
          component={Search}
        />

        <Tab.Screen
          name="Cart"
          options={{
            title: 'Cart',
            tabBarIcon: CartTabBarIcon,
          }}
          component={Cart}
        />

        <Tab.Screen
          name="Profile"
          options={{
            title: 'Profile',
            tabBarIcon: ProfileTabBarIcon,
          }}
          component={Profile}
        />
      </Tab.Navigator>
    </View>
  );
}

export default TabsNavigator;
