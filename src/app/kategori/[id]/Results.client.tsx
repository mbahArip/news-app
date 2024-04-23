"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/components/ui/use-toast";
import { NewsAPIResponse, NewsAPISortBy } from "~/types";
import BeritaItem from "../../Berita.client";
import Icon from "../../global/Icon";

type Props = {
  initialData: NewsAPIResponse<"articles">;
  sortBy?: NewsAPISortBy;
  currentCategories?: {
    key: string;
    title: string;
    description: string;
  };
  pagination: {
    page: number;
    totalResults: number;
    itemsPerPage: number;
  };
};
type Pagination = {
  page: number;
  totalResults: number;
  totalPages: number;
  start: number;
  end: number;
  isPreviousEllipsis: boolean;
  isNextEllipsis: boolean;
};
export default function KategoriResult({ initialData, currentCategories, sortBy, pagination }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const MAX_PAGINATION_SIBLINGS: number = 2;
  const generatePaginationData = (page: number, totalResults: number, itemsPerPage: number): Pagination => {
    const itemStart = Math.max(1, page - MAX_PAGINATION_SIBLINGS);
    const itemEnd = Math.min(page + MAX_PAGINATION_SIBLINGS, Math.ceil(totalResults / itemsPerPage));

    const hasPreviousEllipsis = itemStart > 1;
    const hasNextEllipsis = itemEnd < Math.ceil(totalResults / itemsPerPage);

    const totalPages = Math.ceil(totalResults / itemsPerPage);

    return {
      page,
      totalResults,
      totalPages,
      start: itemStart,
      end: itemEnd,
      isPreviousEllipsis: hasPreviousEllipsis,
      isNextEllipsis: hasNextEllipsis,
    };
  };

  const [filterSortBy, setFilterSortBy] = useState<NewsAPISortBy>(sortBy || "publishedAt");

  const [loading, setLoading] = useState<boolean>(true);
  const [results, setResults] = useState<NewsAPIResponse<"articles">>(initialData);
  const [paginationData, setPaginationData] = useState<Pagination>(
    generatePaginationData(pagination.page, pagination.totalResults, pagination.itemsPerPage)
  );

  const onQueryChange = () => {
    setLoading(true);

    try {
      if (filterSortBy === sortBy) return;

      const url = new URL(pathname, "http://localhost:3000");
      searchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
      url.searchParams.set("sortBy", filterSortBy);
      router.push(url.toString());
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
      toast({
        title: "Terjadi kesalahan",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onPaginationChange = (page: number) => {
    setLoading(true);

    try {
      if (pagination.page === page)
        throw {
          name: "InvalidPage",
          message: "Halaman yang diminta sama dengan halaman saat ini",
        };
      const url = new URL(pathname, "http://localhost:3000");
      searchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
      url.searchParams.set("page", String(page));

      router.push(url.toString());
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
      toast({
        title: "Terjadi kesalahan",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    setFilterSortBy(sortBy || "publishedAt");
    setResults(initialData);
  }, [initialData, sortBy]);
  useEffect(() => {
    setPaginationData(generatePaginationData(pagination.page, pagination.totalResults, pagination.itemsPerPage));
  }, [pagination]);

  useEffect(() => {
    onQueryChange();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSortBy]);

  if (results.status === "error")
    throw {
      name: results.code,
      message: results.message,
    };

  return (
    <div className="w-full py-3 md:py-6 space-y-3">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end">
        <div>
          <h2>Berita {currentCategories?.title}</h2>
          <p>{currentCategories?.description}</p>
        </div>

        <div className="flex flex-col gap-1.5 w-full md:min-w-24 md:max-w-64">
          <Label htmlFor="sortBy">Urutkan</Label>
          <Select
            value={filterSortBy}
            onValueChange={(e) => {
              setFilterSortBy(e as NewsAPISortBy);
            }}
            name="sortBy"
          >
            <SelectTrigger>
              <SelectValue placeholder="Urutkan hasil" id="sortBy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevancy">Relevansi</SelectItem>
              <SelectItem value="popularity">Populer</SelectItem>
              <SelectItem value="publishedAt">Terbaru</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
      <div className="w-full flex flex-col md:flex-row md:justify-end gap-3"></div>

      {loading ? (
        <div className="grid place-items-center h-[33dvh] w-full">
          <Icon name="LoaderCircle" size={32} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          {results.articles.length === 0 ? (
            <div className="flex items-center flex-col col-span-full">
              <p>Tidak ada hasil berita yang sesuai dengan kategori ini.</p>
            </div>
          ) : (
            results.articles.map((article) => <BeritaItem data={article} key={article.url} />)
          )}
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
          {paginationData.isPreviousEllipsis && (
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

          {paginationData.isNextEllipsis && (
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
          Menampilkan item {(pagination.page - 1) * pagination.itemsPerPage + 1} hingga{" "}
          {pagination.page * pagination.itemsPerPage} dari {paginationData.totalResults} item
        </span>
      </div>
    </div>
  );
}
