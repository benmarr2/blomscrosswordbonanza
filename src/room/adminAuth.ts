import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth } from '../firebase';

export async function adminSignIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function adminSignOut(): Promise<void> {
  await signOut(auth);
}

/** True once Firebase resolves a signed-in, non-anonymous user (i.e. the
 * email/password admin account, not one of the app's regular anonymous
 * player sessions). */
export function useAdminAuthState(): { user: User | null; isAdmin: boolean; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  return { user, isAdmin: !!user && !user.isAnonymous, loading };
}
