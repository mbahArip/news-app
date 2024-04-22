"use client";

import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "~/components/ui/carousel";
import { NewsAPIArticle } from "~/types";
import Icon from "./global/Icon";

type Props = {
  data: NewsAPIArticle[];
};
export default function CarouselAutoplay({ data }: Props) {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent className="-ml-0">
        {data.map((article) => (
          <CarouselItem key={article.title} className="pl-0">
            <div className="w-full relative h-[50dvh]">
              {article.urlToImage ? (
                <img
                  src={article.urlToImage || "/no-image.webp"}
                  alt={article.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full select-none flex items-center justify-center flex-col">
                  <Icon name="Frown" size={48} />
                  <span>
                    <span className="font-semibold">Gambar tidak tersedia</span>
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 h-fit top-auto inset-0 flex md:flex-row flex-col justify-between items-end p-4 text-white gap-6">
                <div className="flex flex-col gap-1">
                  <Link href={article.url} target="_blank" rel={"noopener noreferrer"}>
                    <h2 className="text-balance text-lg md:text-2xl underline underline-offset-2">{article.title}</h2>
                  </Link>
                  <div className="flex flex-col md:flex-row md:items-center gap-1.5 text-xs text-primary-foreground/75 font-medium pb-1.5">
                    {article.author && <span>Ditulis oleh: {article.author}</span>}
                    {article.source.name && <span>Diterbitkan di: {article.source.name}</span>}
                  </div>
                  <p className="text-sm hidden md:block text-primary-foreground/75 text-pretty line-clamp-2">
                    {article.description}
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
