import { createContext } from 'react';
import { IProject } from '../interfaces/shared-interfaces';

interface IAuth {
  isLoggedIn: boolean,
  token: string | null,
  userId: string | null,
  login: (uid: string, token: string, projects: IProject[], expiratiion?: Date) => void,
  logout: () => void
}

export const AuthContext = createContext<IAuth>({
  isLoggedIn: false,
  token: null,
  userId: null,
  login: () => {},
  logout: () => {}
});