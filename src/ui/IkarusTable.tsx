"use client";

import { Suspense } from "react";
import { decode } from "html-entities";
import { usePathname } from "next/navigation";

import { Boundary } from "@/ui/Boundary";
import { FormatDate } from "@/lib/utils.ikarus";
import { useIkarus } from "@/contexts/IkarusProvider";
import { IkarusTableLoading } from "@/ui/IkarusTableLoading";

interface IkarusTableProps {
  variant: "Heute" | "Morgen";
}

export const IkarusTable = ({ variant }: IkarusTableProps) => {
  const filter = usePathname()?.split("/").at(1);
  const slug = usePathname()?.split("/").at(-1);
  const { ikarusHeute, ikarusMorgen, isFetching } = useIkarus();
  const ikarusState = variant === "Heute" ? ikarusHeute : ikarusMorgen;

  console.log("filter", filter, "slug", slug);
  const formattedDate = FormatDate(ikarusState.date);
  const tableEntries =
    slug === filter
      ? ikarusState.rows
      : filter === "k" && slug !== undefined
      ? ikarusState.rows.filter((row) => {
          return row.classes.includes(slug);
        })
      : filter === "t" && slug !== undefined
      ? ikarusState.rows.filter((row) => {
          return (
            row.originalTeacher?.includes(slug) ||
            row.substituteTeacher?.includes(slug)
          );
        })
      : [];

  return (
    <Suspense fallback={<IkarusTableLoading />}>
      {isFetching && ikarusState.date === "" ? (
        <IkarusTableLoading />
      ) : (
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
                    <th className="min-w-[64px] p-2">Stunde</th>
                    <th className="min-w-[64px] p-2">Zeit</th>
                    <th className="min-w-[128px] p-2">Klassen</th>
                    <th className="min-w-[64px] p-2">Fach</th>
                    <th className="min-w-[64px] p-2">Raum</th>
                    <th className="min-w-[64px] p-2">Lehrkraft</th>
                    <th className="min-w-[64px] p-2">Info</th>
                    <th className="min-w-[64px] p-2">Vertretungstext</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {tableEntries.map((row) => (
                    <tr key={row.period + row.classes}>
                      <td className="p-2">{decode(row.period)}</td>
                      <td className="p-2">{decode(row.time)}</td>
                      <td className="p-2">{decode(row.classes)}</td>
                      <td className="p-2">{decode(row.subject)}</td>
                      <td className="p-2">{decode(row.room)}</td>
                      <td className="p-2">
                        <span className="font-bold">
                          {decode(row.substituteTeacher)}{" "}
                        </span>
                        {decode(row.originalTeacher)}
                      </td>
                      <td className="p-2">{decode(row.info)}</td>
                      <td className="p-2">{decode(row.text)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="my-6 text-center leading-loose text-gray-400">
                <p>Keine Vertretungen</p>
                <p>&#x1F614;</p>
              </div>
            )}
          </div>
        </Boundary>
      )}
    </Suspense>
  );
};
