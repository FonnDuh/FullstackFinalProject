import { useContext } from "react";
import { AuthContext } from "../context/AuthenticationContext";

export const useAuth = () => useContext(AuthContext);
