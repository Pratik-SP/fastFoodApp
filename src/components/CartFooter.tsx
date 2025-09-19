import { Text, View } from 'react-native';
import cn from 'clsx';
import { useCartStore } from '../store/cart.store';
import { PaymentInfoStripeProps } from '../../type';
import CustomButton from './CustomButton';

const PaymentInfoStripe = ({
  label,
  value,
  labelStyle,
  valueStyle,
}: PaymentInfoStripeProps) => (
  <View className="flex-between flex-row my-1">
    <Text className={cn('paragraph-medium text-gray-200', labelStyle)}>
      {label}
    </Text>
    <Text className={cn('paragraph-bold text-dark-100', valueStyle)}>
      {value}
    </Text>
  </View>
);

const CartFooter = () => {
  const { getTotalPrice, getTotalItems } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  return (
    totalItems > 0 && (
      <View className="gap-5">
        <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
          <Text className="h3-bold text-dark-100 mb-5">Payment Summary</Text>

          <PaymentInfoStripe
            label={`Total Items (${totalItems})`}
            value={`$${totalPrice.toFixed(2)}`}
          />
          <PaymentInfoStripe label={`Delivery Fee`} value={`Free`} />
          <PaymentInfoStripe
            label={`Discount`}
            value={` - $0.50`}
            valueStyle="!text-success"
          />

          <View className="border-t bordergray-300 my-2" />

          <PaymentInfoStripe
            label={`Total`}
            value={`$${(totalPrice + 0 - 0.5).toFixed(2)}`}
            labelStyle="base-bold !text-dark-100"
            valueStyle="base-bold !text-dark-100 !text-right"
          />
        </View>

        <CustomButton title="Order Now" textStyle="text-white-100" />
      </View>
    )
  );
};

export default CartFooter;
