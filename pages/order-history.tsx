import axios from 'axios';
import Link from 'next/link';
import { useEffect, useReducer } from 'react';
import Layout from '../components/Layout';
import { IOrder } from '../models/Order';
import { formatCurrency } from '../utils/formatCurrency';
import { getError } from '../utils/handle-error';

type Action =
  | { type: 'FETCH_REQUEST' }
  | { type: 'FETCH_SUCCESS'; payload: IOrder[] }
  | { type: 'FETCH_FAIL'; payload: string };

type State = {
  loading: boolean;
  orders: IOrder[];
  error: string;
};
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function OrderHistory() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <Layout title="Order History">
      <h1 className="text-xl font-bold mb-4">Order History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="card min-w-full">
          <div className="overflow-x-auto p-3">
            <table className="table-auto w-full">
              <thead className="text-xs uppercase text-gray-400 bg-gray-50">
                <tr>
                  <th className="p-2">
                    <div className="font-semibold text-left">ID</div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-left">Date</div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-left">Total</div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-left">Paid</div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-left">Delivered</div>
                  </th>
                  <th className="p-2">
                    <div className="font-semibold text-center">Action</div>
                  </th>
                </tr>
              </thead>

              <tbody className="text-sm divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-2">{order._id.substring(20, 24)}</td>
                    <td className="p-2">
                      {new Date(order.createdAt).toDateString()}
                    </td>
                    <td className="p-2">{formatCurrency(order.totalPrice)}</td>
                    <td className="p-2">
                      {order.isPaid ? (
                        <div>
                          Paid at {new Date(order.paidAt).toDateString()}
                        </div>
                      ) : (
                        'Not Paid'
                      )}
                    </td>
                    <td className="p-2">
                      {order.isDelivered ? (
                        <div>
                          Delivered at
                          {new Date(order.deliveredAt).toDateString()}
                        </div>
                      ) : (
                        'Not Delivered'
                      )}
                    </td>
                    <td className="p-2">
                      <div className="flex justify-center">
                        <Link href={`/order/${order._id}`}>Details</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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

export default OrderHistory;
