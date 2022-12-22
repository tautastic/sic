"use client";

import type { IkarusResponse } from "@/lib/types.ikarus";
import { DefaultIkarusResponse } from "@/lib/types.ikarus";

interface setCachedIkarus {
  variant: "Heute" | "Morgen";
  data: IkarusResponse;
}

// read 'ikarusData' from localStorage
export const getCachedIkarusData = (variant: "Heute" | "Morgen") => {
  const cachedData = localStorage.getItem(`ikarusData_v1${variant}`);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return DefaultIkarusResponse;
};

// write 'ikarusData' to localStorage
export const setCachedIkarusData = ({ variant, data }: setCachedIkarus) => {
  if (data.date !== "") {
    localStorage.setItem(`ikarusData_v1${variant}`, JSON.stringify(data));
  }
};
