import { useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';

type RootStackParamList = {
  Search: { query?: string };
};

type SearchScreenRouteProp = RouteProp<RootStackParamList, 'Search'>;
type SearchScreenNavigationProp = NavigationProp<RootStackParamList, 'Search'>;

function SearchBar() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const route = useRoute<SearchScreenRouteProp>();
  const [query, setQuery] = useState(route.params?.query || '');

  const handleSearch = (text: string) => {
    setQuery(text);

    if (!text) navigation.setParams({ query: undefined });
  };

  const handleSubmit = () => {
    if (query.trim()) navigation.setParams({ query });
  };
  return (
    <View
      className="searchbar"
      style={Platform.OS === 'android' ? styles.androidStyle : {}}
    >
      <TextInput
        className="flex-1 p-5"
        placeholder="Search for your favorite food item"
        value={query}
        onChangeText={handleSearch}
        onSubmitEditing={handleSubmit}
        placeholderClassName="paragraph-semibold"
        placeholderTextColor="#A0A0A0"
        returnKeyType="search"
      />
      <TouchableOpacity
        className="pr-5"
        onPress={() => navigation.setParams({ query })}
      >
        <Fontisto name="search" size={20} color="#A0A0A0" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  androidStyle: { elevation: 5, shadowColor: '#878787' },
});
export default SearchBar;
