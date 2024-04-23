import { Metadata } from "next";
import Link from "next/link";
import { Separator } from "~/components/ui/separator";
import { categoriesMenu } from "~/data/categories";
import Icon from "../global/Icon";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Kategori Berita",
  description: "Silahkan pilih kategori berita yang diinginkan.",
};

export default async function Kategori() {
  return (
    <div className="p-3 md:p-6 w-full max-w-screen-lg mx-auto flex flex-col gap-3">
      <h2>Kategori Berita</h2>
      <p>Silahkan pilih kategori berita yang diinginkan.</p>

      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
        {categoriesMenu.map((item) => (
          <Link
            key={item.key}
            href={`/kategori/${item.key}`}
            className="flex flex-col border border-border rounded-[var(--radius)] px-3 py-1.5
                hover:bg-muted transition"
          >
            <div className="flex items-center gap-1.5">
              <Icon name={item.icon} size={24} />
              <h4>{item.title}</h4>
            </div>
            <span className="text-sm text-muted-foreground">{item.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
