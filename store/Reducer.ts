import { Product } from '../models';
import { ActionTypes, Add_Cart_Item,  } from './Actions';

export interface State {
  cart: {
    cartItems: Product[];
  };
}

export const initialState: State = {
  cart: {
    cartItems: [],
  },
};

export const reducer = (
  state: State = initialState,
  { type, payload }: ActionTypes
): State => {
  switch (type) {
    case Add_Cart_Item: {
      const newItem = payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    default:
      return state;
  }
};
