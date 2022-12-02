import Head from 'next/head';
import React from 'react';
import Footer from './Footer';
import Header from './Header';

type Props = {
  children: React.ReactNode;
  title?: string;
};

function Layout({ children, title }: Props) {
  return (
    <>
      <Head>
        <title>{title ? title + ' - Amazona' : 'Amazona'}</title>
        <meta name="description" content="Amazona Ecommerce app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <main className="container m-auto my-4 px-4">{children}</main>
        <Footer />
      </div>
    </>
  );
}

export default Layout;
