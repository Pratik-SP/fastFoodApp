import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { images } from '../constants';
import { useCartStore } from '../store/cart.store';
import { TabScreenParamList } from '../../type';

type TabNavProp = NativeStackNavigationProp<TabScreenParamList>;

function CartButton() {
  const navigation = useNavigation<TabNavProp>();
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <TouchableOpacity
      className="cart-btn"
      onPress={() => navigation.navigate('Cart')}
    >
      <Image source={images.bag} className="size-5" resizeMode="contain" />

      {totalItems > 0 && (
        <View className="cart-badge">
          <Text className="small-bold text-white">{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default CartButton;
