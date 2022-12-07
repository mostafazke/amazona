import Cookie from 'js-cookie';
import { PaymentMethods } from '../enums';
import { Address, Product } from '../models';
import {
  ActionTypes,
  Add_Cart_Item,
  Cart_Reset,
  Change_Cart_Quantity,
  Remove_Cart_Item,
  Save_Shipping_Addrsss,
} from './Actions';

const cart = Cookie.get('cart');

export interface ICart {
  cartItems: Product[];
  shippingAddress: Address;
  paymentMethod: PaymentMethods;
}
export interface State {
  cart: ICart;
}

export const initialState: State = {
  cart: cart
    ? (JSON.parse(cart) as ICart)
    : {
        cartItems: [],
        paymentMethod: PaymentMethods.Cash,
        shippingAddress: {
          fullName: '',
          address: '',
          city: '',
          country: '',
          postalCode: '',
        },
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
    case Cart_Reset: {
      return { ...state, cart: initialState.cart };
    }
    case Save_Shipping_Addrsss: {
      const cart = {
        ...state.cart,
        shippingAddress: {
          ...state.cart.shippingAddress,
          ...payload,
        },
      };
      Cookie.set('cart', JSON.stringify({ ...cart }));

      return {
        ...state,
        cart,
      };
    }
    default:
      return state;
  }
};
