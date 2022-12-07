import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { StoreProvider } from '../store/Store';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        {pageProps.protected ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </StoreProvider>
    </SessionProvider>
  );
}

function Auth({ children }: { children: any }) {
  const router = useRouter();

  const { status } = useSession({
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
  return children;
}
