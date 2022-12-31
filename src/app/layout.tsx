import "@/styles/globals.css";
import type { ReactNode } from "react";
import { AddressBar } from "@/ui/AddressBar";
import { GlobalNav } from "@/ui/GlobalNav";
import { VercelLogo } from "@/ui/VercelLogo";
import { NextSeo } from "next-seo";
import SEO from "next-seo.config";

const Byline = () => {
  return (
    <div className="flex items-center justify-between space-x-4 p-3.5 lg:px-5 lg:py-3">
      <div className="flex items-center space-x-1.5 text-sm">
        <div className="text-gray-400">Made by</div>
        <a
          className="underline decoration-dotted underline-offset-4 hover:text-gray-400"
          href="https://github.com/add1609"
          target="_blank"
          rel="noreferrer">
          Ahmed Sami
        </a>
      </div>

      <div className="text-xs tracking-wide text-gray-400">
        <a
          href="https://vercel.com"
          title="Vercel">
          Powered by
          <div className="mt-1 w-16 text-gray-100 hover:text-gray-50">
            <VercelLogo />
          </div>
        </a>
      </div>
    </div>
  );
};

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
      </head>
      <body className="overflow-y-scroll bg-gray-1100 bg-[url('/img/grid.svg')]">
        <GlobalNav />
        <div className="lg:pl-72">
          <div className="mx-auto max-w-7xl space-y-8 px-2 pt-20 lg:py-8 lg:px-8">
            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black">
                <AddressBar />
              </div>
            </div>

            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black p-3.5 lg:p-6">{children}</div>
            </div>

            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black">
                <Byline />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
