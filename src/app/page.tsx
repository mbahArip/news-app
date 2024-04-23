import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { categoriesMenu } from "~/data/categories";
import newsAPI from "~/lib/news";
import BeritaItem from "./Berita.client";
import CarouselAutoplay from "./Carousel.client";
import Icon from "./global/Icon";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const _top = newsAPI.getTopHeadlines({
    country: "us",
    pageSize: 5,
  });
  const _latest = newsAPI.getEverything({
    query: "*",
    sortBy: "publishedAt",
    pageSize: 5,
  });

  const [top, latest] = await Promise.all([_top, _latest]);
  if (top.status === "error") {
    throw new Error(top.message);
  }
  if (latest.status === "error") {
    throw new Error(latest.message);
  }

  return (
    <>
      <CarouselAutoplay data={top.articles} />
      <div className="grid grid-cols-1 md:grid-cols-3 p-3 md:p-6 gap-6 max-w-screen-lg mx-auto w-full">
        <div className="grid md:col-span-2 grid-cols-1 w-full gap-1.5">
          <div className="col-span-full flex flex-col gap-1.5">
            <h4>Berita Terkini</h4>
            <Separator />
          </div>
          {latest.articles.map((article) => (
            <BeritaItem data={article} key={article.url} />
          ))}
          <Button asChild className="col-span-full">
            <Link href="/berita">Lihat lebih banyak</Link>
          </Button>
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <h4>Kategori Berita</h4>
          <Separator />
          <div className="flex flex-col gap-1">
            {categoriesMenu.map((category) => (
              <Link
                key={category.key}
                href={`/kategori/${category.key}`}
                className="flex flex-col border border-border rounded-[var(--radius)] px-3 py-1.5
                hover:bg-muted transition"
              >
                <div className="flex items-center gap-1.5">
                  <Icon name={category.icon} size={24} />
                  <h4>{category.title}</h4>
                </div>
                <span className="text-sm text-muted-foreground">{category.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
