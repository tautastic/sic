"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

import type { IkarusResponse } from "@/lib/types.ikarus";
import { DefaultIkarusResponse } from "@/lib/types.ikarus";

// The IkarusContext stores an object containing two IkarusResponses, 'Heute' and 'Morgen'
// and a boolean indicating if they're currently being fetched
export const IkarusContext = createContext<{
  ikarusHeute: IkarusResponse;
  ikarusMorgen: IkarusResponse;
  isFetching: boolean;
}>({
  ikarusHeute: DefaultIkarusResponse,
  ikarusMorgen: DefaultIkarusResponse,
  isFetching: false,
});

// The IkarusProvider is a wrapper for the whole page that fetches the data and stores it in the context
export const IkarusProvider = ({ children }: { children: ReactNode }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [ikarusHeute, setIkarusHeute] = useState<IkarusResponse>(
    DefaultIkarusResponse
  );
  const [ikarusMorgen, setIkarusMorgen] = useState<IkarusResponse>(
    DefaultIkarusResponse
  );

  // This function fetches the data from the API and stores it in the context
  const fetchIkarus = async () => {
    // Fetch 'Heute' and 'Morgen' in parallel
    const [heute, morgen] = await Promise.all([
      fetch("/api/ikarus/Heute").then((res) => {
        if (res.ok) {
          return res.json();
        }
      }),
      fetch("/api/ikarus/Morgen").then((res) => {
        if (res.ok) {
          return res.json();
        }
      }),
    ]);

    setIkarusHeute(heute);
    setIkarusMorgen(morgen);
  };

  // The useEffect hook is called when the page is loaded
  useEffect(() => {
    let isMounted = false;

    const keepIkarusFresh = () => {
      setInterval(() => {
        setIkarusWrapper();
      }, 5000 * 60);
    };

    const setIkarusWrapper = () => {
      if (!isMounted) {
        setIsFetching(true);
        fetchIkarus().then(() => {
          setIsFetching(false);
          isMounted = true;
          keepIkarusFresh();
        });
      }
    };

    setIkarusWrapper();
  }, []);

  // Return the context and a function to fetch the data
  return (
    <IkarusContext.Provider value={{ ikarusHeute, ikarusMorgen, isFetching }}>
      {children}
    </IkarusContext.Provider>
  );
};

export const useIkarus = () => useContext(IkarusContext);
