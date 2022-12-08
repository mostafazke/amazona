import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { IOrder } from '../../models/Order';
import { formatCurrency } from '../../utils/formatCurrency';
import { getError } from '../../utils/handle-error';

type Action =
  | { type: 'FETCH_REQUEST' }
  | { type: 'FETCH_SUCCESS'; payload: IOrder }
  | { type: 'FETCH_FAIL'; payload: string };

type State = {
  loading: boolean;
  order: IOrder | null;
  error: string;
};
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function OrderScreen() {
  const { query } = useRouter();
  const { id } = query;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: null,
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get<IOrder>(`/api/order/${id}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    if (!order?._id || (order?._id && order._id !== id)) {
      fetchOrder();
    }
  }, [order, id]);

  if (error) {
    return (
      <Layout title="Order">
        <div className="alert-error">{error}</div>
      </Layout>
    );
  }
  if (loading) {
    return (
      <Layout title="Order">
        <div>loading...</div>
      </Layout>
    );
  }
  if (!order) {
    return (
      <Layout title="Order">
        <div>
          Worng Order. <Link href="/">Go shopping</Link>
        </div>
      </Layout>
    );
  }
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  return (
    <Layout title="Order">
      <>
        <h1 className="text-xl font-bold mb-4">Order {order._id}</h1>
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
                {isDelivered ? (
                  <div className="alert-success">
                    Delivered at{deliveredAt.toDateString()}
                  </div>
                ) : (
                  <div className="alert-error">Not delivered</div>
                )}
              </div>
            </div>
            <div className="card min-w-full p-5 font-semibold">
              <header className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Payment Method</h2>
              </header>
              <div className="px-5 pt-4">
                <p>{paymentMethod}</p>
                {isPaid ? (
                  <div className="alert-success">
                    Paid at{paidAt.toDateString()}
                  </div>
                ) : (
                  <div className="alert-error">Not paid</div>
                )}
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
                        <div className="font-semibold text-left">Quantity</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-left">Price</div>
                      </th>
                      <th className="p-2">
                        <div className="font-semibold text-left">Subtotal</div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm divide-y divide-gray-100">
                    {orderItems.map((product) => (
                      <tr key={product.name}>
                        <td className="p-2">
                          <Link href={`/product/${product.name}`}>
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={64}
                              height={64}
                            />
                          </Link>
                        </td>
                        <td className="p-2">
                          <Link href={`/product/${product.name}`}>
                            <div className="font-medium text-gray-800">
                              {product.name}
                            </div>
                          </Link>
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
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
}

export default OrderScreen;
