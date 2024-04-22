"use client";

import { LucideProps, icons } from "lucide-react";
import { cn } from "~/lib/utils";

interface Props extends LucideProps {
  name: keyof typeof icons;
  wrapperClassName?: string;
}

export default function Icon({ name, wrapperClassName, ...props }: Props) {
  const LucideIcon = icons[name];

  return (
    <div
      className={cn("aspect-square grid place-items-center", wrapperClassName)}
      style={{
        width: props.size || 24,
        height: props.size || 24,
      }}
    >
      <LucideIcon {...props} />
    </div>
  );
}
