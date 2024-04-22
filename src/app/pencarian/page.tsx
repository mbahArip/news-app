import { Separator } from "~/components/ui/separator";
import newsAPI from "~/lib/news";
import BeritaItem from "../Berita.client";
import Icon from "../global/Icon";
import SearchForm from "./SearchForm.client";

export const revalidate = 3600;

type Props = {
  searchParams: {
    q: string;
    sortBy?: "relevancy" | "popularity" | "publishedAt";
  };
};
export default async function Pencarian({ searchParams }: Props) {
  const results = await newsAPI.getEverything({
    query: searchParams.q,
    sortBy: searchParams.sortBy || "relevancy",
  });

  return (
    <div className="p-3 md:p-6 w-full max-w-screen-lg mx-auto flex flex-col gap-3 items-center">
      <h2 className="text-center">Hasil Pencarian</h2>
      <div className="w-full p-3">
        <SearchForm query={searchParams.q} sortBy={searchParams.sortBy} />
      </div>
      <Separator />

      {results.status === "ok" ? (
        results.totalResults === 0 ? (
          <div className="w-full flex items-center justify-center gap-1.5">
            <Icon name="Frown" size={48} />
            <span>Tidak ada hasil pencarian</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            <p className="text-center col-span-full">
              Menampilkan hasil pencarian untuk <strong>{searchParams.q}</strong>
            </p>
            {results.articles.map((article) => (
              <BeritaItem data={article} key={article.url} />
            ))}
          </div>
        )
      ) : (
        <p className="text-center text-destructive">{results.message}</p>
      )}
    </div>
  );
}
