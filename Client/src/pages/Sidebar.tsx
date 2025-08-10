"use client";
import {
  type ComponentProps,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { motion } from "framer-motion";
import { DesktopSidebar } from "../components/sidebar/DesktopSidebar";
import { MobileSidebar } from "../components/sidebar/MobileSidebar";
import { SidebarProvider } from "../providers/SidebarProvider";

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as ComponentProps<"div">)} />
    </>
  );
};
