import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { StoreProvider } from '../store/Store';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
  'client-id': '',
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <PayPalScriptProvider options={initialOptions} deferLoading={true}>
          {pageProps.protected ? (
            <Auth adminOnly={pageProps.adminOnly}>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </PayPalScriptProvider>
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children, adminOnly }: { children: any; adminOnly: boolean }) {
  const router = useRouter();

  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(
        `/unauthorized?redirect=${router.pathname}&message=login required`
      );
    },
  });

  if (status == 'loading') {
    return <div>Loading...</div>;
  }
  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=admin login required');
  }
  return children;
}
