import type { ReactNode } from "react";

import { TabGroup } from "@/ui/TabGroup";
import { IkarusProvider } from "@/contexts/IkarusProvider";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="space-y-9">
      <div className="flex justify-between">
        <TabGroup />
      </div>

      <IkarusProvider>{children}</IkarusProvider>
    </div>
  );
};

export default Layout;
