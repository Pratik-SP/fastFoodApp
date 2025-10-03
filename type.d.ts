import { Models } from 'react-native-appwrite';

export interface MenuItem extends Models.Document {
  $id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  calories: number;
  protein: number;
  rating: number;
  type: string;
  menuCustomizations: string[];
}

export interface Category extends Models.Document {
  $id: string;
  name: string;
  description: string;
}

export interface Customizations extends Models.Document {
  $id: string;
  name: string;
  price: number;
  type: 'topping' | 'side';
}

export interface User extends Models.Document {
  name: string;
  email: string;
  avatar: string;
  accountId: string;
}

export interface CartCustomization {
  id: string;
  name: string;
  price: number;
  isDefault?: boolean;
}

export interface CartItemType {
  id: string; // menu item id
  cartItemId?: string; // unique id for cart item (menu item id + customizations)
  name: string;
  price: number;
  image_url: string;
  quantity?: number;
  customizations?: CartCustomization[];
}

export interface CartState {
  items: CartItemType[];
}

export interface CartStore {
  items: CartItemType[];
  addItem: (item: Omit<CartItemType, 'cartItemId'>) => void;
  removeItem: (id: string, customizations: CartCustomization[]) => void;
  increaseQty: (id: string, customizations: CartCustomization[]) => void;
  decreaseQty: (id: string, customizations: CartCustomization[]) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export interface TabBarIconProps {
  focused: boolean;
  icon?: ImageSourcePropType;
  title: string;
}

export interface PaymentInfoStripeProps {
  label: string;
  value: string;
  labelStyle?: string;
  valueStyle?: string;
}

export interface CustomButtonProps {
  onPress?: () => void;
  title?: string;
  style?: string;
  leftIcon?: React.ReactNode;
  textStyle?: string;
  isLoading?: boolean;
}

export interface CustomHeaderProps {
  title?: string;
}

export interface CustomInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

export interface ProfileFieldProps {
  label: string;
  value: string;
  icon: ImageSourcePropType;
}

export interface CreateUserParams {
  email: string;
  password: string;
  name: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface GetMenuParams {
  category?: string;
  query?: string;
}

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  ItemDetails: { item: MenuItem };
};

export type TabScreenParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
  Search: { query?: string; category?: string } | undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
