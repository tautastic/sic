import { Boundary } from "@/ui/Boundary";

export const IkarusTableLoading = () => {
  return (
    <Boundary labels={["Lade...", "Lade...", "Stand: Lade..."]}>
      <div className="overflow-y-hidden overflow-x-scroll">
        <table className="w-full pl-4 text-sm text-gray-300">
          <thead>
            <tr className={"text-md"}>
              <th className={"p-2"}>Stunde</th>
              <th className={"p-2"}>Zeit</th>
              <th className={"p-2"}>Klassen</th>
              <th className={"p-2"}>Fach</th>
              <th className={"p-2"}>Raum</th>
              <th className={"p-2"}>Lehrkraft</th>
              <th className={"p-2"}>Info</th>
              <th className={"p-2"}>Vertretungstext</th>
            </tr>
          </thead>
          <tbody className="text-center"></tbody>
        </table>
      </div>
    </Boundary>
  );
};
