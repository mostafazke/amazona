import React from 'react';
import { FieldError,  UseFormRegisterReturn } from 'react-hook-form';

type Props = {
  fieldType?: string;
  label: string;
  formControl: UseFormRegisterReturn<any>;
  error: FieldError | undefined;
};

function FormInput({ fieldType = 'text', label, formControl, error }: Props) {
  return (
    <div className="mb-4">
      <label
        htmlFor={label}
        className="block mb-2 text-sm font-bold text-gray-700">
        {label}
      </label>
      <input
        className="border rounded w-full px-3 py-2 text-sm leading-tight text-gray-700 shadow appearance-none"
        type={fieldType}
        {...formControl}
        aria-invalid={error ? 'true' : 'false'}
        id={label}
        tabIndex={1}
      />
      {error && (
        <p className="text-red-600" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default FormInput;
