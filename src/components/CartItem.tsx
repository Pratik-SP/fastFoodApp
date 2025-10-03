import { Image, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { CartCustomization, CartItemType } from '../../type';
import { useAppDispatch } from '../redux-store/hooks';
import { decreaseQty, increaseQty, removeItem } from '../redux-store/cartSlice';

const CartItem = ({ item }: { item: CartItemType }) => {
  const dispatch = useAppDispatch();

  const getItemTotalPrice = (cartItem: CartItemType) => {
    const base = cartItem.price;

    const customPrice =
      cartItem.customizations?.reduce(
        (sum: number, c: CartCustomization & { isDefault?: boolean }) =>
          !c.isDefault ? sum + c.price : sum,
        0,
      ) ?? 0;

    return base + customPrice;
  };

  return (
    <View className="cart-item">
      <View className="flex flex-row items-center gap-x-3">
        <View className="cart-item__image">
          <Image
            source={{ uri: item.image_url }}
            className="size-4/5 rounded-lg"
            resizeMode="cover"
          />
        </View>

        <View>
          <Text className="base-bold text-dark-100">{item.name}</Text>
          <Text className="paragraph-bold text-primary mt-1">
            ${getItemTotalPrice(item).toFixed(2)}
          </Text>

          <Text className="small-bold text-gray-500 mt-1 w-48">
            Base ${item.price.toFixed(2)}
            {item.customizations
              ?.filter(c => !c.isDefault)
              .map(c => ` + ${c.name} $${c.price.toFixed(2)}`)}
          </Text>

          <View className="flex flex-row items-center gap-x-4 mt-2">
            <TouchableOpacity
              onPress={() =>
                dispatch(
                  decreaseQty({
                    id: item.id,
                    customizations: item.customizations!,
                  }),
                )
              }
              className="cart-item__actions"
              activeOpacity={0.7}
            >
              <Feather name="minus" size={14} color={'#FF9C01'} />
            </TouchableOpacity>

            <Text className="base-bold text-dark-100">{item.quantity}</Text>

            <TouchableOpacity
              onPress={() =>
                dispatch(
                  increaseQty({
                    id: item.id,
                    customizations: item.customizations!,
                  }),
                )
              }
              className="cart-item__actions"
              activeOpacity={0.7}
            >
              <Feather name="plus" size={14} color={'#FF9C01'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() =>
          dispatch(
            removeItem({ id: item.id, customizations: item.customizations! }),
          )
        }
        activeOpacity={0.7}
        className="flex-center"
      >
        <Feather name="trash-2" size={20} color="#F14141" />
      </TouchableOpacity>
    </View>
  );
};

export default CartItem;
