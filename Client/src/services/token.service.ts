import { jwtDecode } from "jwt-decode";

export function decodeToken(token: string) {
  return jwtDecode(token as string);
}
