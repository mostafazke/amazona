import axios from 'axios';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { CartReset } from '../store/Actions';
import { Store } from '../store/Store';
import { formatCurrency } from '../utils/formatCurrency';
import { getError } from '../utils/handle-error';
import { round2 } from '../utils/round2';

function Placeorder() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, paymentMethod, shippingAddress } = cart;
  const [loading, setLoading] = useState(false);
  const total = cart.cartItems.reduce(
    (prev, curr) => prev + (curr.quantity || 1) * curr.price,
    0
  );
  const itemsPrice = round2(total);
  const taxPrice = round2(itemsPrice * 0.14);
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [paymentMethod, router]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/order', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);

      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      dispatch(new CartReset());
      router.push(`/order/${data._id}`);
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3} />
      {cartItems.length === 0 ? (
        <div>
          Cart is M T. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <>
          <h1 className="text-lx font-bold mb-4">Place Order</h1>
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="card min-w-full p-5 font-semibold">
                <header className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800">
                    Shipping Address
                  </h2>
                </header>
                <div className="px-5 pt-4">
                  <p>
                    {shippingAddress.fullName},{shippingAddress.address},{' '}
                    {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                    {shippingAddress.country}
                  </p>
                  <Link href="/shipping">Edit</Link>
                </div>
              </div>
              <div className="card min-w-full p-5 font-semibold">
                <header className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800">
                    Payment Method
                  </h2>
                </header>
                <div className="px-5 pt-4">
                  <p>{paymentMethod}</p>
                  <Link href="/payment">Edit</Link>
                </div>
              </div>
              <div className="card min-w-full p-5 font-semibold">
                <header className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800">Order items</h2>
                </header>
                <div className="overflow-x-autod">
                  <table className="table-auto w-full">
                    <thead className="text-xs uppercase text-gray-400 bg-gray-50">
                      <tr>
                        <th></th>
                        <th className="p-2">
                          <div className="font-semibold text-left">Product</div>
                        </th>
                        <th className="p-2">
                          <div className="font-semibold text-left">
                            Quantity
                          </div>
                        </th>
                        <th className="p-2">
                          <div className="font-semibold text-left">Price</div>
                        </th>
                        <th className="p-2">
                          <div className="font-semibold text-left">
                            Subtotal
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="text-sm divide-y divide-gray-100">
                      {cartItems.map((product) => (
                        <tr key={product.slug}>
                          <td className="p-2">
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={64}
                              height={64}
                            />
                          </td>
                          <td className="p-2">
                            <div className="font-medium text-gray-800">
                              {product.name}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="text-left">{product.quantity}</div>
                          </td>
                          <td className="p-2">
                            <div className="text-left font-medium text-green-500">
                              {formatCurrency(product.price)}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="text-left font-medium text-green-500">
                              {formatCurrency(
                                (product.quantity || 1) * product.price
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Link href="/cart">Edit</Link>
              </div>
            </div>
            <div>
              <div className="card p-5">
                <div className="mb-2">
                  <h4 className="text-lg font-bold mb-3">Order Summary</h4>
                  <p className="flex justify-between mb-2">
                    <span>Items</span>
                    <span>{formatCurrency(itemsPrice)}</span>
                  </p>
                  <p className="flex justify-between mb-2">
                    <span>Tax</span>
                    <span>{formatCurrency(taxPrice)}</span>
                  </p>
                  <p className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>{formatCurrency(shippingPrice)}</span>
                  </p>
                  <p className="flex justify-between mb-2 font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </p>
                </div>
                <button
                  className="primary-button w-full"
                  disabled={loading}
                  onClick={placeOrderHandler}>
                  {loading ? 'Loading...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  };
}
export default Placeorder;
