"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { NewsAPIArticle } from "~/types";
import BeritaItem from "../Berita.client";
import Icon from "../global/Icon";

type Props = {
  data: NewsAPIArticle[];
  pagination: {
    page: number;
    totalResults: number;
  };
  sortBy?: "popularity" | "publishedAt" | "relevancy";
  tipe?: string;
};
export default function BeritaFilter({ data, sortBy, tipe, pagination }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filterSortBy, setFilterSortBy] = useState<"popularity" | "publishedAt" | "relevancy">(sortBy || "publishedAt");
  const [filterTipe, setFilterTipe] = useState<string>(tipe || "local");
  const [paginationData, setPaginationData] = useState<{
    page: number;
    totalResults: number;
    totalPages: number;
    start: number;
    end: number;
    previousEllipsis: boolean;
    nextEllipsis: boolean;
  }>(() => {
    const MAX_SIBLING = 2;
    const start = Math.max(1, pagination.page - MAX_SIBLING);
    const end = Math.min(pagination.page + MAX_SIBLING, Math.ceil(pagination.totalResults / 10));
    const hasPreviousEllipsis = start > 1;
    const hasNextEllipsis = end < Math.ceil(pagination.totalResults / 10);
    const totalPages = Math.ceil(pagination.totalResults / 10);

    return {
      page: pagination.page,
      totalResults: pagination.totalResults,
      totalPages,
      start,
      end,
      previousEllipsis: hasPreviousEllipsis,
      nextEllipsis: hasNextEllipsis,
    };
  });

  useEffect(() => {
    setLoading(false);
  }, [data, sortBy, tipe, paginationData]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const MAX_SIBLING = 1;
    const start = Math.max(1, pagination.page - MAX_SIBLING);
    const end = Math.min(pagination.page + MAX_SIBLING, Math.ceil(pagination.totalResults / 10));
    const hasPreviousEllipsis = start > 1;
    const hasNextEllipsis = end < Math.ceil(pagination.totalResults / 10);
    const totalPages = Math.ceil(pagination.totalResults / 10);

    setPaginationData({
      page: pagination.page,
      totalResults: pagination.totalResults,
      totalPages,
      start,
      end,
      previousEllipsis: hasPreviousEllipsis,
      nextEllipsis: hasNextEllipsis,
    });
  }, [pagination]);

  const onPaginationChange = (page: number) => {
    setLoading(true);
    const url = new URL(pathname, "http://localhost:3000");
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    url.searchParams.set("page", String(page));

    router.push(url.toString());
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5 w-full">
          <Label htmlFor="sortBy">Urutkan</Label>
          <Select
            value={filterSortBy}
            onValueChange={(e) => {
              setLoading(true);
              setFilterSortBy(e as "popularity" | "publishedAt" | "relevancy");
              const url = new URL(pathname, "http://localhost:3000");
              searchParams.forEach((value, key) => {
                url.searchParams.set(key, value);
              });
              url.searchParams.set("sortBy", e as string);
              url.searchParams.set("page", "1");

              router.push(url.toString());
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Urutkan berita" id="sortBy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Populer</SelectItem>
              <SelectItem value="publishedAt">Terbaru</SelectItem>
              <SelectItem value="relevancy">Relevansi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5 w-full">
          <Label htmlFor="tipe">Tipe</Label>
          <Select
            value={filterTipe}
            onValueChange={(e) => {
              setLoading(true);
              setFilterTipe(e as string);
              const url = new URL(pathname, "http://localhost:3000");
              searchParams.forEach((value, key) => {
                url.searchParams.set(key, value);
              });
              url.searchParams.set("tipe", e as string);
              url.searchParams.set("page", "1");

              router.push(url.toString());
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipe berita" id="tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Berita Internasional</SelectItem>
              <SelectItem value="local">Berita Lokal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid place-items-center h-[33dvh]">
          <Icon name="LoaderCircle" size={32} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {data.map((item) => (
            <BeritaItem data={item} key={item.url} />
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row-reverse md:justify-between md:items-center gap-1.5">
        <div className="flex items-center justify-between md:justify-end border border-border rounded-[var(--radius)] md:w-fit md:ml-auto">
          <Button
            size={"sm"}
            disabled={paginationData.page === 1}
            onClick={() => onPaginationChange(paginationData.page - 1)}
            variant={"ghost"}
            className="gap-1"
          >
            <Icon name="ChevronLeft" size={18} />
          </Button>
          {paginationData.previousEllipsis && (
            <>
              <Button size={"sm"} variant={"ghost"} onClick={() => onPaginationChange(1)}>
                1
              </Button>
              <Button size={"sm"} variant={"ghost"} disabled>
                ...
              </Button>
            </>
          )}

          {Array.from(
            { length: paginationData.end - paginationData.start + 1 },
            (_, i) => i + paginationData.start
          ).map((page) => (
            <Button
              key={`page-${page}`}
              size={"sm"}
              variant={paginationData.page === page ? "default" : "ghost"}
              onClick={() => onPaginationChange(page)}
            >
              {page}
            </Button>
          ))}

          {paginationData.nextEllipsis && (
            <>
              <Button size={"sm"} variant={"ghost"} disabled>
                ...
              </Button>
              <Button size={"sm"} variant={"ghost"} onClick={() => onPaginationChange(paginationData.totalPages)}>
                {paginationData.totalPages}
              </Button>
            </>
          )}
          <Button
            size={"sm"}
            disabled={paginationData.page === paginationData.totalPages}
            onClick={() => onPaginationChange(paginationData.page + 1)}
            variant={"ghost"}
            className="gap-1"
          >
            <Icon name="ChevronRight" size={18} />
          </Button>
        </div>
        <span className="text-xs text-start">
          Halaman {paginationData.page} dari {paginationData.totalPages}
        </span>
      </div>
    </>
  );
}
