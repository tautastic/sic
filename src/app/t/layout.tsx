import type { ReactNode } from "react";

import { IkarusProvider } from "@/contexts/IkarusProvider";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="space-y-9">
      <IkarusProvider>{children}</IkarusProvider>
    </div>
  );
};

export default Layout;
