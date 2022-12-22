export type Item = {
  name: string;
  path: string;
  description?: string;
};

export const grades: { name: string; items: Item[] }[] = [
  {
    name: "Jahrgänge",
    items: [
      {
        name: "Alle Jahrgänge",
        path: "/k/",
        description: "Infobildschirm für alle Jahrgänge",
      },
      {
        name: "5. Jahrgang",
        path: "/k/5",
        description: "Infobildschirm für den 5. Jahrgang",
      },
      {
        name: "6. Jahrgang",
        path: "/k/6",
        description: "Infobildschirm für den 6. Jahrgang",
      },
      {
        name: "7. Jahrgang",
        path: "/k/7",
        description: "Infobildschirm für den 7. Jahrgang",
      },
      {
        name: "8. Jahrgang",
        path: "/k/8",
        description: "Infobildschirm für den 8. Jahrgang",
      },
      {
        name: "9. Jahrgang",
        path: "/k/9",
        description: "Infobildschirm für den 9. Jahrgang",
      },
      {
        name: "10. Jahrgang",
        path: "/k/10",
        description: "Infobildschirm für den 10. Jahrgang",
      },
      {
        name: "11. Jahrgang",
        path: "/k/11",
        description: "Infobildschirm für den 11. Jahrgang",
      },
      {
        name: "12. Jahrgang",
        path: "/k/12",
        description: "Infobildschirm für den 12. Jahrgang",
      },
    ],
  },
];
