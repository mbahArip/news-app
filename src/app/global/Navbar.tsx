"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Skeleton } from "~/components/ui/skeleton";
import { useToast } from "~/components/ui/use-toast";
import { useMediaQuery, usePRouter } from "~/hooks";
import { cn } from "~/lib/utils";
import { Status } from "~/types";
import Icon from "./Icon";

const navigationMenu: {
  key: string;
  title: string;
  href: string;
}[] = [
  {
    key: "beranda",
    title: "Beranda",
    href: "/",
  },
  {
    key: "terkini",
    title: "Berita Terkini",
    href: "/berita",
  },
  {
    key: "kategori",
    title: "Kategori Berita",
    href: "/kategori",
  },
] as const;

export default function Navbar() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { toast } = useToast();
  const router = usePRouter();

  const [status, setStatus] = useState<Status>("loading");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [sidebar, setSidebar] = useState<boolean>(false);

  useEffect(() => {
    setStatus("idle");
  }, []);

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
      setSidebar(false);
    }
  };

  return (
    <nav
      className={cn(
        "w-full px-6 py-3",
        "bg-background border-b border-border",
        "drop-shadow",
        "flex items-center justify-between gap-6",
        "sticky top-0 z-50"
      )}
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Icon name="BookOpenText" size={"1.5rem"} />
          <h1 className="text-xl font-semibold">Beritaku</h1>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navigationMenu.map((menu) => (
            <Link key={menu.key} href={menu.href}>
              <span className={cn("font-medium text-sm whitespace-nowrap")}>{menu.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {status === "loading" ? (
        <Skeleton className="md:min-w-24 max-w-64 w-10 md:w-full h-10 rounded-[var(--radius)]" />
      ) : isDesktop ? (
        <form className="flex items-center" onSubmit={onSearch}>
          <Input name="query" placeholder="Cari berita" className="rounded-r-none min-w-24 max-w-64 w-full" />
          <Button size={"icon"} type="submit" className="rounded-l-none aspect-square" disabled={searchLoading}>
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
                <SheetTitle>Menu Utama</SheetTitle>
                <SheetDescription>
                  <p className="text-sm">Temukan berita terkini dari berbagai sumber terpercaya</p>
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col flex-grow overflow-auto gap-6">
                <form className="flex items-center" onSubmit={onSearch}>
                  <Input name="query" placeholder="Cari berita" className="w-full rounded-r-none" />
                  <Button size={"icon"} type="submit" className="rounded-l-none aspect-square" disabled={searchLoading}>
                    <Icon
                      name={searchLoading ? "LoaderCircle" : "Search"}
                      size={20}
                      className={cn(searchLoading ? "animate-spin" : null)}
                    />
                  </Button>
                </form>
                <Separator />
                <div className="flex flex-col flex-grow">
                  {navigationMenu.map((menu) => (
                    <SheetClose key={menu.key} asChild className="w-full">
                      <Button key={menu.key} variant={"ghost"} asChild>
                        <Link href={menu.href} className="w-full flex !justify-start">
                          {menu.title}
                        </Link>
                      </Button>
                    </SheetClose>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
    </nav>
  );
}
