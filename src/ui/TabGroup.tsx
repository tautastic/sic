"use client";

import { usePathname } from "next/navigation";

import { Tab } from "@/ui/Tab";
import { IkarusGrades } from "@/lib/IkarusGrades";

export const TabGroup = () => {
  const slug = usePathname()?.split("/").at(-1)?.replace(/\D/g, "");
  const filter = IkarusGrades.filter((x) => x.slug === slug);
  const items = filter[0]?.children;
  return (
    <div className="-mt-2 flex flex-wrap items-center">
      {items?.map((item) => {
        return (
          <Tab
            key={item.name + item.slug}
            name={item.name}
            path={item.path}
            slug={item.slug}
            text={item.slug}
          />
        );
      })}
    </div>
  );
};
