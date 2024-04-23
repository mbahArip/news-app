"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { useToast } from "~/components/ui/use-toast";
import { categoriesMenu } from "~/data/categories";
import { NewsAPICategory, NewsAPIResponse, NewsAPISortBy, NewsAPISource } from "~/types";
import BeritaItem from "../Berita.client";
import { GetEverything } from "../actions";

type Props = {
  initialData: NewsAPIResponse<"articles">;
  query?: string;
  sortBy?: NewsAPISortBy;
  category?: NewsAPICategory;
  sources?: NewsAPISource[] | undefined;
};

export default function SearchResults({ initialData, category, query, sortBy, sources }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState<string>(query || "");
  const [searchSortBy, setSearchSortBy] = useState<NewsAPISortBy>(sortBy || "relevancy");
  const [searchCategory, setSearchCategory] = useState<NewsAPICategory | "all">(category || "all");

  const [results, setResults] = useState<NewsAPIResponse<"articles">>(initialData);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setSearchQuery(query || "");
    setSearchSortBy(sortBy || "relevancy");
    setSearchCategory(category || "all");
    setResults(initialData);
  }, [initialData, category, query, sortBy, sources]);

  const onSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!searchQuery) {
        throw new Error("Kata kunci tidak boleh kosong");
      }

      const currentURL = new URL(window.location.href);

      const url = new URL(pathname, "http://localhost:3000");
      url.searchParams.set("q", searchQuery);
      url.searchParams.set("sortBy", searchSortBy);
      if (searchCategory === "all") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", searchCategory);
      }

      if (url.toString() === currentURL.toString()) {
        throw new Error("Tidak ada perubahan pada pencarian");
      }

      router.push(url.toString());
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
      toast({
        title: "Terjadi kesalahan",
        description: e.message,
        variant: "destructive",
      });
    }
  };
  const onLoadMore = async () => {
    setMoreLoading(true);
    try {
      const data = await GetEverything({
        query: query,
        sortBy: sortBy,
        sources: Array.isArray(sources) ? sources.slice(0, 20).map((source) => source.id) : undefined,
        pageSize: 10,
        page: currentPage + 1,
      });
      if (data.status === "error")
        throw {
          name: data.code,
          message: data.message,
        };

      setResults((prev) => {
        if ("articles" in prev && "articles" in data) {
          const newArticles = new Set([...prev.articles, ...data.articles]);
          return {
            status: "ok",
            totalResults: data.totalResults,
            articles: Array.from(newArticles),
          };
        }
        return prev;
      });
      setCurrentPage(currentPage + 1);
    } catch (error) {
      const e = error as Error;
      console.error(e.message);
      toast({
        title: "Gagal memuat lebih banyak berita",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setMoreLoading(false);
    }
  };

  return (
    <div className="w-full p-3 md:p-6 space-y-3">
      <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmitSearch}>
        <div className="flex flex-col col-span-full gap-1.5 w-full">
          <Label htmlFor="q">Kata kunci</Label>
          <Input
            type="search"
            id="q"
            name="q"
            placeholder="Cari berita"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 col-span-full w-full gap-3">
          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="sortBy">Kategori</Label>
            <Select
              value={searchCategory}
              onValueChange={(e) => {
                setSearchCategory(e as NewsAPICategory);
              }}
              name="sortBy"
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori Berita" id="sortBy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categoriesMenu.map((item) => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <Label htmlFor="sortBy">Urutkan</Label>
            <Select
              value={searchSortBy}
              onValueChange={(e) => {
                setSearchSortBy(e as NewsAPISortBy);
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

        <Button className="col-span-full" type="submit">
          Cari berita
        </Button>
      </form>

      <Separator />

      {results.status === "error" ? (
        <div className="flex items-center flex-col">
          <p className="text-destructive">Terjadi kesalahan saat mengambil data berita:</p>
          <strong className="text-destructive">{results.message}</strong>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {results.articles.length === 0 ? (
            <div className="flex items-center flex-col col-span-full">
              <p>
                Tidak ada hasil untuk kata kunci <strong>&quot;{query}&quot;</strong>{" "}
                {searchCategory !== "all" && (
                  <>
                    pada kategori{" "}
                    <strong>&quot;{categoriesMenu.find((item) => item.key === category)?.title}&quot;</strong>
                  </>
                )}
              </p>
            </div>
          ) : (
            results.articles.map((article) => <BeritaItem data={article} key={article.url} />)
          )}
          {results.articles.length < results.totalResults && (
            <Button disabled={moreLoading} className="col-span-full" onClick={onLoadMore}>
              {moreLoading ? "Memuat..." : "Muat lebih banyak"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
