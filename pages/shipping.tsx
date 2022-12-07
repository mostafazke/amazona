import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';
import FormInput from '../components/FormInput';
import Layout from '../components/Layout';
import { Address } from '../models';
import { SaveShippingAddrsss } from '../store/Actions';
import { Store } from '../store/Store';

type ShippingInputs = Address;

function Shipping() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { shippingAddress } = state.cart;
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<ShippingInputs>();

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('city', shippingAddress.city);
    setValue('postalCode', shippingAddress.postalCode);
    setValue('country', shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = (payload: Address) => {
    dispatch(new SaveShippingAddrsss(payload));
    router.push('/payment');
  };

  return (
    <Layout title="Shipping">
      <CheckoutWizard activeStep={1} />
      <form
        className="card mx-auto max-w-screen-md p-4 mt-5"
        onSubmit={handleSubmit(submitHandler)}>
        <h1 className="mb-4 text-xl text-center">Shipping Address</h1>
        <FormInput
          label="Full Name"
          error={errors.fullName}
          formControl={register('fullName', {
            required: 'Full Name is required',
          })}
        />
        <FormInput
          label="Address"
          error={errors.address}
          formControl={register('address', {
            required: 'Please enter the Address',
            minLength: {
              value: 3,
              message: 'Address must be at least 3 characters long',
            },
          })}
        />
        <FormInput
          label="City"
          error={errors.city}
          formControl={register('city', {
            required: 'Please enter the City',
          })}
        />
        <FormInput
          label="Postal Code"
          error={errors.postalCode}
          formControl={register('postalCode', {
            required: 'Please enter the Postal Code',
          })}
        />
        <FormInput
          label="Country"
          error={errors.country}
          formControl={register('country', {
            required: 'Please enter the Country',
          })}
        />
        <div className="mb-4 flex justify-between">
          <button className="primary-button rounded" tabIndex={1}>
            Next
          </button>
        </div>
      </form>
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
export default Shipping;
