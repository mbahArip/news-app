import { Metadata } from "next";
import { Separator } from "~/components/ui/separator";
import newsAPI from "~/lib/news";
import { NewsAPICategory, NewsAPISortBy, isNewsAPICategory } from "~/types";
import LatestResult from "./Results.client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  searchParams: {
    page?: string;
    sortBy?: NewsAPISortBy;
    category?: NewsAPICategory;
  };
};
export const metadata: Metadata = {
  title: "Berita Terkini",
};

export default async function Berita({ searchParams }: Props) {
  const itemsPerPage = 10;
  let sources = undefined;
  if (searchParams.category && isNewsAPICategory(searchParams.category)) {
    const response = await newsAPI.getSources({ category: searchParams.category });
    if (response.status === "ok") {
      sources = response.sources;
    }
  }

  const results = await newsAPI.getEverything({
    pageSize: itemsPerPage,
    sortBy: searchParams.sortBy || "publishedAt",
    sources: Array.isArray(sources) ? sources.slice(0, 20).map((source) => source.id) : undefined,
    page: parseInt(searchParams.page || "1"),
    language: "en",
  });
  if (results.status === "error") {
    console.error(results.message);
    throw new Error(results.message);
  }
  return (
    <div className="p-3 md:p-6 w-full max-w-screen-lg mx-auto flex flex-col gap-3">
      <h2>Berita Terkini</h2>
      <p>Berita terbaru dari berbagai sumber terpercaya. Silahkan pilih berita yang ingin anda baca.</p>
      <Separator />

      <LatestResult
        initialData={results}
        pagination={{
          itemsPerPage: itemsPerPage,
          page: parseInt(searchParams.page || "1"),
          totalResults: results.totalResults,
        }}
        category={searchParams.category}
        sortBy={searchParams.sortBy}
        sources={sources}
      />
    </div>
  );
}
