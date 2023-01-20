import { useState } from "react";
import { Toast } from "../components/Toast/toast";

interface Props extends React.PropsWithChildren {
  timeOpen?: number;
  position?: "tr" | "tl";
}
export function useToast({ timeOpen = 1000, position, children }: Props) {
  const [isOpen, setOpen] = useState<boolean>(true);

  const toast = (
    <Toast isOpen={isOpen} close={() => setOpen(false)} position={position}>
      {children}
    </Toast>
  );
  const showToast = () => {
    setOpen(true);
    setTimeout(() => setOpen(false), timeOpen);
  };
  return { toast, showToast };
}
