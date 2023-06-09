import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../components/Layout';

function Unauthorized() {
  const { query } = useRouter();
  const { message, redirect } = query;
  return (
    <Layout title="Unauthorized">
      <div className="text-center mt-5">
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p className="mb-4 text-red-500">{message}</p>
        <Link href={`/login?redirect=${redirect}`}>Go to login page</Link>
      </div>
    </Layout>
  );
}

export default Unauthorized;
