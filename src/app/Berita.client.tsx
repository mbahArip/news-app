"use client";

import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import { NewsAPIArticle } from "~/types";
import Icon from "./global/Icon";

type Props = {
  data: NewsAPIArticle;
};
export default function BeritaItem({ data }: Props) {
  return (
    <Link href={data.url} target="_blank" rel={"noopener noreferrer"}>
      <div className="w-full flex flex-col md:flex-row items-start gap-1.5 hover:bg-muted border border-border rounded-[var(--radius)] overflow-hidden transition">
        {data.urlToImage ? (
          <img
            src={data.urlToImage}
            alt={data.title}
            className="object-cover w-full h-32 md:size-24 flex-shrink-0 bg-foreground/25"
          />
        ) : (
          <div className="size-24 select-none flex items-center justify-center flex-col flex-shrink-0 bg-foreground/25">
            <Icon name="X" size={24} className="text-destructive" />
          </div>
        )}
        <div className="flex flex-col h-full gap-0.5 px-2 py-1 md:p-0 md:pr-2">
          <h5 className="font-semibold line-clamp-1 text-pretty" title={data.title}>
            {data.title}
          </h5>
          <p className="text-xs line-clamp-2 text-pretty" title={data.description}>
            {data.description}
          </p>
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1.5">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Icon name="Clock" size={12} />
              <span>
                {data.publishedAt
                  ? new Date(data.publishedAt).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Tidak diketahui"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Icon name="User" size={12} />
              <span className="line-clamp-1 whitespace-pre-wrap break-all">{data.author || "Tidak diketahui"}</span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 col-span-full">
              <Icon name="Globe" size={12} />
              <span className="line-clamp-1 whitespace-pre-wrap break-all">
                {data.source.name || "Tidak diketahui"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
