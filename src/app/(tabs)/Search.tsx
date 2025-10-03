import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import cn from 'clsx';

import { getCategories, getMenu } from '../lib/appwrite';
import useAppwrite from '../lib/useAppwrite';
import MenuCard from '../../components/MenuCard';
import SearchBar from '../../components/SearchBar';
import Filter from '../../components/Filter';
import { images } from '../../constants';
import { Category, MenuItem, TabScreenParamList } from '../../../type';
import AdvancedFilters from '../../components/AdvancedFilters';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FilterChip from '../../components/FilterChip';

type SearchScreenRouteProp = RouteProp<TabScreenParamList, 'Search'>;

interface FilterState {
  price: {
    sort: 'high-to-low' | 'low-to-high' | null;
    range: 'under-20' | 'under-25' | 'under-30' | '30-plus' | null;
  };
  rating: {
    level: '3-plus' | '4-plus' | '4.5-plus' | null;
  };
  nutrition: {
    calories: '400-500' | '500-600' | '600-650' | '700-plus' | null;
    protein: 'under-20' | '20-25' | '25-30' | '30-35' | '35-plus' | null;
  };
}

const renderEmptyState = (menuLoading: boolean) => (
  <View className="flex-1 flex-center">
    {menuLoading ? (
      <>
        <ActivityIndicator size="large" color="#FE8C00" />
        <Text className="paragraph-semibold text-primary">
          Fetching menu items
        </Text>
      </>
    ) : (
      <View>
        <View className="mb-8 mt-4">
          <Image
            source={images.emptyState}
            className="size-full"
            resizeMode="contain"
          />
        </View>
        <Text className="h3-bold text-center text-dark-200 pb-3">
          Nothing matched your search
        </Text>
        <Text className="paragraph-medium text-center text-gray-200">
          Try a different search term or check for typos.
        </Text>
      </View>
    )}
  </View>
);

function Search() {
  const route = useRoute<SearchScreenRouteProp>();
  const { query = '', category = '' } = route.params ?? {};

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    price: { sort: null, range: null },
    rating: { level: null },
    nutrition: { calories: null, protein: null },
  });

  const {
    data: menuItems,
    refetch,
    loading: menuLoading,
  } = useAppwrite({
    fn: getMenu,
    params: { category, query, limit: 6 },
  });

  const { data: rawCategories, loading: categoriesLoading } = useAppwrite({
    fn: getCategories,
  });

  const categories: Category[] | undefined = rawCategories?.map(doc => ({
    $id: doc.$id,
    name: doc.name,
    description: doc.description,
  }));

  useEffect(() => {
    refetch({ category, query, limit: 6 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query]);

  const applyFilters = (items: MenuItem[]) => {
    if (!items) return [];

    let filteredItems = [...items];

    if (filters.price.range) {
      filteredItems = filteredItems.filter(item => {
        const price = item.price;

        switch (filters.price.range) {
          case 'under-20':
            return price < 20;
          case 'under-25':
            return price < 25;
          case 'under-30':
            return price < 30;
          case '30-plus':
            return price >= 30;
          default:
            return true;
        }
      });
    }

    if (filters.rating.level) {
      filteredItems = filteredItems.filter(item => {
        const rating = item.rating || 0;

        switch (filters.rating.level) {
          case '3-plus':
            return rating >= 3;
          case '4-plus':
            return rating >= 4;
          case '4.5-plus':
            return rating >= 4.5;
          default:
            return true;
        }
      });
    }

    if (filters.nutrition.calories) {
      filteredItems = filteredItems.filter(item => {
        const calories = item.calories || 0;

        switch (filters.nutrition.calories) {
          case '400-500':
            return calories >= 400 && calories <= 500;
          case '500-600':
            return calories >= 500 && calories <= 600;
          case '600-650':
            return calories >= 600 && calories <= 650;
          case '700-plus':
            return calories >= 700;
          default:
            return true;
        }
      });
    }

    if (filters.nutrition.protein) {
      filteredItems = filteredItems.filter(item => {
        const protein = item.protein || 0;

        switch (filters.nutrition.protein) {
          case 'under-20':
            return protein < 20;
          case '20-25':
            return protein >= 20 && protein < 25;
          case '25-30':
            return protein >= 25 && protein < 30;
          case '30-35':
            return protein >= 30 && protein < 35;
          case '35-plus':
            return protein >= 35;
          default:
            return true;
        }
      });
    }

    if (filters.price.sort) {
      filteredItems.sort((a, b) => {
        if (filters.price.sort === 'high-to-low') {
          return b.price - a.price;
        } else {
          return a.price - b.price;
        }
      });
    }

    return filteredItems;
  };

  const filteredMenuItems = applyFilters(menuItems as unknown as MenuItem[]);

  const hasActiveFilters = () => {
    return !!(
      filters.price.sort ||
      filters.price.range ||
      filters.rating.level ||
      filters.nutrition.calories ||
      filters.nutrition.protein
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.price.sort) count++;
    if (filters.price.range) count++;
    if (filters.rating.level) count++;
    if (filters.nutrition.calories) count++;
    if (filters.nutrition.protein) count++;

    return count;
  };

  const renderctiveFilterChips = () => {
    const chips = [];

    if (filters.price.sort !== null) {
      chips.push(
        <FilterChip
          key="price-sort"
          label={
            filters.price.sort === 'high-to-low'
              ? 'Price: High to Low'
              : 'Price: Low to High'
          }
          onRemove={() =>
            setFilters(prev => ({
              ...prev,
              price: { ...prev.price, sort: null },
            }))
          }
        />,
      );
    }

    if (filters.price.range !== null) {
      const priceRanges: Record<string, string> = {
        'under-20': 'Under $20',
        'under-25': 'Under $25',
        'under-30': 'Under $30',
        '30-plus': '$30+',
      };
      chips.push(
        <FilterChip
          key="price-range"
          label={priceRanges[filters.price.range]}
          onRemove={() =>
            setFilters(prev => ({
              ...prev,
              price: { ...prev.price, range: null },
            }))
          }
        />,
      );
    }

    if (filters.rating.level !== null) {
      const priceRanges: Record<string, string> = {
        '3-plus': '3+ stars',
        '4-plus': '4+ stars',
        '4.5-plus': '4.5+ stars',
      };
      chips.push(
        <FilterChip
          key="rating-level"
          label={priceRanges[filters.rating.level]}
          onRemove={() =>
            setFilters(prev => ({
              ...prev,
              rating: { ...prev.rating, level: null },
            }))
          }
        />,
      );
    }

    if (filters.nutrition.calories !== null) {
      const priceRanges: Record<string, string> = {
        '400-500': '400-500 cal',
        '500-600': '500-600 cal',
        '600-650': '600-650 cal',
        '700-plus': '700+ cal',
      };
      chips.push(
        <FilterChip
          key="nutrition-calories"
          label={priceRanges[filters.nutrition.calories]}
          onRemove={() =>
            setFilters(prev => ({
              ...prev,
              nutrition: { ...prev.nutrition, calories: null },
            }))
          }
        />,
      );
    }

    if (filters.nutrition.protein !== null) {
      const priceRanges: Record<string, string> = {
        'under-20': 'Under 20g',
        '20-25': '20-25g',
        '25-30': '25-30g',
        '30-35': '30-35g',
        '35-plus': '35g+',
      };
      chips.push(
        <FilterChip
          key="nutrition-protein"
          label={priceRanges[filters.nutrition.protein]}
          onRemove={() =>
            setFilters(prev => ({
              ...prev,
              nutrition: { ...prev.nutrition, protein: null },
            }))
          }
        />,
      );
    }

    return chips.length > 0 ? (
      <View className="px-5 mb-3">
        <View className="flex-row flex-wrap">{chips}</View>
      </View>
    ) : null;
  };

  return (
    <View className="bg-white h-full">
      <View className=" gap-5 bg-white pt-5">
        <View className="flex-between flex-row w-full px-6">
          <View className="flex-start">
            <Text className="small-bold uppercase text-primary">Search</Text>
            <View className="flex-start flex-row gap-x-1 mt-0.5">
              <Text className="paragraph-semibold text-dark-100">
                Find your favorite food
              </Text>
            </View>
          </View>
        </View>

        <View className="px-5 flex-row items-center gap-3">
          <View className="flex-1">
            <SearchBar />
          </View>
          <TouchableOpacity
            className="w-12 h-12 bg-primary/10 rounded-lg flex-center relative"
            onPress={() => setIsDrawerVisible(true)}
            activeOpacity={0.6}
          >
            <Icon name="tune" size={24} color="#FF6B35" />

            {hasActiveFilters() && (
              <View className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex-center">
                <Text className="text-white text-xs body-regular">
                  {getActiveFilterCount()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {!categoriesLoading && (
          <Filter categories={categories!} selectedCategory={category} />
        )}
      </View>

      {renderctiveFilterChips()}

      <FlatList
        data={filteredMenuItems}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 === 0;
          return (
            <View
              className={cn(
                'flex-1 max-w-[48%]',
                !isFirstRightColItem ? 'mt-10' : 'mt-0',
              )}
            >
              <MenuCard item={item as unknown as MenuItem} />
            </View>
          );
        }}
        keyExtractor={item => item.$id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperClassName="gap-5"
        contentContainerClassName="gap-5 mt-10 px-5 pb-40"
        ListEmptyComponent={renderEmptyState(menuLoading)}
      />

      <AdvancedFilters
        visible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        filters={filters}
        onFilterChange={setFilters}
      />
    </View>
  );
}

export default Search;
