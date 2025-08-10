"use client";
import { useState } from "react";
import { Menu, Search, ListChecks, Heart, Info, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sidebar, SidebarBody } from "../../pages/Sidebar";
import { SidebarLink } from "../../components/sidebar/SidebarLink";
import ThemeToggle from "../../components/common/ThemeToggle";
import DualPillLink from "../../components/common/DualPillLink";
import "./Layout.css";
import "../../pages/Sidebar.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(true);

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

  const Logo = () => (
    <a href="/" className="logo">
      <div className="logo-icon" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="logo-text">
        MediaVault
      </motion.span>
    </a>
  );

  const LogoIcon = () => (
    <a href="/" className="logo">
      <div className="logo-icon" />
    </a>
  );

  return (
    <div className="layout">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="sidebar-body">
          <div className="sidebar-main">
            {open ? <Logo /> : <LogoIcon />}
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
            <ThemeToggle />
            {user ? (
              <SidebarLink
                link={{
                  label: "Profile",
                  href: "/profile",
                  icon: <User className="icon" />,
                }}
                as={Link}
              />
            ) : (
              <DualPillLink
                leftHref="/login"
                rightHref="/register"
                leftContent="Login"
                rightContent="Register"
              />
            )}
          </div>
        </SidebarBody>
      </Sidebar>

      <main className="main">{children}</main>
    </div>
  );
}
