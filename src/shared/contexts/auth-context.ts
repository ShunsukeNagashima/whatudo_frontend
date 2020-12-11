import { createContext } from 'react';

interface IAuth {
  isLoggedIn: boolean,
  token: string | null,
  userId: string | null,
  login: (uid: string, token: string, expiratiion?: Date) => void,
  logout: () => void
}

export const AuthContext = createContext<IAuth>({
  isLoggedIn: false,
  token: null,
  userId: null,
  login: () => {},
  logout: () => {}
});