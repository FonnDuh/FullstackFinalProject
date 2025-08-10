import { useEffect, useState, type FunctionComponent, type ReactNode } from "react";
import type { User } from "../interfaces/Users/User";
import { decodeToken } from "../services/token.service";
import type { CustomJwtPayload } from "../interfaces/Users/CustomJwtPayload";
import { getUserById } from "../services/user.service";
import { AuthContext } from "../context/AuthenticationContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string) => {
    sessionStorage.setItem("token", token);
    const cleanToken = decodeToken(token) as CustomJwtPayload;
    getUserById(cleanToken._id)
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token && token.split(".").length === 3) {
      login(token);
    } else {
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
