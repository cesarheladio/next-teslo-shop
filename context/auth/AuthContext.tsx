import { createContext } from 'react';
import { IUser } from '../../interfaces';

    interface ContextProps{
      isLoggedIn: boolean;
      user?:IUser
      
      registerUser: (name: string, email: string, password: string) => Promise<{
        hasError: boolean;
        message?: string;        
       }>
      logOut: () => void
      loginUser: (email: string, password: string) => Promise<boolean>
      }


export const AuthContext = createContext({} as ContextProps)