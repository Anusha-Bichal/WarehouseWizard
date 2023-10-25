import { cn } from "~/utils/misc";

export function Container({
  children,
  className,
}) {
  return (
    React.createElement("div", { className: cn("flex max-w-screen-xl flex-col gap-12 p-10", className) },
      React.createElement("div", { className: "flex flex-col gap-8" }, children)
    )
  );
}
