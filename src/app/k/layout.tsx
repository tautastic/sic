import type { ReactNode } from "react";
import { TabGroup } from "@/ui/TabGroup";

const Layout = ({
  params,
  children,
}: {
  params: { cls?: string };
  children: ReactNode;
}) => {
  const grade = params.cls?.replace(/\D/g, "");
  const classes = [
    { id: `${grade}` },
    { id: `${grade}a` },
    { id: `${grade}b` },
    { id: `${grade}c` },
    { id: `${grade}d` },
    { id: `${grade}e` },
    { id: `${grade}f` },
    { id: `${grade}g` },
  ];

  if (grade === "" || grade === undefined) {
    return (
      <div className="my-3">
        <div>{children}</div>
      </div>
    );
  } else {
    return (
      <div className="space-y-9">
        <div className="flex justify-between">
          <TabGroup
            items={[
              ...classes.map((x) => ({
                text: `${x.id}`,
                slug: x.id,
              })),
            ]}
          />
        </div>

        <div>{children}</div>
      </div>
    );
  }
};

export default Layout;
