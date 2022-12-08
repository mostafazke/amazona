/* eslint-disable no-unused-vars */
import { PaymentMethods } from '../enums';
import { Address, IProduct } from '../models';

export const Add_Cart_Item = '[Cart] Add_Cart_Item';
export const Remove_Cart_Item = '[Cart] Remove_Cart_Item';
export const Change_Cart_Quantity = '[Cart] Change_Cart_Quantity';
export const Cart_Reset = '[Cart] Cart_Reset';
export const Save_Shipping_Addrsss = '[Shipping] Save_Shipping_Addrsss';
export const Save_Payment_Method = '[Shipping] Save_Payment_Method';

export class AddCartItem {
  readonly type = Add_Cart_Item;
  constructor(public payload: IProduct) {}
}
export class RemoveCartItem {
  readonly type = Remove_Cart_Item;
  constructor(public payload: IProduct) {}
}

export class ChangeCartQuantity {
  readonly type = Change_Cart_Quantity;
  constructor(public payload: { slug: string; quantity: number }) {}
}
export class CartReset {
  readonly type = Cart_Reset;
  constructor(public payload?: undefined) {}
}

export class SaveShippingAddrsss {
  readonly type = Save_Shipping_Addrsss;
  constructor(public payload: Address) {}
}
export class SavePaymentMethod {
  readonly type = Save_Payment_Method;
  constructor(public payload: PaymentMethods) {}
}

export type ActionTypes =
  | AddCartItem
  | RemoveCartItem
  | ChangeCartQuantity
  | CartReset
  | SaveShippingAddrsss
  | SavePaymentMethod;
