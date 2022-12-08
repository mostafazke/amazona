import Link from 'next/link';
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getError } from '../utils/handle-error';
import { signIn, useSession } from 'next-auth/react';
import FormInput from '../components/FormInput';
import axios from 'axios';

type RegisterInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
function Register() {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push((redirect as string) || '/');
    }
  }, [router, session, redirect]);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterInputs>();

  const handleRegister: SubmitHandler<RegisterInputs> = async ({
    name,
    email,
    password,
  }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Register">
      <form
        className="card mx-auto max-w-screen-md p-4 mt-5"
        onSubmit={handleSubmit(handleRegister)}>
        <h1 className="mb-4 text-xl text-center">Register</h1>
        <FormInput
          label="Name"
          error={errors.name}
          formControl={register('name', {
            required: 'Please enter the Name',
          })}
        />
        <FormInput
          label="Email"
          error={errors.email}
          formControl={register('email', {
            required: 'Email Address is required',
            pattern: {
              value:
                /^([a-zA-Z0-9_\-\\.]+)@([a-zA-Z0-9_\-\\.]+)\.([a-zA-Z]{2,5})$/,
              message: 'Envaild Email',
            },
          })}
        />
        <FormInput
          label="Password"
          fieldType="password"
          error={errors.password}
          formControl={register('password', {
            required: 'Please enter password',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long',
            },
          })}
        />
        <FormInput
          label="Confirm Password"
          fieldType="password"
          error={errors.confirmPassword}
          formControl={register('confirmPassword', {
            required: 'Please enter confirm password',
            validate: (value) => value === getValues('password'),
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters long',
            },
          })}
        />
        {errors.confirmPassword &&
          errors.confirmPassword.type === 'validate' && (
            <p className="text-red-600" role="alert">
              Password do not match
            </p>
          )}
        <div className="mb-4">
          <button className="primary-button rounded" type="submit">
            Register
          </button>
        </div>
        <div className="mb-4">
          <p>
            Already have an account?&nbsp;
            <Link href="/login">Login</Link>
          </p>
        </div>
      </form>
    </Layout>
  );
}

export default Register;
