import { Metadata } from "next";
import newsAPI from "~/lib/news";
import { NewsAPICategory, NewsAPISortBy, isNewsAPICategory } from "~/types";
import SearchResults from "./Results.client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  searchParams: {
    q?: string;
    category?: NewsAPICategory;
    sortBy?: NewsAPISortBy;
  };
};
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  if (!searchParams.q) return { title: "Pencarian berita" };
  return { title: `Hasil pencarian: ${searchParams.q}` };
}
export default async function Pencarian({ searchParams }: Props) {
  let sources = undefined;
  if (searchParams.category && isNewsAPICategory(searchParams.category)) {
    const response = await newsAPI.getSources({ category: searchParams.category });
    if (response.status === "ok") {
      sources = response.sources;
    }
  }
  const results = await newsAPI.getEverything({
    query: searchParams.q,
    pageSize: 10,
    sortBy: searchParams.sortBy || "relevancy",
    sources: Array.isArray(sources) ? sources.slice(0, 20).map((source) => source.id) : undefined,
    language: "en",
  });

  return (
    <div className="p-3 md:p-6 w-full max-w-screen-lg mx-auto flex flex-col gap-3 items-center">
      <h2 className="text-center">Pencarian Berita</h2>
      <SearchResults
        initialData={results}
        query={searchParams.q}
        sortBy={searchParams.sortBy}
        category={searchParams.category}
        sources={sources}
      />
    </div>
  );
}
