import { signIn, signOut } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions';

export const handleSignIn = () => signIn('google');
export const handleSignOut = () => signOut();

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}
