import { createContext } from 'react';

    interface ContextProps{
      isMenuOpen: boolean;
      //methods
      toogleSideMenu: () => void;
      }


export const UiContext = createContext({} as ContextProps)