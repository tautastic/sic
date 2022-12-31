import clsx from "clsx";
import type { ReactNode } from "react";

const Label = ({
  children,
  animateRerendering,
  color,
}: {
  children: ReactNode;
  animateRerendering?: boolean;
  color?: "default" | "pink" | "blue" | "violet" | "cyan" | "orange";
}) => {
  return (
    <div
      className={clsx(
        "my-1 rounded-full px-1.5 shadow-[0_0_1px_3px_black] sm:my-0 sm:py-1 sm:px-2",
        {
          "bg-gray-800 text-gray-300": color === "default",
          "bg-vercel-pink text-white": color === "pink",
          "bg-vercel-blue text-white": color === "blue",
          "bg-vercel-cyan text-white": color === "cyan",
          "bg-vercel-violet text-violet-100": color === "violet",
          "bg-vercel-orange text-white": color === "orange",
          "animate-[highlight_1s_ease-in-out_1]": animateRerendering,
        }
      )}>
      {children}
    </div>
  );
};

export const Boundary = ({
  children,
  labels = ["children"],
  color = "default",
  animateRerendering = true,
}: {
  children: ReactNode;
  labels?: string[];
  color?: "default" | "pink" | "blue" | "violet" | "cyan" | "orange";
  animateRerendering?: boolean;
}) => {
  return (
    <div
      className={clsx("relative rounded-lg border border-dashed p-4 sm:p-8", {
        "border-gray-700": color === "default",
        "border-vercel-pink": color === "pink",
        "border-vercel-blue": color === "blue",
        "border-vercel-cyan": color === "cyan",
        "border-vercel-violet": color === "violet",
        "border-vercel-orange": color === "orange",
        "animate-[rerender_1s_ease-in-out_1] text-vercel-pink":
          animateRerendering,
      })}>
      <div className="absolute -top-2.5 mr-4 flex max-h-6 flex-wrap gap-1.5 overflow-hidden text-[9px] tracking-widest sm:text-xs md:left-8">
        {labels.map((label) => {
          return (
            <Label
              key={label}
              color={color}
              animateRerendering={animateRerendering}>
              {label}
            </Label>
          );
        })}
      </div>

      {children}
    </div>
  );
};
