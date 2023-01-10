import type { ReactNode } from "react";

interface VercelContainerProps {
  children: ReactNode;
  className?: string;
}

export const VercelContainer = (props: VercelContainerProps) => {
  return (
    <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
      <div className={`rounded-lg bg-black ${props.className}`}>
        {props.children}
      </div>
    </div>
  );
};
