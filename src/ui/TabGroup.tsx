import type { TabItem } from "@/lib/types.nav";
import { Tab } from "@/ui/Tab";

export const TabGroup = ({ items }: { items: TabItem[] }) => {
  return (
    <div className="-mt-2 flex flex-wrap items-center">
      {items.map((item) => {
        return (
          <Tab
            key={item.path + item.slug}
            path={item.path}
            slug={item.slug}
            text={item.text}
          />
        );
      })}
    </div>
  );
};
