/* eslint-disable no-unused-vars */
import { Product } from '../models';

export const Add_Cart_Item = '[Cart] Add_Cart_Item';
export const Remove_Cart_Item = '[Cart] Remove_Cart_Item';
export const Change_Cart_Quantity = '[Cart] Change_Cart_Quantity';

export class AddCartItem {
  readonly type = Add_Cart_Item;
  constructor(public payload: Product) {}
}
export class RemoveCartItem {
  readonly type = Remove_Cart_Item;
  constructor(public payload: Product) {}
}

export class ChangeCartQuantity {
  readonly type = Change_Cart_Quantity;
  constructor(public payload: {slug: string, quantity: number}) {}
}

export type ActionTypes = AddCartItem | RemoveCartItem | ChangeCartQuantity;