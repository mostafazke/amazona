import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';

import Layout from '../components/Layout';
import { IProduct } from '../models';
import { ChangeCartQuantity, RemoveCartItem } from '../store/Actions';
import { Store } from '../store/Store';
import { formatCurrency } from '../utils/formatCurrency';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';

function Cart() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const total = cart.cartItems.reduce(
    (prev, curr) => prev + (curr.quantity || 1) * curr.price,
    0
  );
  const handleRemoveItem = (product: IProduct) => {
    dispatch(new RemoveCartItem(product));
  };
  const handleChangeQuantity = async ({
    item,
    qty,
  }: {
    item: IProduct;
    qty: string;
  }) => {
    const quantity = +qty;

    const { data } = await axios.get<IProduct>(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry, Product is out of stock.');
      return;
    }

    const paylaod = {
      slug: item.slug,
      quantity: +quantity,
    };
    dispatch(new ChangeCartQuantity(paylaod));
  };

  if (!cart.cartItems.length) {
    return (
      <Layout title="Shopping Cart">
        <div className="py-2">
          No Items in the cart <Link href="/">Back to products</Link>
        </div>
      </Layout>
    );
  }
  return (
    <Layout title="Shopping Cart">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div className="overflow-x-auto md:col-span-3">
          <div className="card min-w-full">
            <header className="px-5 py-4 border-b border-gray-100">
              <div className="font-semibold text-gray-800">Manage Carts</div>
            </header>

            <div className="overflow-x-auto p-3">
              <table className="table-auto w-full">
                <thead className="text-xs uppercase text-gray-400 bg-gray-50">
                  <tr>
                    <th></th>
                    <th className="p-2">
                      <div className="font-semibold text-left">Product</div>
                    </th>
                    <th className="p-2">
                      <div className="font-semibold text-left">Quantity</div>
                    </th>
                    <th className="p-2">
                      <div className="font-semibold text-left">Total</div>
                    </th>
                    <th className="p-2">
                      <div className="font-semibold text-center">Action</div>
                    </th>
                  </tr>
                </thead>

                <tbody className="text-sm divide-y divide-gray-100">
                  {cart.cartItems.map((product) => (
                    <tr key={product.slug}>
                      <td className="p-2">
                        <Link href={`/product/${product.slug}`}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={64}
                            height={64}
                          />
                        </Link>
                      </td>
                      <td className="p-2">
                        <Link href={`/product/${product.slug}`}>
                          <div className="font-medium text-gray-800">
                            {product.name}
                          </div>
                        </Link>
                      </td>
                      <td className="p-2">
                        <div className="text-left">
                          <select
                            value={product.quantity}
                            onChange={(e) =>
                              handleChangeQuantity({
                                item: product,
                                qty: e.target.value,
                              })
                            }>
                            {[...Array(product.countInStock).keys()].map(
                              (i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="text-left font-medium text-green-500">
                          {formatCurrency(
                            (product.quantity || 1) * product.price
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex justify-center">
                          <button onClick={() => handleRemoveItem(product)}>
                            <XCircleIcon className="h-5 w-5 text-blue-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end font-bold space-x-4 text-2xl border-t border-gray-100 px-5 py-4">
              <div>Total</div>
              <div className="text-blue-600">
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2">
              <h4>
                Total (
                {cart.cartItems.reduce((p, c) => (c.quantity || 1) + p, 0)}
                ): {formatCurrency(total)}
              </h4>
            </div>
            <button
              className="primary-button w-full"
              onClick={() => router.push('login?redirect=/shipping')}>
              Check Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Cart), { ssr: false });
