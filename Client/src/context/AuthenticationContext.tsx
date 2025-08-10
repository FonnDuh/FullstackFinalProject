import { createContext } from "react";
import type { User } from "../interfaces/Users/User";

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export { AuthContext };
