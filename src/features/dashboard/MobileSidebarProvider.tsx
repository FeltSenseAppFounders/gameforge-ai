"use client";

import { createContext, useContext, useState, useCallback } from "react";

type MobileSidebarContextType = {
  open: boolean;
  setOpen: (v: boolean) => void;
  close: () => void;
};

const MobileSidebarContext = createContext<MobileSidebarContextType>({
  open: false,
  setOpen: () => {},
  close: () => {},
});

export const useMobileSidebar = () => useContext(MobileSidebarContext);

export function MobileSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <MobileSidebarContext.Provider value={{ open, setOpen, close }}>
      {children}
    </MobileSidebarContext.Provider>
  );
}
