"use client";

import { useIkarus } from "@/contexts/IkarusProvider";

export const IkarusInfo = () => {
  const {
    ikarus: { Heute, Morgen },
    isFetching,
  } = useIkarus();

  return (
    <>
      {isFetching ? (
        <p>Fetching...</p>
      ) : (
        <>
          <p>Heute: {Heute.date}</p>
          <p>Morgen: {Morgen.date}</p>
        </>
      )}
    </>
  );
};
