import { createContext, ReactNode, useReducer } from 'react';
import { reducer, initialState, State } from './Reducer';

type ctx = {
  state: State;
  dispatch: any;
};

export const Store = createContext<ctx>({
  state: initialState,
  dispatch: null,
});

type Props = {
  children: ReactNode;
};

export function StoreProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
