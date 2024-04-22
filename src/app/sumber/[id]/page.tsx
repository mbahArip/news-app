import BeritaItem from "~/app/Berita.client";
import { Separator } from "~/components/ui/separator";
import newsAPI from "~/lib/news";

export const revalidate = 3600;

type Props = {
  params: {
    id: string;
  };
};

export default async function SumberId({ params }: Props) {
  const data = await newsAPI.getTopHeadlines({
    sources: [params.id],
  });
  if (data.status === "error") {
    throw new Error(data.message);
  }
  const title = data.articles[0].source.name;

  return (
    <div className="p-3 md:p-6 w-full max-w-screen-lg mx-auto flex flex-col gap-3">
      <h2>{title}</h2>
      <p>
        List berita dari sumber berita <strong>{title}</strong>
      </p>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
        {data.articles.map((article) => (
          <BeritaItem data={article} key={article.url} />
        ))}
      </div>
    </div>
  );
}
