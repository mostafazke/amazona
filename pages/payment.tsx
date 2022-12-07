import { useRouter } from 'next/router';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { PaymentMethods } from '../enums';
import { SavePaymentMethod } from '../store/Actions';
import { Store } from '../store/Store';

function Payment() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethods>(PaymentMethods.Cash);

  useEffect(() => {
    if (!state.cart.shippingAddress.address) {
      router.push('/shipping');
    }
    setSelectedPaymentMethod(state.cart.paymentMethod || PaymentMethods.Cash);
  }, [router, state]);

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error('Payment method required!');
    }
    dispatch(new SavePaymentMethod(selectedPaymentMethod));

    router.push('/placeorder');
  };
  return (
    <Layout title="Payment">
      <CheckoutWizard activeStep={2} />
      <form
        className="card mx-auto max-w-screen-md p-4 mt-5"
        onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl text-center">Payment method</h1>

        {Object.values(PaymentMethods).map((payment) => (
          <div className="mb-4" key={payment}>
            <label>
              <input
                name="paymentMethod"
                type="radio"
                className="p-2 outline-none focus:ring-0 mx-2"
                checked={selectedPaymentMethod === payment}
                onChange={() => setSelectedPaymentMethod(payment)}
              />
              {payment}
            </label>
          </div>
        ))}
        <div className="mb-4 flex justify-between">
          <button
            type="button"
            className="default-button rounded"
            onClick={() => router.push('/shipping')}>
            Back
          </button>
          <button className="primary-button rounded" tabIndex={1}>
            Next
          </button>
        </div>
      </form>
    </Layout>
  );
}

export default Payment;
