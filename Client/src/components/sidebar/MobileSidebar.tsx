import { Menu, X } from "lucide-react";
import { useSidebar } from "../../hooks/useSidebar";
import { motion, AnimatePresence } from "framer-motion";

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={`mobile-sidebar-header${className ? " " + className : ""}`}
      {...props}>
      <div className="mobile-sidebar-menu-icon">
        <Menu onClick={() => setOpen(!open)} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={`mobile-sidebar-panel${
              className ? " " + className : ""
            }`}>
            <div
              className="mobile-sidebar-close"
              onClick={() => setOpen(!open)}>
              <X />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
