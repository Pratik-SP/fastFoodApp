import { FlatList, Text, View } from 'react-native';
import CartItem from '../../components/CartItem';
import CartFooter from '../../components/CartFooter';
import { useAppSelector } from '../../redux-store/hooks';

function Cart() {
  const { items } = useAppSelector(state => state.cart);

  return (
    <View className="bg-white h-full">
      <View className="mt-5 mb-5 px-8 text-center">
        <Text className="base-semibold text-dark-100 text-center">
          Your Cart
        </Text>
      </View>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={item => item.cartItemId}
        contentContainerClassName="pb-28 px-5 pt-5"
        ListEmptyComponent={
          <Text className="text-center paragraph-semibold text-dark-200 mt-10">
            Your cart is Empty
          </Text>
        }
        showsVerticalScrollIndicator={false}
        ListFooterComponent={CartFooter}
      />
    </View>
  );
}

export default Cart;
