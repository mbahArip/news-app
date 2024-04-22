"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Skeleton } from "~/components/ui/skeleton";
import { useToast } from "~/components/ui/use-toast";
import { categoriesMenu } from "~/data/categories";
import useMediaQuery from "~/hooks/useMediaQuery";
import { cn } from "~/lib/utils";
import { NewsAPISource } from "~/types";
import Icon from "./Icon";

type Props = {
  sources: NewsAPISource[];
};
export default function Navbar({ sources }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { toast } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);

  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [shownSources, setShownSources] = useState<NewsAPISource[]>(sources);
  const [searchSource, setSearchSource] = useState<string>("");
  const [sidebar, setSidebar] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!searchSource) return setShownSources(sources);

    const filteredSources = sources.filter((source) => source.name.toLowerCase().includes(searchSource.toLowerCase()));
    setShownSources(filteredSources);
  }, [searchSource, sources]);

  useEffect(() => {
    if (isDesktop) setSidebar(false);
  }, [isDesktop]);

  const onSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchLoading(true);

    try {
      const query = new FormData(e.currentTarget).get("query");
      if (!query) {
        throw new Error("Tidak ada query pencarian");
      }

      router.push(`/pencarian?q=${query}`);
      e.currentTarget.reset();
    } catch (error) {
      const e = error as Error;
      toast({
        title: "Gagal mencari berita",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <nav
      className={cn(
        "w-full px-6 py-3",
        "bg-background border-b border-border",
        "drop-shadow",
        "flex items-center justify-between gap-6",
        "relative top-0 z-50"
      )}
    >
      <div className="flex items-center gap-6">
        <Link href="/">
          <div className="flex items-center gap-3">
            <Icon name="BookOpenText" size={"1.5rem"} />
            <h1 className="text-xl font-semibold">Beritaku</h1>
          </div>
        </Link>
        {loading ? (
          <Skeleton className="w-0 h-0 md:w-52 md:h-12" />
        ) : isDesktop ? (
          <div className="flex items-center flex-grow-0 w-fit">
            <NavigationMenu
              onValueChange={(e) => {
                setTimeout(() => {
                  setSearchSource("");
                }, 150);
              }}
              delayDuration={150}
            >
              <NavigationMenuList className="m-0">
                {/* Kategori berita */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Kategori</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 w-[30dvw] p-3">
                      {categoriesMenu.map((item) => (
                        <Link key={`nav-${item.key}`} href={`/kategori/${item.key}`} legacyBehavior passHref>
                          <NavigationMenuLink className="items-start justify-start flex flex-col w-full hover:bg-muted p-3 rounded-[var(--radius)] transition-colors">
                            <div className="flex items-center gap-1.5">
                              <Icon name={item.icon} size={18} />
                              <span className="text-xl font-semibold">{item.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </NavigationMenuLink>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Sumber berita */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Sumber Berita</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 w-[50dvw] h-fit max-h-[75dvh] overflow-auto gap-3 p-3">
                      <div className="flex flex-col col-span-full gap-3">
                        <h4>Tampilkan sumber berita yang kamu inginkan.</h4>
                        <Input placeholder="Cari sumber berita" onChange={(e) => setSearchSource(e.target.value)} />
                        <Separator />
                      </div>
                      {shownSources.length === 0 ? (
                        <div className="w-full h-64 flex flex-col items-center justify-center col-span-full">
                          <Icon name="Frown" size={32} />
                          <span>Sumber berita tidak ditemukan</span>
                        </div>
                      ) : (
                        shownSources.map((source) => (
                          <Link
                            key={`source-${source.id}`}
                            href={`/sumber/${source.id}`}
                            className="items-start justify-start flex flex-col w-full hover:bg-muted p-3 rounded-[var(--radius)] transition-colors"
                          >
                            <span className="text-lg font-semibold">{source.name}</span>
                            <p className="text-xs text-muted-foreground line-clamp-2">{source.description}</p>
                          </Link>
                        ))
                      )}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        ) : null}
      </div>
      {loading ? (
        <Skeleton className="w-10 h-10 py-2" />
      ) : isDesktop ? (
        <form className="flex items-center" onSubmit={onSearch}>
          <Input name="query" placeholder="Cari berita" className="rounded-r-none w-64" />
          <Button size={"icon"} type="submit" className="rounded-l-none" disabled={searchLoading}>
            <Icon
              name={searchLoading ? "LoaderCircle" : "Search"}
              size={20}
              className={cn(searchLoading ? "animate-spin" : null)}
            />
          </Button>
        </form>
      ) : (
        <>
          <Sheet open={sidebar} onOpenChange={setSidebar}>
            <SheetTrigger>
              <Button size={"icon"} variant={"ghost"}>
                <Icon name="Menu" size={24} className="text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent className="z-[10000] h-screen flex flex-col gap-3 w-full max-w-md">
              <SheetHeader className="text-start">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col flex-grow overflow-auto gap-3">
                <Button size={"sm"} variant={"ghost"} className="w-full">
                  <Link href="/" className="w-full flex items-start gap-1.5">
                    <Icon name="Home" size={18} />
                    <span>Beranda</span>
                  </Link>
                </Button>
                <Button size={"sm"} variant={"ghost"} className="w-full">
                  <Link href="/kategori" className="w-full flex items-start gap-1.5">
                    <Icon name="LayoutGrid" size={18} />
                    <span>Kategori</span>
                  </Link>
                </Button>
                <Button size={"sm"} variant={"ghost"} className={"w-full"}>
                  <Link href={"/sumber"} className={"w-full flex items-start gap-1.5"}>
                    <Icon name={"Users"} size={18} />
                    <span>Sumber Berita</span>
                  </Link>
                </Button>

                <Separator />

                <form className="flex items-center flex-col gap-1.5 p-1" onSubmit={onSearch}>
                  <Input name="query" placeholder="Cari berita" className="w-full" />
                  <Button size={"sm"} type="submit" className="w-full gap-1.5" disabled={searchLoading}>
                    <Icon
                      name={searchLoading ? "LoaderCircle" : "Search"}
                      size={16}
                      className={cn(searchLoading ? "animate-spin" : null)}
                    />
                    Cari
                  </Button>
                </form>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button size={"sm"} variant={"default"} className="w-full">
                    Tutup Menu
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </>
      )}
    </nav>
  );
}
