"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { GlobalNavChild } from "@/lib/types.nav";

export const Tab = (item: GlobalNavChild) => {
  const pathname = usePathname();
  const isActive = item.slug === pathname?.split("/").at(-1);
  const href = item.slug ? item.path + "/" + item.slug : item.path;

  const router = useRouter();

  router.prefetch(href);
  return (
    <Link
      href={href}
      className={clsx("mt-2 mr-2 rounded-lg px-3 py-1 text-sm font-medium", {
        "bg-gray-700 text-gray-100 hover:bg-gray-500 hover:text-white":
          !isActive,
        "bg-vercel-blue text-white": isActive,
      })}>
      {item.text}
    </Link>
  );
};
