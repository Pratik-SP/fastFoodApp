import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { images } from '../constants';
import { CustomHeaderProps } from '../../type';

const CustomHeader = ({ title }: CustomHeaderProps) => {
  const navigation = useNavigation();

  return (
    <View className="custom-header">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={images.arrowBack}
          className="size-5"
          resizeMode="contain"
        />
      </TouchableOpacity>

      {title && <Text className="base-semibold text-dark-100">{title}</Text>}

      <Image source={images.search} className="size-5" resizeMode="contain" />
    </View>
  );
};

export default CustomHeader;
