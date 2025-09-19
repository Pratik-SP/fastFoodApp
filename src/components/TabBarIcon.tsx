import { StyleSheet, Text, View } from 'react-native';
import cn from 'clsx';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { TabBarIconProps } from '../../type';
import { useCartStore } from '../store/cart.store';

const TabBarIcon = ({ focused, title }: TabBarIconProps) => {
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <View className="tab-icon items-center">
      {title === 'Home' && (
        <AntDesign
          name="home"
          size={24}
          color={focused ? '#FE8C00' : '#5D5F5D'}
        />
      )}

      {title === 'Search' && (
        <Feather
          name="search"
          size={24}
          style={styles.iconSpacing}
          color={focused ? '#FE8C00' : '#5D5F5D'}
        />
      )}

      {title === 'Cart' && (
        <Feather
          name="shopping-bag"
          style={styles.iconSpacing}
          size={24}
          color={focused ? '#FE8C00' : '#5D5F5D'}
        />
      )}

      {title === 'Profile' && (
        <Ionicons
          name="person-circle-outline"
          size={28}
          color={focused ? '#FE8C00' : '#5D5F5D'}
        />
      )}

      {totalItems > 0 && title === 'Cart' && (
        <View className="cart-badge mr-5">
          <Text className="small-bold text-white">{totalItems}</Text>
        </View>
      )}

      <Text
        className={cn(
          'text-sm paragraph-bold',
          focused ? 'text-primary' : 'text-gray-200',
        )}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconSpacing: { marginBottom: 2 },
});

export default TabBarIcon;
