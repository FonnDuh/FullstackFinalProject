import { type ReactNode } from "react";
import {
  Menu,
  Search,
  ListChecks,
  Info,
  User,
  LogOut,
  LogIn,
  UserPlus2,
} from "lucide-react";

export type NavLink = {
  label: string;
  href: string;
  icon?: ReactNode;
  public?: boolean;
  roles?: string[];
};

export const navLinks: NavLink[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: <Menu className="icon" />,
    public: true,
  },
  {
    label: "Search",
    href: "/search",
    icon: <Search className="icon" />,
    public: true,
  },
  {
    label: "Watchlist",
    href: "/watchlist",
    icon: <ListChecks className="icon" />,
    roles: ["user"],
  },
  {
    label: "About",
    href: "/about",
    icon: <Info className="icon" />,
    public: true,
  },
];

export type UserShape = {
  username?: string;
  role?: string;
  roles?: string[];
} | null;

export function getVisibleLinks(user: UserShape) {
  if (!user) return navLinks.filter((link) => link.public === true);

  const userRole =
    (user && (user.role || (user.roles && user.roles[0]))) || "user";

  return navLinks.filter((link) => {
    if (link.public) return true;
    if (!link.roles || link.roles.length === 0) return true;
    return link.roles.includes(userRole);
  });
}

export const footerLinks = {
  authenticated: [
    { label: "Profile", href: "/profile", icon: <User className="icon" /> },
    { label: "Logout", href: "/", icon: <LogOut className="icon" /> },
  ],
  anonymous: [
    { label: "Login", href: "/login", icon: <LogIn className="icon" /> },
    {
      label: "Register",
      href: "/register",
      icon: <UserPlus2 className="icon" />,
    },
  ],
};

export function getFooterLinks(user: UserShape) {
  return user ? footerLinks.authenticated : footerLinks.anonymous;
}

export default navLinks;
