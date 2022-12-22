import type { GlobalNavParent } from "@/lib/types.nav";
import { IkarusGrades } from "@/lib/IkarusGrades";

export const GlobalNavSections: { name: string; items: GlobalNavParent[] }[] = [
  {
    name: "Jahrgänge",
    items: IkarusGrades,
  },
];
