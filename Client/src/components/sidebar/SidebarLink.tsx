import { useSidebar } from "../../hooks/useSidebar";
import { motion } from "framer-motion";
import React from "react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

type SidebarLinkProps = {
  link: Links;
  className?: string;
  as?: React.ElementType; // for custom component like React Router Link
} & React.ComponentPropsWithoutRef<"a">;

export const SidebarLink = ({
  link,
  className,
  as: Component = "link",
  ...props
}: SidebarLinkProps) => {
  const { open, animate } = useSidebar();

  return (
    <Component
      to={link.href}
      className={`sidebar-link${className ? " " + className : ""}`}
      {...props}>
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="sidebar-link-label">
        {link.label}
      </motion.span>
    </Component>
  );
};
