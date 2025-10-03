import {
  Image,
  ScrollView,
  Switch,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';

import { appwriteConfig } from '../lib/appwriteConfig';
import CustomHeader from '../../components/CustomHeader';
import { getCustomizations } from '../lib/appwrite';
import { images } from '../../constants';
import { MainStackParamList, Customizations } from '../../../type';
import useAppwrite from '../lib/useAppwrite';
import Toast from 'react-native-toast-message';
import { useAppDispatch } from '../../redux-store/hooks';
import { addItem } from '../../redux-store/cartSlice';

type ItemDetailsRouteProp = RouteProp<MainStackParamList, 'ItemDetails'>;

function MenuItemDetails() {
  const route = useRoute<ItemDetailsRouteProp>();
  const { item } = route.params;

  const dispatch = useAppDispatch();
  // const addItem = useAppSelector(state => state.cart.addItem);
  // const { addItem } = useCartStore();

  const { data: customizations } = useAppwrite({ fn: getCustomizations });

  const [selectedCustomizations, setSelectedCustomizations] = useState<
    string[]
  >([]);
  const [defaultCustomizations, setDefaultCustomizations] = useState<string[]>(
    [],
  );
  const [quantity, setQuantity] = useState(1);

  const imageUrl = `${item.image_url}?project=${appwriteConfig.projectId}`;

  useEffect(() => {
    if (item.menuCustomizations) {
      const preSelectedIds = item.menuCustomizations.map(
        (menuCustomization: any) => menuCustomization.customizations,
      );

      setSelectedCustomizations(preSelectedIds);
      setDefaultCustomizations(preSelectedIds);
    }
  }, [item]);

  const toppings = (customizations as Customizations[] | null)?.filter(
    (c: Customizations) => c.type === 'topping',
  );
  const sides = (customizations as Customizations[] | null)?.filter(
    (c: Customizations) => c.type === 'side',
  );

  const getImageForItem = (name: string) => {
    const lowerName = name;
    if (lowerName.includes('Extra Cheese')) return images.cheese;
    if (lowerName.includes('Jalapeños')) return images.onionRings;
    if (lowerName.includes('Onions')) return images.onions;
    if (lowerName.includes('Olives')) return images.onionRings;
    if (lowerName.includes('Mushrooms')) return images.mushrooms;
    if (lowerName.includes('Tomatoes')) return images.tomatoes;
    if (lowerName.includes('Bacon')) return images.bacon;
    if (lowerName.includes('Avocado')) return images.avocado;
    if (lowerName.includes('Coke')) return images.onionRings;
    if (lowerName.includes('Fries')) return images.fries;
    if (lowerName.includes('Garlic Bread')) return images.onionRings;
    if (lowerName.includes('Chicken Nuggets')) return images.onionRings;
    if (lowerName.includes('Iced Tea')) return images.onionRings;
    if (lowerName.includes('Salad')) return images.salad;
    if (lowerName.includes('Potato Wedges')) return images.onionRings;
    if (lowerName.includes('Mozzarella Sticks')) return images.mozarellaSticks;
    if (lowerName.includes('Sweet Corn')) return images.mozarellaSticks;
    if (lowerName.includes('Choco Lava Cake')) return images.onionRings;
  };

  const toggleCustomization = (customizationId: string) => {
    setSelectedCustomizations(prev =>
      prev.includes(customizationId)
        ? prev.filter(id => id !== customizationId)
        : [...prev, customizationId],
    );
  };

  const calculateTotalPrice = () => {
    let total = item.price;

    if (customizations) {
      selectedCustomizations.forEach(id => {
        if (!defaultCustomizations.includes(id)) {
          const selected = customizations.find(c => c.$id === id);
          if (selected) {
            total += selected.price / 100;
          }
        }
      });
    }

    return (total * quantity).toFixed(2);
  };

  const renderCustomizationCard = ({
    item: customItem,
  }: {
    item: Customizations;
  }) => {
    const isSelected = selectedCustomizations.includes(customItem.$id);
    const selectedDefault = defaultCustomizations.includes(customItem.$id);

    return (
      <View className="w-36 flex-1">
        <View className="bg-softBeige rounded-xl px-4 py-2 shadow-sm shadow-black/10 items-center z-10">
          <Image
            source={getImageForItem(customItem.name)}
            className="h-28"
            resizeMode="contain"
          />
        </View>

        <View className="bg-dark-100 rounded-xl p-3 pt-10 -mt-8 flex-column justify-between h-36">
          <View className="flex-1">
            <Text
              className="paragraph-medium text-white"
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.customizationText}
            >
              {customItem.name}
            </Text>
          </View>
          <View className="flex-row items-center justify-between ">
            <Text className="paragraph-bold text-primary">
              +{(customItem.price / 100).toFixed(2)}
            </Text>
            <Switch
              value={isSelected}
              disabled={selectedDefault}
              onValueChange={() => toggleCustomization(customItem.$id)}
              trackColor={
                selectedDefault
                  ? { false: '#9CA3BF', true: '#9CA3BF' }
                  : { false: '#374151', true: '#FF6B35' }
              }
              thumbColor={
                selectedDefault ? '#6B7280' : isSelected ? '#FFFFFF' : '#D1D5DB'
              }
              ios_backgroundColor="#375141"
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-5 py-5">
        <CustomHeader />
      </View>
      <ScrollView className="flex-1 py-5" showsVerticalScrollIndicator={false}>
        <View className="px-5">
          <View className="flex-row mb-6 mt-2 relative">
            <View className="flex-1 pr-4 justify-center">
              <Text className="h1-bold text-dark-100 mb-2">{item.name}</Text>
              <Text className="paragraph-medium text-gray-500 mb-3">
                {item.description}
              </Text>

              <View className="flex-row items-center my-2">
                <Text className="base-semibold text-gray-500">
                  ⭐⭐⭐⭐⭐ {item.rating} / 5
                </Text>
              </View>

              <View>
                <Text className="text-2xl h3-bold my-6">
                  <Text className="text-primary mr-2">$</Text>
                  {item.price}
                </Text>
              </View>

              <View className="flex-row items-center mb-3 gap-3">
                <View className="gap-1">
                  <Text className="base-regular text-gray-600">Calories</Text>
                  <Text className="h3-bold">{item.calories} cal</Text>
                </View>
                <View className="gap-1">
                  <Text className="base-regular text-gray-600">Protein</Text>
                  <Text className="h3-bold">{item.protein}g</Text>
                </View>
              </View>

              <View className="gap-1 mt-2">
                <Text className="base-regular text-gray-600">Bun Type</Text>
                <Text className="h3-bold">Whole Wheat</Text>
              </View>
            </View>

            <View className="absolute -right-10 mt-16">
              <Image
                source={{ uri: item.image_url }}
                className="w-72 h-80 rounded-xl"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <View className="px-5">
          <View className="flex-row items-center justify-around my-8 py-4 bg-gray-50 rounded-full">
            <View className="flex-row items-center gap-1">
              <Fontisto
                name="dollar"
                size={16}
                color={'#FE8C00'}
                style={styles.iconSpacing}
              />
              <Text className="paragraph-bold">Free Delivery</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <AntDesign
                name="clockcircle"
                size={16}
                color={'#FE8C00'}
                style={styles.iconSpacing}
              />
              <Text className="paragraph-bold">20 - 30 mins</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Fontisto
                name="star"
                size={16}
                color={'#FE8C00'}
                style={styles.iconSpacing}
              />
              <Text className="paragraph-bold">{item.rating}</Text>
            </View>
          </View>
        </View>

        <View className="mb-8 p-2 px-5">
          <Text className="base-semibold text-gray-600 leading-6">
            The Cheeseburger Wendy's Burger is a classic fast food burger that
            packs a punch of flavor in every bite. Made with a juicy beef patty
            cooked to perfection, it's topped with melted American cheese,
            crispy lettuce, tomato, & crunchy pickles.
          </Text>
        </View>

        <View className="flex-1 mb-8">
          <Text className="base-bold px-5 mb-5">Toppings</Text>
          <FlatList
            data={toppings}
            renderItem={renderCustomizationCard}
            keyExtractor={items => items.$id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-5 gap-5"
          />
        </View>

        <View className="mb-8">
          <Text className="base-bold px-5 mb-5">Sides</Text>
          <FlatList
            data={sides}
            renderItem={renderCustomizationCard}
            keyExtractor={items => items.$id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-5 gap-5"
          />
        </View>

        <View className="flex-row items-center justify-between mt-8 mb-8 px-6">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="size-10 rounded-full bg-gray-50 flex-center mr-4"
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Octicons name="dash" size={24} color="#FF9C01" />
            </TouchableOpacity>

            <Text className="base-bold text-dark-100">{quantity}</Text>

            <TouchableOpacity
              className="size-10 rounded-full bg-gray-50 flex-center ml-4"
              onPress={() => setQuantity(Math.max(1, quantity + 1))}
            >
              <Octicons name="plus" size={24} color="#FF9C01" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="custom-btn ml-6 flex-1"
            onPress={() => {
              dispatch(
                addItem({
                  id: item.$id,
                  name: item.name,
                  price: item.price,
                  image_url: imageUrl,
                  quantity,
                  customizations: selectedCustomizations
                    .map(id => {
                      const c = customizations?.find(cust => cust.$id === id);
                      if (!c) return null;
                      return c
                        ? {
                            id: c.$id,
                            name: c.name,
                            price: c.price / 100,
                            isDefault:
                              defaultCustomizations.includes(c.$id) ||
                              undefined,
                          }
                        : null;
                    })
                    .filter(Boolean) as any[],
                }),
              );
              Toast.show({
                type: 'success',
                text1: 'Added to cart',
                text2: `${item.name} has been added to your cart.`,
                position: 'top',
                visibilityTime: 2000,
              });
            }}
          >
            <Text className="base-bold text-white">
              Add to Cart - ${calculateTotalPrice()}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  customizationText: { marginRight: 5 },
  iconSpacing: { marginRight: 5 },
});

export default MenuItemDetails;
