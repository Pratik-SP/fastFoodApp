/* eslint-disable react/no-unstable-nested-components */
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
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

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

  const updateFilter = (
    category: keyof FilterState,
    key: string,
    value: any,
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

  const FilterSection: React.FC<{
    title: string;
    icon: string;
    children: React.ReactNode;
  }> = ({ title, icon, children }) => (
    <View className="mb-8">
      <View className="flex-row items-center mb-4">
        <Icon name={icon} size={24} color="#FE8C00" />
        <Text className="h3-bold text-dark-200 ml-2">{title}</Text>
      </View>
      {children}
    </View>
  );

  const FilterOption: React.FC<{
    title: string;
    isSelected: boolean;
    onPress: () => void;
    subtitle?: string;
  }> = ({ title, isSelected, onPress, subtitle }) => (
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
                <FilterOption
                  title="Price: High to Low"
                  isSelected={tempFilters.price.sort === 'high-to-low'}
                  onPress={() =>
                    updateFilter(
                      'price',
                      'sort',
                      tempFilters.price.sort === 'high-to-low'
                        ? null
                        : 'high-to-low',
                    )
                  }
                />

                <FilterOption
                  title="Price: Low to High"
                  isSelected={tempFilters.price.sort === 'low-to-high'}
                  onPress={() =>
                    updateFilter(
                      'price',
                      'sort',
                      tempFilters.price.sort === 'low-to-high'
                        ? null
                        : 'low-to-high',
                    )
                  }
                />
              </View>

              <View>
                <Text className="paragraph-semibold text-gray-200 mb-3">
                  Price Range
                </Text>

                <FilterOption
                  title="Under $20"
                  isSelected={tempFilters.price.range === 'under-20'}
                  onPress={() =>
                    updateFilter(
                      'price',
                      'range',
                      tempFilters.price.range === 'under-20'
                        ? null
                        : 'under-20',
                    )
                  }
                />
                <FilterOption
                  title="Under $25"
                  isSelected={tempFilters.price.range === 'under-25'}
                  onPress={() =>
                    updateFilter(
                      'price',
                      'range',
                      tempFilters.price.range === 'under-25'
                        ? null
                        : 'under-25',
                    )
                  }
                />
                <FilterOption
                  title="Under $30"
                  isSelected={tempFilters.price.range === 'under-30'}
                  onPress={() =>
                    updateFilter(
                      'price',
                      'range',
                      tempFilters.price.range === 'under-30'
                        ? null
                        : 'under-30',
                    )
                  }
                />
                <FilterOption
                  title="$30+"
                  isSelected={tempFilters.price.range === '30-plus'}
                  onPress={() =>
                    updateFilter(
                      'price',
                      'range',
                      tempFilters.price.range === '30-plus' ? null : '30-plus',
                    )
                  }
                />
              </View>
            </FilterSection>

            <FilterSection title="Rating" icon="star">
              <FilterOption
                title="3+ Stars"
                isSelected={tempFilters.rating.level === '3-plus'}
                onPress={() =>
                  updateFilter(
                    'rating',
                    'level',
                    tempFilters.rating.level === '3-plus' ? null : '3-plus',
                  )
                }
                subtitle="Good and above"
              />
              <FilterOption
                title="4+ Stars"
                isSelected={tempFilters.rating.level === '4-plus'}
                onPress={() =>
                  updateFilter(
                    'rating',
                    'level',
                    tempFilters.rating.level === '4-plus' ? null : '4-plus',
                  )
                }
                subtitle="Very good and above"
              />
              <FilterOption
                title="4.5+ Stars"
                isSelected={tempFilters.rating.level === '4.5-plus'}
                onPress={() =>
                  updateFilter(
                    'rating',
                    'level',
                    tempFilters.rating.level === '4.5-plus' ? null : '4.5-plus',
                  )
                }
                subtitle="Top Rated"
              />
            </FilterSection>

            <FilterSection title="Nutrition" icon="fitness-center">
              <View className="mb-4">
                <Text className="paragraph-semibold text-gray-200 mb-3">
                  Calories
                </Text>

                <FilterOption
                  title="400 - 500 calories"
                  isSelected={tempFilters.nutrition.calories === '400-500'}
                  onPress={() =>
                    updateFilter(
                      'nutrition',
                      'calories',
                      tempFilters.nutrition.calories === '400-500'
                        ? null
                        : '400-500',
                    )
                  }
                />

                <FilterOption
                  title="500 - 600 calories"
                  isSelected={tempFilters.nutrition.calories === '500-600'}
                  onPress={() =>
                    updateFilter(
                      'nutrition',
                      'calories',
                      tempFilters.nutrition.calories === '500-600'
                        ? null
                        : '500-600',
                    )
                  }
                />

                <FilterOption
                  title="600 - 650 calories"
                  isSelected={tempFilters.nutrition.calories === '600-650'}
                  onPress={() =>
                    updateFilter(
                      'nutrition',
                      'calories',
                      tempFilters.nutrition.calories === '600-650'
                        ? null
                        : '600-650',
                    )
                  }
                />

                <FilterOption
                  title="700+ calories"
                  isSelected={tempFilters.nutrition.calories === '700-plus'}
                  onPress={() =>
                    updateFilter(
                      'nutrition',
                      'calories',
                      tempFilters.nutrition.calories === '700-plus'
                        ? null
                        : '700-plus',
                    )
                  }
                />
              </View>
              <View>
                <Text className="paragraph-semibold text-gray-200 mb-3">
                  Protein
                </Text>

                <FilterOption
                  title="under 20g"
                  isSelected={tempFilters.nutrition.protein === 'under-20'}
                  onPress={() =>
                    updateFilter(
                      'nutrition',
                      'protein',
                      tempFilters.nutrition.protein === 'under-20'
                        ? null
                        : 'under-20',
                    )
                  }
                />

                <FilterOption
                  title="20 - 25g"
                  isSelected={tempFilters.nutrition.protein === '20-25'}
                  onPress={() =>
                    updateFilter(
                      'nutrition',
                      'protein',
                      tempFilters.nutrition.protein === '20-25'
                        ? null
                        : '20-25',
                    )
                  }
                />

                <FilterOption
                  title="25 - 30g"
                  isSelected={tempFilters.nutrition.protein === '25-30'}
                  onPress={() =>
                    updateFilter(
                      'nutrition',
                      'protein',
                      tempFilters.nutrition.protein === '25-30'
                        ? null
                        : '25-30',
                    )
                  }
                />

                <FilterOption
                  title="30 - 35g"
                  isSelected={tempFilters.nutrition.protein === '30-35'}
                  onPress={() =>
                    updateFilter(
                      'nutrition',
                      'protein',
                      tempFilters.nutrition.protein === '30-35'
                        ? null
                        : '30-35',
                    )
                  }
                />

                <FilterOption
                  title="above 35g"
                  isSelected={tempFilters.nutrition.protein === '35-plus'}
                  onPress={() =>
                    updateFilter(
                      'nutrition',
                      'protein',
                      tempFilters.nutrition.protein === '35-plus'
                        ? null
                        : '35-plus',
                    )
                  }
                />
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
