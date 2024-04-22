import { icons } from "lucide-react";
import BeritaItem from "~/app/Berita.client";
import { Separator } from "~/components/ui/separator";
import newsAPI from "~/lib/news";
import { NewsAPICategory } from "~/types";

export const revalidate = 3600;

type Props = {
  params: {
    id: NewsAPICategory;
  };
};

const Categories: Record<
  NewsAPICategory,
  {
    title: string;
    description: string;
    icon: keyof typeof icons;
  }
> = {
  business: {
    title: "Bisnis",
    description: "Berita seputar dunia bisnis",
    icon: "Briefcase",
  },
  entertainment: {
    title: "Hiburan",
    description: "Berita seputar dunia hiburan",
    icon: "Film",
  },
  general: {
    title: "Umum",
    description: "Berita umum",
    icon: "Globe",
  },
  health: {
    title: "Kesehatan",
    description: "Berita seputar dunia kesehatan",
    icon: "Heart",
  },
  science: {
    title: "Sains",
    description: "Berita seputar dunia sains",
    icon: "FlaskConical",
  },
  sports: {
    title: "Olahraga",
    description: "Berita seputar dunia olahraga",
    icon: "Award",
  },
  technology: {
    title: "Teknologi",
    description: "Berita seputar dunia teknologi",
    icon: "Smartphone",
  },
};
export default async function KategoriId({ params }: Props) {
  const data = await newsAPI.getTopHeadlines({
    category: params.id,
  });
  if (data.status === "error") {
    throw new Error(data.message);
  }

  return (
    <div className="p-3 md:p-6 w-full max-w-screen-lg mx-auto flex flex-col gap-3">
      <h2>{Categories[params.id].title}</h2>
      <p>{Categories[params.id].description}</p>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
        {data.articles.map((article) => (
          <BeritaItem data={article} key={article.url} />
        ))}
      </div>
    </div>
  );
}
