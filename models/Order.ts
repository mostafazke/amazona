import { model, models, Schema, Types } from 'mongoose';
import { Address } from './address.model';

export interface IOrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
}
export interface IOrder {
  user: Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  deliveredAt: Date;
  paidAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isDelivered: { type: Boolean, required: true, default: false },
    isPaid: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    paidAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Order = models.Order || model<IOrder>('Order', orderSchema);
