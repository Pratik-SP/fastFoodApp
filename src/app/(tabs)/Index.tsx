import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import cn from 'clsx';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { images, offers } from '../../constants';
import useAppwrite from '../lib/useAppwrite';
import { getCategories } from '../lib/appwrite';
import { Category, TabScreenParamList } from '../../../type';

type TabNavProp = BottomTabNavigationProp<TabScreenParamList>;

function Index() {
  const navigation = useNavigation<TabNavProp>();

  const { data: rawCategories } = useAppwrite({ fn: getCategories });

  const categories: Category[] | undefined = rawCategories?.map(doc => ({
    $id: doc.$id,
    name: doc.name,
    description: doc.description,
  }));

  const findCategoryIdByName = (categoryName: string) => {
    if (!categories || !categoryName) return '';
    const foundCategory = categories.find(
      cat => cat.name.toLowerCase() === categoryName.toLowerCase(),
    );
    return foundCategory?.$id || '';
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-between flex-row w-full mt-5 mb-3 px-6">
        <View className="flex-start">
          <Text className="small-bold text-primary">DELIVER TO</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-center flex-row gap-x-1 mt-0.5"
          >
            <Text className="paragraph-bold text-dark-100">Gujarat</Text>
            <Image
              source={images.arrowDown}
              className="size-3"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={offers}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;
          return (
            <View>
              <TouchableOpacity
                activeOpacity={0.9}
                className={cn(
                  'offer-card',
                  isEven ? 'flex-row-reverse' : 'flex-row',
                )}
                style={{ backgroundColor: item.color }}
                onPress={() => {
                  const categoryId = findCategoryIdByName(item.categories[0]);

                  navigation.navigate('Search', {
                    category: categoryId,
                  });
                }}
              >
                <View className="h-full w-1/2">
                  <Image
                    source={item.image}
                    className={'size-full'}
                    resizeMode={'contain'}
                  />
                </View>
                <View
                  className={cn('offer-card__info', isEven ? 'pl-10' : 'pr-10')}
                >
                  <Text className="h1-bold text-white leading-tight">
                    {item.title}
                  </Text>
                  {/* <Text className='h3-bold text-white m-0'>$10.00</Text> */}
                  <Image
                    source={images.arrowRight}
                    className="size-16"
                    resizeMode="contain"
                    tintColor="#ffffff"
                  />
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-28 px-5"
      />
    </View>
  );
}

export default Index;
