import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import cn from 'clsx';

import { CustomButtonProps } from '../../type';

function CustomButton({
  onPress,
  title = 'click Me!',
  style,
  textStyle,
  leftIcon,
  isLoading = false,
}: Readonly<CustomButtonProps>) {
  return (
    <TouchableOpacity
      className={cn('custom-btn', style)}
      activeOpacity={0.7}
      onPress={onPress}
    >
      {leftIcon}
      <View className="flex-center flex-row">
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className={cn('paragraph-bold', textStyle)}>{title}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default CustomButton;
