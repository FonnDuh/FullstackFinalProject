"use client";
import { useState, useMemo, type ReactNode } from "react";
import { Moon, SunIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getVisibleLinks } from "../../config/navigation";
import { Link } from "react-router-dom";
import { Sidebar, SidebarBody } from "../../pages/Sidebar/Sidebar";
import { SidebarLink } from "../../components/sidebar/SidebarLink";
import ThemeToggle from "../../components/common/ThemeToggle/ThemeToggle";
import { getFooterLinks } from "../../config/navigation";
import "./Layout.css";
import "../../pages/Sidebar/Sidebar.css";
import { useDarkMode } from "../../hooks/useDarkMode";
import { Modal } from "../../components/common/Modal/Modal";

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [open, setOpen] = useState(false);

  const links = useMemo(() => getVisibleLinks(user), [user]);
  const footerLinks = useMemo(() => getFooterLinks(user), [user]);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className={`sidebar-body ${open ? "active" : ""}`}>
          <div className="sidebar-main">
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

            <div className="nav-links">
              {footerLinks.map((f, i) => {
                if (f.label === "Logout") {
                  return (
                    <SidebarLink
                      key={i}
                      link={{ label: f.label, href: f.href, icon: f.icon }}
                      as={Link}
                      onClick={(e) => {
                        e.preventDefault();
                        setLogoutModalOpen(true);
                      }}
                    />
                  );
                }

                if (f.label === "Profile" && user) {
                  return (
                    <SidebarLink
                      key={i}
                      link={{
                        label: user.username || "Profile",
                        href: f.href,
                        icon: f.icon,
                      }}
                      as={Link}
                    />
                  );
                }

                return (
                  <SidebarLink
                    key={i}
                    link={{ label: f.label, href: f.href, icon: f.icon }}
                    as={Link}
                  />
                );
              })}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <Modal
        open={logoutModalOpen}
        onOpenChange={(v) => setLogoutModalOpen(v)}
        title="Confirm logout"
        description="Are you sure you want to sign out?"
        footer={
          <div className="modal-footer">
            <button
              className="modal-cancel"
              onClick={() => setLogoutModalOpen(false)}>
              Cancel
            </button>
            <button
              className="modal-confirm"
              onClick={() => {
                setLogoutModalOpen(false);
                logout();
              }}>
              Sign out
            </button>
          </div>
        }>
        <p>You will be signed out of your account.</p>
      </Modal>

      <main className="main">{children}</main>
    </div>
  );
}
