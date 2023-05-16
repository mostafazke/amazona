import axios from 'axios';
import { Session } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import FormInput from '../components/FormInput';
import Layout from '../components/Layout';
import { getError } from '../utils/handle-error';

type ProfileScreenInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
function ProfileScreen() {
  const { data: session } = useSession();
  const { user } = session as Session;
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<ProfileScreenInputs>();

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
    }
  }, [user, setValue]);

  const handleProfileScreen: SubmitHandler<ProfileScreenInputs> = async ({
    name,
    email,
    password,
  }) => {
    try {
      await axios.put('/api/auth/update', {
        name,
        email,
        password,
      });
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      toast.success('Profile updated successfully');
      if (result?.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Profile">
      <form
        className="card mx-auto max-w-screen-md p-4 mt-5"
        onSubmit={handleSubmit(handleProfileScreen)}>
        <h1 className="mb-4 text-xl text-center">Update Profile</h1>
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
            Update
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

export default ProfileScreen;
