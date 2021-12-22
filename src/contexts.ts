import { createContext } from 'react';
import { Networks } from './lib/algo/clients';

export const RootContext = createContext<string>('/');
export const NetworkContext = createContext<Networks>('mainnet');
