import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import cn from 'clsx';

import { Category } from '../../type';

interface FilterProps {
  categories: Category[];
  selectedCategory?: string;
}

function Filter({ categories, selectedCategory = '' }: Readonly<FilterProps>) {
  const navigation = useNavigation();

  const [active, setActive] = useState(selectedCategory || 'all');

  useEffect(() => {
    if (selectedCategory) {
      setActive(selectedCategory);
    } else {
      setActive('all');
    }
  }, [selectedCategory]);

  const handlelPress = (id: string) => {
    setActive(id);

    if (id === 'all') navigation.setParams({ category: null } as any);
    else navigation.setParams({ category: id } as any);
  };

  const filterData: (Category | { $id: string; name: string })[] = categories
    ? [{ $id: 'all', name: 'All' }, ...categories]
    : [{ $id: 'all', name: 'All' }];

  return (
    <FlatList
      data={filterData}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-x-2 pb-3 ml-5"
      keyExtractor={item => item.$id}
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.$id}
          className={cn(
            'filter',
            active === item.$id ? 'bg-amber-500' : 'bg-white',
          )}
          style={Platform.OS === 'android' ? styles.androidStyle : {}}
          onPress={() => handlelPress(item.$id)}
        >
          <Text
            className={cn(
              'body-medium',
              active === item.$id ? 'text-white' : 'text-gray-200',
            )}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  androidStyle: { elevation: 5, shadowColor: '#878787' },
});
export default Filter;
