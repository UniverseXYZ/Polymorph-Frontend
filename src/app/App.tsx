import React from 'react';

import { Theme } from './theme';

interface IAppProps {
  children: React.ReactNode;
}
export const App = ({ children }: IAppProps) => <Theme>{children}</Theme>;
