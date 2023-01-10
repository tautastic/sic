import type { GlobalNavParent } from "@/lib/types.nav";
import { IkarusGrades } from "@/lib/IkarusGrades";
import { IkarusTeachers } from "@/lib/IkarusTeachers";

export const GlobalNavSections: { name: string; items: GlobalNavParent[] }[] = [
  {
    name: "Jahrgänge",
    items: IkarusGrades,
  },
  {
    name: "Lehrer",
    items: IkarusTeachers,
  },
];
