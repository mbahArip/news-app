"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useToast } from "~/components/ui/use-toast";

type Props = {
  query?: string;
  sortBy?: "relevancy" | "popularity" | "publishedAt";
};

export default function SearchForm({ query, sortBy }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState<string>(query || "");
  const [searchSortBy, setSearchSortBy] = useState<"relevancy" | "popularity" | "publishedAt">(sortBy || "relevancy");

  return (
    <form
      className="w-full grid grid-cols-1 md:grid-cols-4 gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        try {
          if (!searchQuery) {
            throw new Error("Kata kunci tidak boleh kosong");
          }

          const url = new URL(pathname, "http://localhost:3000");
          url.searchParams.set("q", searchQuery);
          url.searchParams.set("sortBy", searchSortBy);
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
      }}
    >
      <div className="flex flex-col md:col-span-3 gap-1.5 w-full">
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
      <div className="flex flex-col gap-1.5 w-full">
        <Label htmlFor="sortBy">Urutkan</Label>
        <Select
          value={searchSortBy}
          onValueChange={(e) => {
            setSearchSortBy(e as "relevancy" | "popularity" | "publishedAt");
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
      <Button className="col-span-full" type="submit">
        Cari berita
      </Button>
    </form>
  );
}
