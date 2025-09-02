"use client";
import { useState } from "react";
import {
  Menu,
  Search,
  ListChecks,
  Heart,
  Info,
  User,
  LogIn,
  UserPlus2,
  Moon,
  SunIcon,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
import { Sidebar, SidebarBody } from "../../pages/Sidebar/Sidebar";
import { SidebarLink } from "../../components/sidebar/SidebarLink";
import ThemeToggle from "../../components/common/ThemeToggle/ThemeToggle";
import "./Layout.css";
import "../../pages/Sidebar/Sidebar.css";
import { useDarkMode } from "../../hooks/useDarkMode";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Dashboard", href: "/", icon: <Menu className="icon" /> },
    { label: "Search", href: "/search", icon: <Search className="icon" /> },
    {
      label: "Watchlist",
      href: "/watchlist",
      icon: <ListChecks className="icon" />,
    },
    {
      label: "Favorites",
      href: "/favorites",
      icon: <Heart className="icon" />,
    },
    { label: "About", href: "/about", icon: <Info className="icon" /> },
  ];

  // const Logo = () => (
  //   <a href="/" className="logo open-logo">
  //     <div className="logo-icon" />
  //     <motion.span
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       className="logo-text">
  //       MediaVault
  //     </motion.span>
  //   </a>
  // );

  // const LogoIcon = () => (
  //   <a href="/" className="logo">
  //     <div className="logo-icon"></div>
  //   </a>
  // );

  return (
    <div className="layout">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className={`sidebar-body ${open ? "active" : ""}`}>
          <div className="sidebar-main">
            {/* {open ? <Logo /> : ""} */}
            <nav className="nav-links">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={{ ...link, icon: link.icon }}
                  as={Link}
                />
              ))}
            </nav>
          </div>

          <div className="sidebar-footer">
            {open ? <ThemeToggle /> : isDarkMode ? <Moon /> : <SunIcon />}

            {user ? (
              <div className="nav-Lins">
                <SidebarLink
                  link={{
                    label: user.username,
                    href: "/profile",
                    icon: <User className="icon" />,
                  }}
                  as={Link}
                />
                <SidebarLink
                  link={{
                    label: "Logout",
                    href: "/",
                    icon: <LogOut className="icon" />,
                  }}
                  as={Link}
                  onClick={() => {
                    logout();
                  }}
                />
              </div>
            ) : (
              <div className="nav-links">
                <SidebarLink
                  link={{
                    label: "Login",
                    href: "/login",
                    icon: <LogIn className="icon" />,
                  }}
                  as={Link}
                />
                <SidebarLink
                  link={{
                    label: "Register",
                    href: "/register",
                    icon: <UserPlus2 className="icon" />,
                  }}
                  as={Link}
                />
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="main">{children}</main>
    </div>
  );
}
