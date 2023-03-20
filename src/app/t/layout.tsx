import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return <div className="space-y-9">{children}</div>;
};

export default Layout;
