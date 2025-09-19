import { create } from 'zustand';
import { CartCustomization, CartStore } from '../../type';

const geerateCartItemId = (
  menuItemId: string,
  customizations: CartCustomization[] = [],
): string => {
  if (!customizations.length) return menuItemId;

  const custumizationIds = customizations
    .map(c => c.id)
    .sort((a, b) => a.localeCompare(b))
    .join('-');

  return `${menuItemId}_${custumizationIds}`;
};

function areCustomizationsEqual(
  a: CartCustomization[] = [],
  b: CartCustomization[] = [],
): boolean {
  if (a.length !== b.length) return false;

  const aSorted = [...a].sort((x, y) => x.id.localeCompare(y.id));
  const bSorted = [...b].sort((x, y) => x.id.localeCompare(y.id));

  return aSorted.every((item, idx) => item.id === bSorted[idx].id);
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: item => {
    const customizations = item.customizations ?? [];
    const cartItemId = geerateCartItemId(item.id, customizations);

    const existing = get().items.find(
      i =>
        i.cartItemId === cartItemId &&
        areCustomizationsEqual(i.customizations ?? [], customizations),
    );

    if (existing) {
      set({
        items: get().items.map(i =>
          i.cartItemId === cartItemId &&
          areCustomizationsEqual(i.customizations ?? [], customizations)
            ? { ...i, quantity: (i.quantity ?? 0) + (item.quantity ?? 1) }
            : i,
        ),
      });
    } else {
      set({
        items: [
          ...get().items,
          { ...item, cartItemId, quantity: item.quantity ?? 1, customizations },
        ],
      });
    }
  },

  removeItem: (menuItemId, customizations = []) => {
    const cartItemId = geerateCartItemId(menuItemId, customizations);
    set({
      items: get().items.filter(
        i =>
          !(
            i.cartItemId === cartItemId &&
            areCustomizationsEqual(i.customizations ?? [], customizations)
          ),
      ),
    });
  },

  increaseQty: (menuItemId, customizations = []) => {
    const cartItemId = geerateCartItemId(menuItemId, customizations);
    set({
      items: get().items.map(i =>
        i.cartItemId === cartItemId &&
        areCustomizationsEqual(i.customizations ?? [], customizations)
          ? { ...i, quantity: (i.quantity ?? 0) + 1 }
          : i,
      ),
    });
  },

  decreaseQty: (menuItemId, customizations = []) => {
    const cartItemId = geerateCartItemId(menuItemId, customizations);
    set({
      items: get()
        .items.map(i =>
          i.cartItemId === cartItemId &&
          areCustomizationsEqual(i.customizations ?? [], customizations)
            ? { ...i, quantity: (i.quantity ?? 0) - 1 }
            : i,
        )
        .filter(i => (i.quantity ?? 0) > 0),
    });
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () =>
    get().items.reduce((total, item) => total + (item.quantity ?? 0), 0),

  getTotalPrice: () =>
    get().items.reduce((total, item) => {
      const base = item.price;
      const customPrice =
        item.customizations?.reduce(
          (s: number, c: CartCustomization & { isDefault?: boolean }) =>
            !c.isDefault ? s + c.price : s,
          0,
        ) ?? 0;
      return total + (item.quantity ?? 0) * (base + customPrice);
    }, 0),
}));
