import { Separator } from "~/components/ui/separator";
import newsAPI from "~/lib/news";
import BeritaFilter from "./BeritaFilter.client";

export const revalidate = 3600;

type Props = {
  searchParams: {
    page?: string;
    sortBy?: "relevancy" | "popularity" | "publishedAt";
    tipe?: string;
  };
};

export default async function Berita({ searchParams }: Props) {
  const results = await newsAPI.getEverything({
    query: "*",
    language: searchParams.tipe === "global" ? "en" : "id",
    sortBy: searchParams.sortBy || "publishedAt",
    pageSize: 10,
    page: parseInt(searchParams.page || "1"),
  });
  if (results.status === "error") {
    console.error(results.message);
    throw new Error(results.message);
  }
  return (
    <div className="p-3 md:p-6 w-full max-w-screen-lg mx-auto flex flex-col gap-3">
      <h2>Berita Terbaru</h2>
      <p>Berita terbaru dari berbagai sumber terpercaya. Silahkan pilih berita yang ingin anda baca.</p>
      <Separator />

      <BeritaFilter
        data={results.articles}
        pagination={{
          page: parseInt(searchParams.page || "1"),
          totalResults: results.totalResults,
        }}
        sortBy={searchParams.sortBy}
        tipe={searchParams.tipe}
      />
    </div>
  );
}
