import "@/styles/globals.css";
import { IkarusProvider } from "@/contexts/IkarusProvider";
import type { ReactNode } from "react";
import { NextSeo } from "next-seo";
import SEO from "next-seo.config";

import { AnalyticsWrapper } from "@/app/analytics";
import { AddressBar } from "@/ui/AddressBar";
import { GlobalNav } from "@/ui/GlobalNav";
import { Byline } from "@/ui/Byline";
import { VercelContainer } from "@/ui/VercelContainer";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html
      lang="en"
      className="[color-scheme:dark]">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta
          name="theme-color"
          content="#000000"
        />
        <NextSeo
          {...SEO}
          useAppDir={true}
        />
        <AnalyticsWrapper />
      </head>
      <body className="overflow-y-scroll bg-gray-1100 bg-[url('/img/grid.svg')]">
        <GlobalNav />
        <div className="lg:pl-72">
          <div className="mx-auto max-w-7xl space-y-8 px-2 pt-20 lg:py-8 lg:px-8">
            <VercelContainer>
              <AddressBar />
            </VercelContainer>

            <VercelContainer className={"p-3.5 lg:p-6"}>
              <IkarusProvider>{children}</IkarusProvider>
            </VercelContainer>

            <VercelContainer>
              <Byline />
            </VercelContainer>
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
