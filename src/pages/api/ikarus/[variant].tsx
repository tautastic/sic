import type { NextApiRequest, NextApiResponse } from "next";

import type { IkarusResponse } from "@/lib/types.ikarus";
import { getServerCachedData, setServerCachedData } from "@/lib/ServerCache";
import { IkarusFetch } from "@/lib/utils.ikarus";

const ikarusWrapper = async (
  req: NextApiRequest,
  res: NextApiResponse<IkarusResponse | unknown>,
  variant: "Heute" | "Morgen"
) => {
  const data = await IkarusFetch(variant);
  if (data.date === "") {
    // If the ikarus server returns an empty response, wait 50ms and try again
    await new Promise((resolve) => setTimeout(resolve, 50));
    res.redirect(307, `/api/ikarus/${variant}`);
  } else {
    // If the ikarus server returns a valid response, cache it and return it
    setServerCachedData({ variant, data });
    res.status(200).end(JSON.stringify(data));
  }
};

const IkarusHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<IkarusResponse | unknown>
) => {
  if (req.query.variant === "Heute" || req.query.variant === "Morgen") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Encoding", "gzip, deflate, br");
    res.setHeader("Cache-Control", "no-store");
    const variant = req.query.variant;
    const cachedData = getServerCachedData(variant);

    if (cachedData === null || cachedData.requestTime + 300000 < Date.now()) {
      // If there is no data in cache or the cached data is older than 5 minutes, fetch new data
      await ikarusWrapper(req, res, variant);
    } else {
      // If there is data in cache and it is not older than 5 minutes, return it
      res.status(200).end(JSON.stringify(cachedData));
    }
  } else {
    res.status(400).end(JSON.stringify({ message: "Invalid variant" }));
  }
};

export default IkarusHandler;
