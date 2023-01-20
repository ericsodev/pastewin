import { useState } from "react";
import { Toast } from "../components/Toast/toast";

interface Props {
  timeOpen?: number;
  position?: "tr" | "tl";
}
export function useToast({ timeOpen = 2000, position }: Props) {
  const [isOpen, setOpen] = useState<boolean>(false);

  const ToastWrapper = ({ children }: React.PropsWithChildren) => (
    <Toast isOpen={isOpen} position={position}>
      {children}
    </Toast>
  );
  const showToast = () => {
    setOpen(true);
    //   setTimeout(() => {
    //     setOpen(false);
    //   }, timeOpen);
  };
  return { Toast: ToastWrapper, showToast, closeToast: () => setOpen(false) };
}
