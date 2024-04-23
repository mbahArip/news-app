"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Icon from "./global/Icon";

export default function ToTop() {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const handler = () => {
      if (window.scrollY > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handler);

    return () => {
      window.removeEventListener("scroll", handler);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-3 right-3 transition z-10 bg-background rounded-[var(--radius)]",
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <Button
        size={"icon"}
        variant={"default"}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <Icon name="ChevronsUp" />
      </Button>
    </div>
  );
}
