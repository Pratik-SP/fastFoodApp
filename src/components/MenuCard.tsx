import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';

import { MainStackParamList, MenuItem } from '../../type';
import { appwriteConfig } from '../app/lib/appwriteConfig';
import { useCartStore } from '../store/cart.store';
import Toast from 'react-native-toast-message';
import Entypo from 'react-native-vector-icons/Entypo';

type NavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'ItemDetails'
>;

function MenuCard({
  item,
}: Readonly<{
  item: MenuItem;
}>) {
  const navigation = useNavigation<NavigationProp>();

  const imageUrl = `${item.image_url}?project=${appwriteConfig.projectId}`;
  const { addItem } = useCartStore();
  return (
    <TouchableOpacity
      className="menu-card"
      onPress={() => navigation.navigate('ItemDetails', { item })}
      style={Platform.OS === 'android' ? styles.androidStyle : {}}
    >
      <Image
        source={{ uri: imageUrl }}
        className="size-32 absolute -top-10"
        resizeMode="contain"
      />

      <Text
        className="text-center base-bold text-dark-100 mb-2"
        numberOfLines={1}
      >
        {item.name}
      </Text>
      <View className="flex-row items-center gap-2 mb-4">
        <Text className="body-medium mr-3">${item.price}</Text>

        <Fontisto name="star" size={16} color={'#FE8C00'} />

        <Text className="paragraph-bold">{item.rating}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          addItem({
            id: item.$id,
            name: item.name,
            price: item.price,
            image_url: imageUrl,
            customizations: [],
          });
          Toast.show({
            type: 'success',
            text1: 'Added to cart',
            text2: `${item.name} has been added to your cart.`,
            position: 'top',
            visibilityTime: 2000,
          });
        }}
      >
        <Text className="paragraph-bold text-primary">
          Add to Cart <Entypo name="plus" size={16} color="#FE8C00" />
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  androidStyle: { elevation: 10, shadowColor: '#878787' },
});
export default MenuCard;
