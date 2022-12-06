import Cookie from 'js-cookie';
import { Product } from '../models';
import {
  ActionTypes,
  Add_Cart_Item,
  Change_Cart_Quantity,
  Remove_Cart_Item,
} from './Actions';

const cart = Cookie.get('cart');

export interface ICart {
  cartItems: Product[];
}
export interface State {
  cart: ICart;
}

export const initialState: State = {
  cart: cart ? JSON.parse(cart) : { cartItems: [] },
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
        Cookie.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case Remove_Cart_Item: {
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === payload.slug
      );
      if (!existItem) {
        return state;
      }
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug != payload.slug
      );
      Cookie.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case Change_Cart_Quantity: {
      const existItem = state.cart.cartItems.find(
        (item) => item.slug === payload.slug
      );
      if (!existItem) {
        return state;
      }
      const cartItems = state.cart.cartItems.map((item) =>
        item.slug === payload.slug
          ? { ...item, quantity: payload.quantity }
          : item
      );
      Cookie.set('cart', JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }

    default:
      return state;
  }
};