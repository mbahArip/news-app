"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { NewsAPISource } from "~/types";
import Icon from "../global/Icon";

type Props = {
  data: NewsAPISource[];
};
export default function SumberData({ data }: Props) {
  const [shownSources, setShownSources] = useState<NewsAPISource[]>(data);
  const [searchSource, setSearchSource] = useState<string>("");

  useEffect(() => {
    if (!searchSource) return setShownSources(data);

    const filteredSources = data.filter((source) => source.name.toLowerCase().includes(searchSource.toLowerCase()));
    setShownSources(filteredSources);
  }, [searchSource, data]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
        <div className="flex flex-col col-span-full gap-3">
          <Input placeholder="Cari sumber berita" onChange={(e) => setSearchSource(e.target.value)} />
        </div>
        {shownSources.length === 0 ? (
          <div className="w-full h-64 flex flex-col items-center justify-center col-span-full">
            <Icon name="Frown" size={32} />
            <span>Sumber berita tidak ditemukan</span>
          </div>
        ) : (
          shownSources.map((source) => (
            <Link
              key={`source-${source.id}`}
              href={`/sumber/${source.id}`}
              className="items-start justify-start flex flex-col w-full hover:bg-muted p-3 rounded-[var(--radius)] transition-colors border border-border"
            >
              <span className="text-lg font-semibold">{source.name}</span>
              <p className="text-xs text-muted-foreground line-clamp-2">{source.description}</p>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
