"use client";

import type { IkarusResponse } from "@/lib/types.ikarus";
import { decode } from "html-entities";
import { useEffect, useState } from "react";
import { DefaultIkarusResponse } from "@/lib/types.ikarus";
import { getCachedIkarusData, setCachedIkarusData } from "@/lib/IkarusCache";
import { Boundary } from "@/ui/Boundary";
import { usePathname, useRouter } from "next/navigation";

interface IkarusTableProps {
  variant: "Heute" | "Morgen";
  fetchedData: IkarusResponse;
}
const IkarusTable = ({ variant, fetchedData }: IkarusTableProps) => {
  const [ikarusState, setIkarusState] = useState(DefaultIkarusResponse);
  const router = useRouter();
  const slug = usePathname()?.split("/").at(-1);

  useEffect(() => {
    const cachedData = getCachedIkarusData(variant);
    if (fetchedData.date === "" && cachedData.date === "") {
      // If both data and cachedData are empty, we need to fetch the data again
      router.refresh();
    } else if (fetchedData.date === "") {
      // If data is empty, but cachedData is not, we use the cachedData
      setIkarusState(cachedData);
    } else {
      // If data is not empty, we use the data
      setIkarusState(fetchedData);
      if (fetchedData.lastUpdate !== cachedData.lastUpdate) {
        // If the data is not the same as the cachedData, we cache the data
        setCachedIkarusData({ variant, data: fetchedData });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedData]);

  return (
    <Boundary labels={[`${variant}`, `Stand: ${ikarusState.lastUpdate}`]}>
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
          <tbody className="text-center">
            {ikarusState.rows.map((x, idx) => {
              if (
                slug === "k" ||
                (slug !== undefined && x.classes.includes(slug))
              ) {
                return (
                  <tr key={idx}>
                    <td className={"p-2"}>{decode(x.period)}</td>
                    <td className={"p-2"}>{decode(x.time)}</td>
                    <td className={"p-2"}>{decode(x.classes)}</td>
                    <td className={"p-2"}>{decode(x.subject)}</td>
                    <td className={"p-2"}>{decode(x.room)}</td>
                    <td className={"p-2"}>
                      <span className="font-bold">
                        {decode(x.substituteTeacher)}{" "}
                      </span>
                      {decode(x.originalTeacher)}
                    </td>
                    <td className={"p-2"}>{decode(x.info)}</td>
                    <td className={"p-2"}>{decode(x.text)}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </Boundary>
  );
};

export default IkarusTable;
