import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import newsAPI from "~/lib/news";
import BeritaItem from "./Berita.client";
import CarouselAutoplay from "./Carousel.client";

export const revalidate = 3600;

export default async function Home() {
  const _top = newsAPI.getTopHeadlines({
    country: "us",
    pageSize: 10,
  });
  const _latestGlobal = newsAPI.getEverything({
    query: "*",
    language: "en",
    sortBy: "publishedAt",
    pageSize: 5,
  });
  const _latestLocal = newsAPI.getEverything({
    query: "*",
    language: "id",
    sortBy: "publishedAt",
    pageSize: 5,
  });

  const [top, latestGlobal, latestLocal] = await Promise.all([_top, _latestGlobal, _latestLocal]);
  if (top.status === "error") {
    throw new Error(top.message);
  }
  if (latestGlobal.status === "error") {
    throw new Error(latestGlobal.message);
  }
  if (latestLocal.status === "error") {
    throw new Error(latestLocal.message);
  }

  return (
    <>
      <CarouselAutoplay data={top.articles} />
      <div className="grid grid-cols-1 md:grid-cols-2 p-3 md:p-6 gap-x-3 gap-y-6 max-w-screen-lg mx-auto w-full">
        <div className="flex flex-col gap-1.5">
          <h4>Berita Lokal Terbaru</h4>
          <Separator />
          <div className="flex flex-col gap-1.5">
            {latestLocal.articles.map((article) => (
              <BeritaItem data={article} key={article.url} />
            ))}
          </div>
          <Button asChild size={"sm"}>
            <Link href="/berita">Lihat lebih banyak</Link>
          </Button>
        </div>
        <div className="flex flex-col gap-1.5">
          <h4>Berita Internasional Terbaru</h4>
          <Separator />
          <div className="flex flex-col gap-1.5">
            {latestGlobal.articles.map((article) => (
              <BeritaItem data={article} key={article.url} />
            ))}
          </div>
          <Button asChild size={"sm"}>
            <Link href="/berita?tipe=global">Lihat lebih banyak</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
