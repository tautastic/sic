"use client";

import type { IkarusResponse } from "@/lib/types.ikarus";
import { decode } from "html-entities";
import { useEffect, useState } from "react";
import { DefaultIkarusResponse } from "@/lib/types.ikarus";
import { getCachedIkarusData, setCachedIkarusData } from "@/lib/IkarusCache";
import { Boundary } from "@/ui/Boundary";
import { IkarusTableLoading } from "@/ui/IkarusTableLoading";
import { usePathname } from "next/navigation";

interface IkarusTableProps {
  variant: "Heute" | "Morgen";
}

export const IkarusTable = ({ variant }: IkarusTableProps) => {
  const [ikarusState, setIkarusState] = useState(DefaultIkarusResponse);
  const slug = usePathname()?.split("/").at(-1);

  useEffect(() => {
    const getData = async () => {
      const cachedData: IkarusResponse = getCachedIkarusData(variant);
      if (cachedData.date === "") {
        // Cache is empty so we need to fetch the data
        const fetchedData = await fetch(`/api/IkarusFetch/${variant}`);
        const data: IkarusResponse = await fetchedData.json();
        setCachedIkarusData({ variant, data });
        setIkarusState(data);
      } else {
        // Cache is not empty so we can use the cached data
        if (cachedData.requestTime + 60 * 5000 < Date.now()) {
          // Cache is older than 5 minutes so we need to fetch the data
          const fetchedData = await fetch(`/api/IkarusFetch/${variant}`);
          const data: IkarusResponse = await fetchedData.json();
          setCachedIkarusData({ variant, data });
          setIkarusState(data);
        } else {
          // Cache is not older than 5 minutes so we can use the cached data
          setIkarusState(cachedData);
        }
      }
    };
    getData();
  }, [variant]);

  if (ikarusState.date === "") {
    return <IkarusTableLoading />;
  } else {
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
  }
};
