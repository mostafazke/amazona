/* eslint-disable no-unused-vars */
import { Product } from '../models';

export const Add_Cart_Item = '[Cart] Add_Cart_Item';

export class AddCartItem {
  readonly type = Add_Cart_Item;
  constructor(public payload: Product) {}
}

export type ActionTypes = AddCartItem;
