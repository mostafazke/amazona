import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '../../../models';
import db from '../../../utils/db';

export default NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      // if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      // if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Required email and password');
        }
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });
        await db.disconnect();
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            id: user._id,
            name: user.name,
            email: user.email,
            image: 'f',
            isAdmin: user.isAdmin,
          };
        }
        throw new Error('Invalid email or password');
      },
    }),
  ],
});
