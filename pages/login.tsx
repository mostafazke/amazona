import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';

type LoginInputs = {
  email: string;
  password: string;
};
function Login() {
  const {query} = useRouter();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const handleLogin: SubmitHandler<LoginInputs> = ({ email, password }) => {
    console.log({ email, password });
    if (query.redirect) {
      router.push(query.redirect as string);
    }
  };

  return (
    <Layout title="Login">
      <form
        className="card mx-auto max-w-screen-md p-4 mt-5"
        onSubmit={handleSubmit(handleLogin)}>
        <h1 className="mb-4 text-xl text-center">Login</h1>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-bold text-gray-700">
            Email
          </label>
          <input
            className="border rounded w-full px-3 py-2 text-sm leading-tight text-gray-700 shadow appearance-none"
            type="email"
            {...register('email', { required: 'Email Address is required', pattern: {
              value: /^([a-zA-Z0-9_\-\\.]+)@([a-zA-Z0-9_\-\\.]+)\.([a-zA-Z]{2,5})$/,
              message: 'Envaild Email'

            } })}
            aria-invalid={errors.email ? 'true' : 'false'}
            id="email"
            tabIndex={1}
          />
          {errors.email && (
            <p className="text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-bold text-gray-700">
            Password
          </label>
          <input
            className="border rounded w-full px-3 py-2 text-sm leading-tight text-gray-700 shadow appearance-none"
            type="password"
            {...register('password', { required: 'Please enter password' ,
          minLength:{
            value: 6,
            message: 'Password must be at least 6 characters long'
          }})}
            aria-invalid={errors.password ? 'true' : 'false'}
            id="password"
            tabIndex={1}
          />
          {errors.password && (
            <p className="text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button rounded" type="submit" tabIndex={1}>
            Login
          </button>
        </div>
        <div className="mb-4">
          <p>
            Don&apos;t have an account?&nbsp;
            <Link href="/register">Register</Link>
          </p>
        </div>
      </form>
    </Layout>
  );
}

export default Login;
