import React from 'react';

const steps = [
  'User Login',
  'Shipping Address',
  'Payment Method',
  'Place Order',
];
type Props = {
  activeStep: number;
};

function CheckoutWizard({ activeStep = 0 }: Props) {
  return (
    <div className="mb-5 flex flex-wrap">
      {steps.map((step, i) => (
        <div
          key={step}
          className={`flex-1 border-b-2 text-center ${
            i <= activeStep
              ? 'border-indigo-500 text-indigo-500'
              : 'border-gray-400 text-gray-400'
          }`}>
          {step}
        </div>
      ))}
    </div>
  );
}

export default CheckoutWizard;
