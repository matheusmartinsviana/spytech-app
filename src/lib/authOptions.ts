import GoogleProvider from 'next-auth/providers/google';
import { findOrCreateUser } from '@/actions/user';
import { GoogleUser } from '@/entities/google-user';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (!profile || !account) {
          console.error('Perfil ou conta ausente:', { profile, account });
          return false;
        }

        const googleUser: GoogleUser = {
          googleId: account.providerAccountId!,
          name: profile.name!,
          email: profile.email!,
        };

        const result = await findOrCreateUser(googleUser);

        if (!result) {
          console.error('Erro ao criar ou encontrar usuário:', googleUser);
          return false;
        }

        console.log('Usuário encontrado ou criado com sucesso:', result);
        return true;
      } catch (error) {
        console.error('Erro ao salvar usuário no banco:', error);
        return false;
      }
    },
  },
};