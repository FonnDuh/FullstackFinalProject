import type { newUserRegister } from "../../interfaces/Users/NewUserRegister";
import type { User } from "../../interfaces/Users/User";

export function normalizedUser(user: newUserRegister): User {
  return {
    name: {
      first: user.first,
      last: user.last,
    },
    email: user.email,
    username: user.username,
    dateOfBirth: user.dateOfBirth,
    password: user.password,
    image: {
      url: user.url ?? "",
      alt: user.alt ?? "",
    },
  };
}
