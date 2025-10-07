import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import cn from 'clsx';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.85;

export interface FilterState {
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

interface AdvancedFilterProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

interface FilterSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

interface FilterOptionProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
  subtitle?: string;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  icon,
  children,
}) => (
  <View className="mb-8">
    <View className="flex-row items-center mb-4">
      <Icon name={icon} size={24} color="#FE8C00" />
      <Text className="h3-bold text-dark-200 ml-2">{title}</Text>
    </View>
    {children}
  </View>
);

const FilterOption: React.FC<FilterOptionProps> = ({
  title,
  isSelected,
  onPress,
  subtitle,
}) => (
  <TouchableOpacity
    className={cn(
      'flex-row flex-between px-4 py-3 mb-2 rounded-xl',
      isSelected ? 'bg-primary/10 border border-primary' : 'bg-gray-50',
    )}
    onPress={onPress}
  >
    <View className="flex-1">
      <Text
        className={cn(
          'paragraph-medium',
          isSelected ? 'text-primary' : 'text-dark-200',
        )}
      >
        {title}
      </Text>
      {subtitle && (
        <Text className="small-bold text-gray-200 mt-1">{subtitle}</Text>
      )}
    </View>
    {isSelected && (
      <View className="w-5 h-5 rounded-full bg-primary flex-center">
        <View className="w-2 h-2 rounded-full bg-white" />
      </View>
    )}
  </TouchableOpacity>
);

const AdvancedFilters: React.FC<AdvancedFilterProps> = ({
  visible,
  onClose,
  filters,
  onFilterChange,
}) => {
  const slideAnim = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const [renderModal, setRenderModal] = useState<boolean>(visible);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  useEffect(() => {
    if (isSwiping) return;

    if (visible) {
      setRenderModal(true);
      setTempFilters(filters);

      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }

    if (renderModal) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: DRAWER_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRenderModal(false);

        slideAnim.setValue(DRAWER_WIDTH);
        overlayAnim.setValue(0);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isSwiping]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (e, gestureState) => {
      return Math.abs(gestureState.dx) > 10;
    },
    onPanResponderGrant: () => {
      setIsSwiping(true);
    },
    onPanResponderMove: (e, gestureState) => {
      if (gestureState.dx > 0) {
        slideAnim.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx > DRAWER_WIDTH * 0.25) {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: DRAWER_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(overlayAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsSwiping(false);
          onClose();
        });
      } else {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setIsSwiping(false));
      }
    },
  });

  const updateFilter = <T extends keyof FilterState>(
    category: T,
    key: keyof FilterState[T],
    value: FilterState[T][keyof FilterState[T]] | null,
  ) => {
    setTempFilters(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const clearAllFilters = () => {
    onFilterChange({
      price: { sort: null, range: null },
      rating: { level: null },
      nutrition: { calories: null, protein: null },
    });
    onClose();
  };

  const applyFilters = () => {
    onFilterChange(tempFilters);
    onClose();
  };

  const PRICE_SORT_OPTIONS = [
    { key: 'high-to-low', label: 'Price: High to Low' },
    { key: 'low-to-high', label: 'Price: Low to High' },
  ] as const;

  const PRICE_RANGE_OPTIONS = [
    { key: 'under-20', label: 'Under $20' },
    { key: 'under-25', label: 'Under $25' },
    { key: 'under-30', label: 'Under $30' },
    { key: '30-plus', label: '$30 +' },
  ] as const;

  const RATING_OPTIONS = [
    { key: '3-plus', label: '3+ Stars' },
    { key: '4-plus', label: '4+ Stars' },
    { key: '4.5-plus', label: '4.5 + Stars' },
  ] as const;

  const CALORIES_OPTIONS = [
    { key: '400-500', label: '400-500 calories' },
    { key: '500-600', label: '500-600 calories' },
    { key: '600-650', label: '600-650 calories' },
    { key: '700-plus', label: '700+ calories' },
  ] as const;

  const PROTEIN_OPTIONS = [
    { key: 'under-20', label: 'Under 20g' },
    { key: '20-25', label: '20-25g' },
    { key: '25-30', label: '25-30g' },
    { key: '30-35', label: '30-35g' },
    { key: '35-plus', label: 'above 35g' },
  ] as const;

  const styles = StyleSheet.create({
    overlayContainer: {
      opacity: overlayAnim,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      flex: 1,
    },
    filterContainer: {
      transform: [{ translateX: slideAnim }],
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: DRAWER_WIDTH,
      backgroundColor: 'white',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
    },
  });

  return (
    <Modal
      visible={renderModal}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <Animated.View style={styles.overlayContainer}>
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        <Animated.View
          style={styles.filterContainer}
          {...panResponder.panHandlers}
        >
          <View className="flex-row flex-between p-6 border-b border-gray-100">
            <Text className="h3-bold text-primary mb-2">Filters</Text>

            <TouchableOpacity className="p-2 rounded-full" onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 px-6 py-6"
            showsVerticalScrollIndicator={false}
          >
            <FilterSection title="Price" icon="attach-money">
              <View className="mb-4">
                <Text className="paragraph-semibold text-gray-200 mb-3">
                  Sort By
                </Text>
                {PRICE_SORT_OPTIONS.map(option => (
                  <FilterOption
                    key={option.key}
                    title={option.label}
                    isSelected={tempFilters.price.sort === option.key}
                    onPress={() =>
                      updateFilter(
                        'price',
                        'sort',
                        tempFilters.price.sort === option.key
                          ? null
                          : option.key,
                      )
                    }
                  />
                ))}
              </View>

              <View>
                <Text className="paragraph-semibold text-gray-200 mb-3">
                  Price Range
                </Text>

                {PRICE_RANGE_OPTIONS.map(option => (
                  <FilterOption
                    key={option.key}
                    title={option.label}
                    isSelected={tempFilters.price.range === option.key}
                    onPress={() =>
                      updateFilter(
                        'price',
                        'range',
                        tempFilters.price.range === option.key
                          ? null
                          : option.key,
                      )
                    }
                  />
                ))}
              </View>
            </FilterSection>

            <FilterSection title="Rating" icon="star">
              {RATING_OPTIONS.map(option => (
                <FilterOption
                  key={option.key}
                  title={option.label}
                  isSelected={tempFilters.rating.level === option.key}
                  onPress={() =>
                    updateFilter(
                      'rating',
                      'level',
                      tempFilters.rating.level === option.key
                        ? null
                        : option.key,
                    )
                  }
                  subtitle="Good and above"
                />
              ))}
            </FilterSection>

            <FilterSection title="Nutrition" icon="fitness-center">
              <View className="mb-4">
                <Text className="paragraph-semibold text-gray-200 mb-3">
                  Calories
                </Text>

                {CALORIES_OPTIONS.map(option => (
                  <FilterOption
                    key={option.key}
                    title={option.label}
                    isSelected={tempFilters.nutrition.calories === option.key}
                    onPress={() =>
                      updateFilter(
                        'nutrition',
                        'calories',
                        tempFilters.nutrition.calories === option.key
                          ? null
                          : option.key,
                      )
                    }
                  />
                ))}
              </View>

              <View>
                <Text className="paragraph-semibold text-gray-200 mb-3">
                  Protein
                </Text>

                {PROTEIN_OPTIONS.map(option => (
                  <FilterOption
                    key={option.key}
                    title={option.label}
                    isSelected={tempFilters.nutrition.protein === option.key}
                    onPress={() =>
                      updateFilter(
                        'nutrition',
                        'protein',
                        tempFilters.nutrition.protein === option.key
                          ? null
                          : option.key,
                      )
                    }
                  />
                ))}
              </View>
            </FilterSection>
          </ScrollView>

          <View className="p-6 border-t border-gray-100">
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 py-4 rounded-xl border border-gray-300 flex-center"
                onPress={clearAllFilters}
              >
                <Text className="paragraph-semibold text-gray-200">
                  Clear All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-4 rounded-xl bg-primary flex-center"
                onPress={applyFilters}
              >
                <Text className="paragraph-semibold text-white">
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AdvancedFilters;
