import type { ReactNode } from "react";

import { TabGroup } from "@/ui/TabGroup";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="space-y-9">
      <div className="flex justify-between">
        <TabGroup />
      </div>
      {children}
    </div>
  );
};

export default Layout;
