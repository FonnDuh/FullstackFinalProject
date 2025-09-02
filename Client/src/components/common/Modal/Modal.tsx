import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import "./Modal.css";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content">
          <div className="modal-header">
            {title && (
              <Dialog.Title className="modal-title">{title}</Dialog.Title>
            )}
            <Dialog.Close className="modal-close">
              <X size={20} />
            </Dialog.Close>
          </div>

          {description && (
            <Dialog.Description className="modal-description">
              {description}
            </Dialog.Description>
          )}

          <div className="modal-body">{children}</div>

          {footer && <div className="modal-footer">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
