import { Metadata } from "next";
import { categoriesMenu } from "~/data/categories";
import newsAPI from "~/lib/news";
import { NewsAPICategory, NewsAPISortBy } from "~/types";
import KategoriResult from "./Results.client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: {
    id: NewsAPICategory;
  };
  searchParams: {
    page?: string;
    sortBy?: NewsAPISortBy;
  };
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const currentCategories = categoriesMenu.find((category) => category.key === params.id);
  return {
    title: `Berita ${currentCategories?.title}`,
    description: currentCategories?.description,
  };
}

export default async function KategoriDetail({ params, searchParams }: Props) {
  const currentCategories = categoriesMenu.find((category) => category.key === params.id);
  const itemsPerPage = 10;
  const response = await newsAPI.getSources({ category: params.id });
  if (response.status === "error") {
    throw {
      status: response.status,
      message: response.message,
    };
  }
  const sources = response.sources;

  const results = await newsAPI.getEverything({
    pageSize: itemsPerPage,
    sortBy: searchParams.sortBy || "publishedAt",
    sources: Array.isArray(sources) ? sources.slice(0, 20).map((source) => source.id) : undefined,
    page: parseInt(searchParams.page || "1"),
    language: "en",
  });
  if (results.status === "error") {
    console.error(results.message);
    throw new Error(results.message);
  }
  return (
    <div className="p-3 md:p-6 w-full max-w-screen-lg mx-auto flex flex-col gap-3">
      <KategoriResult
        initialData={results}
        currentCategories={currentCategories}
        pagination={{ itemsPerPage, page: parseInt(searchParams.page || "1"), totalResults: results.totalResults }}
        sortBy={searchParams.sortBy}
      />
    </div>
  );
}
