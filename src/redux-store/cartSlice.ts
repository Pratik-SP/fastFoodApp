import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartCustomization, CartItemType, CartState } from '../../type';

const generateCartItemId = (
  menuItemId: string,
  customizations: CartCustomization[] = [],
) => {
  if (!customizations.length) return menuItemId;

  const ids = customizations
    .map(c => c.id)
    .sort((a, b) => a.localeCompare(b))
    .join('-');

  return `${menuItemId}_${ids}`;
};

const areCustomizationsEqual = (
  a: CartCustomization[] = [],
  b: CartCustomization[] = [],
) => {
  if (a.length !== b.length) return false;

  const sortedA = [...a].sort((x, y) => x.id.localeCompare(y.id));
  const sortedB = [...b].sort((x, y) => x.id.localeCompare(y.id));

  return sortedA.every((item, idx) => item.id === sortedB[idx].id);
};

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItemType>) => {
      const item = action.payload;
      const customizations = item.customizations ?? [];
      const cartItemId = generateCartItemId(item.id, customizations);

      const existing = state.items.find(
        i =>
          i.cartItemId === cartItemId &&
          areCustomizationsEqual(i.customizations ?? [], customizations),
      );

      if (existing) {
        existing.quantity = (existing.quantity ?? 0) + (item.quantity ?? 1);
      } else {
        state.items.push({
          ...item,
          cartItemId,
          quantity: item.quantity ?? 1,
          customizations,
        });
      }
    },

    removeItem: (
      state,
      action: PayloadAction<{
        id: string;
        customizations?: CartCustomization[];
      }>,
    ) => {
      const { id, customizations = [] } = action.payload;
      const cartItemId = generateCartItemId(id, customizations);

      state.items = state.items.filter(
        i =>
          !(
            i.cartItemId === cartItemId &&
            areCustomizationsEqual(i.customizations ?? [], customizations)
          ),
      );
    },

    increaseQty: (
      state,
      action: PayloadAction<{
        id: string;
        customizations?: CartCustomization[];
      }>,
    ) => {
      const { id, customizations = [] } = action.payload;
      const cartItemId = generateCartItemId(id, customizations);

      const existing = state.items.find(
        i =>
          i.cartItemId === cartItemId &&
          areCustomizationsEqual(i.customizations ?? [], customizations),
      );

      if (existing) existing.quantity = (existing.quantity ?? 0) + 1;
    },

    decreaseQty: (
      state,
      action: PayloadAction<{
        id: string;
        customizations: CartCustomization[];
      }>,
    ) => {
      const { id, customizations = [] } = action.payload;
      const cartItemId = generateCartItemId(id, customizations);

      const existing = state.items.find(
        i =>
          i.cartItemId === cartItemId &&
          areCustomizationsEqual(i.customizations ?? [], customizations),
      );
      if (existing) {
        existing.quantity = (existing.quantity ?? 0) - 1;
        if ((existing.quantity ?? 0) <= 0) {
          state.items = state.items.filter(i => i.cartItemId !== cartItemId);
        }
      }
    },

    clearCart: state => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, increaseQty, decreaseQty, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectTotalItems = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

export const selectTotalPrice = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => {
    const customPrice =
      item.customizations?.reduce(
        (s, c) => (!c.isDefault ? s + c.price : s),
        0,
      ) ?? 0;
    return total + (item.quantity ?? 0) * (item.price + customPrice);
  }, 0);
