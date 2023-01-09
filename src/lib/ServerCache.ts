import cache from "memory-cache";

import type { IkarusResponse } from "@/lib/types.ikarus";

// read 'ikarusData' from cache on server
export const getServerCachedData = (
  variant: "Heute" | "Morgen"
): IkarusResponse | null => {
  const cachedData = cache.get(`ikarusData_v2${variant}`);
  if (cachedData) {
    return cachedData;
  }
  return null;
};

// write 'ikarusData' to cache on server
export const setServerCachedData = ({
  variant,
  data,
}: {
  variant: "Heute" | "Morgen";
  data: IkarusResponse;
}) => {
  if (data.date !== "") {
    cache.put(`ikarusData_v2${variant}`, data, 5000 * 60);
  }
};
