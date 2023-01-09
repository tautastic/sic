import type { ReactNode } from "react";
import { BiLinkExternal } from "react-icons/bi";

interface ExternalLinkProps {
  children: ReactNode;
  href: string;
}

export const ExternalLink = (props: ExternalLinkProps) => {
  return (
    <a
      href={props.href}
      className="inline-flex space-x-2 rounded-lg bg-gray-700 px-3 py-1 text-sm font-medium text-gray-100 hover:bg-gray-500 hover:text-white">
      <div>{props.children}</div>
      <BiLinkExternal className="block w-4" />
    </a>
  );
};
