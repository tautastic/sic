"use client";

import { decode } from "html-entities";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { IkarusResponse } from "@/lib/types.ikarus";
import { getCachedIkarusData, setCachedIkarusData } from "@/lib/IkarusCache";
import { DefaultIkarusResponse } from "@/lib/types.ikarus";
import { Boundary } from "@/ui/Boundary";
import { IkarusTableLoading } from "@/ui/IkarusTableLoading";

const formatDate = (date: string) => {
  return new Date(
    date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8)
  ).toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

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

  if (ikarusState.date !== "") {
    const formattedDate = formatDate(ikarusState.date);
    const tableEntries: JSX.Element[] = [];

    for (const row of ikarusState.rows) {
      if (slug === "k" || (slug !== undefined && row.classes.includes(slug))) {
        tableEntries.push(
          <tr>
            <td className={"p-2"}>{decode(row.period)}</td>
            <td className={"p-2"}>{decode(row.time)}</td>
            <td className={"p-2"}>{decode(row.classes)}</td>
            <td className={"p-2"}>{decode(row.subject)}</td>
            <td className={"p-2"}>{decode(row.room)}</td>
            <td className={"p-2"}>
              <span className="font-bold">
                {decode(row.substituteTeacher)}{" "}
              </span>
              {decode(row.originalTeacher)}
            </td>
            <td className={"p-2"}>{decode(row.info)}</td>
            <td className={"p-2"}>{decode(row.text)}</td>
          </tr>
        );
      }
    }

    return (
      <Boundary
        labels={[
          `${variant}`,
          `${formattedDate}`,
          `Stand: ${ikarusState.lastUpdate}`,
        ]}>
        <div className="overflow-y-hidden overflow-x-scroll">
          {tableEntries.length > 0 ? (
            <table className="w-full text-sm text-gray-300">
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
              <tbody className="text-center">{...tableEntries}</tbody>
            </table>
          ) : (
            <div className="my-6 text-center leading-loose text-gray-400">
              <p>Keine Vertretungen</p>
              <p>&#x1F614;</p>
            </div>
          )}
        </div>
      </Boundary>
    );
  } else {
    return <IkarusTableLoading />;
  }
};
