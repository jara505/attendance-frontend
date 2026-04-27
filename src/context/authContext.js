import { createContext } from 'react';

// Context object lives in its own file so that AuthContext.jsx can comply
// with the `react-refresh/only-export-components` rule.
export const AuthContext = createContext(null);
