import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }
  interface JWT extends DefaultJWT {
    id: string;
    isAdmin: boolean;
  }

  interface User {
    _id: string;
    isAdmin: boolean;
  }
}
