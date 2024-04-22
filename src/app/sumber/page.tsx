import { Separator } from "~/components/ui/separator";
import newsAPI from "~/lib/news";
import SumberData from "./Sumber.client";

export const revalidate = 3600;

export default async function Sumber() {
  const sumber = await newsAPI.getSources();

  if (sumber.status === "error") {
    throw new Error(sumber.message);
  }

  return (
    <div className="p-3 md:p-6 w-full max-w-screen-lg mx-auto flex flex-col gap-3">
      <h2>Sumber Berita</h2>
      <p>Silahkan pilih sumber berita yang anda percaya.</p>

      <Separator />
      <SumberData data={sumber.sources} />
    </div>
  );
}
