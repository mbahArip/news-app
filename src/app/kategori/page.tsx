import Link from "next/link";
import { Separator } from "~/components/ui/separator";
import { categoriesMenu } from "~/data/categories";
import Icon from "../global/Icon";

export const revalidate = 3600;

export default async function Kategori() {
  return (
    <div className="p-3 md:p-6 w-full max-w-screen-lg mx-auto flex flex-col gap-3">
      <h2>Kategori</h2>
      <p>Silahkan pilih kategori berita yang diinginkan.</p>

      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
        {categoriesMenu.map((item) => (
          <Link key={`kategori-${item.key}`} href={`/kategori/${item.key}`}>
            <div className="items-start justify-start flex flex-col w-full hover:bg-muted p-3 rounded-[var(--radius)] transition-colors">
              <div className="flex items-center gap-1.5">
                <Icon name={item.icon} size={18} />
                <span className="text-xl font-semibold">{item.title}</span>
              </div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
