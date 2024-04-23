import { NextRequest, NextResponse } from "next/server";
import mockData from "~/data/top.mock.json";
import { NewsAPIResponse } from "~/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;
type Query = "country" | "category" | "sources" | "q" | "pageSize" | "page";

export async function GET(request: NextRequest) {
  const sp = new URL(request.url).searchParams;
  const searchParams = Object.fromEntries(sp.entries()) as Record<Query, string>;
  try {
    let data = { ...mockData } as NewsAPIResponse<"articles">;
    if (data.status === "error") {
      throw {
        name: data.code,
        message: data.message,
      };
    }
    const pageSize = searchParams.pageSize ? parseInt(searchParams.pageSize) : 20;
    const page = searchParams.page ? parseInt(searchParams.page) : 1;
    const start = pageSize * (page - 1);
    const end = pageSize * page;
    const totalItems = data.totalResults;

    if (searchParams.sources) {
      const sources = searchParams.sources.split(",");
      const filtered = data.articles.filter((article) =>
        sources.some((source) => article.source.id === source || article.source.name === source)
      );
      data.articles = filtered;
    }
    if (searchParams.q && searchParams.q !== "*") {
      data.articles = data.articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchParams.q.toLowerCase()) ||
          article.description.toLowerCase().includes(searchParams.q.toLowerCase()) ||
          article.content?.toLowerCase().includes(searchParams.q.toLowerCase())
      );
    }

    data.articles = data.articles.filter((article) => article);

    data.articles = data.articles.slice(start, end);
    const payload: NewsAPIResponse<"articles"> = {
      status: "ok",
      totalResults: totalItems,
      articles: data.articles,
    } satisfies NewsAPIResponse<"articles">;

    return NextResponse.json(payload);
  } catch (error) {
    const e = error as Error;
    const payload: NewsAPIResponse<"articles"> = {
      status: "error",
      code: e.name,
      message: e.message,
    };

    return NextResponse.json(payload, {
      status: 500,
    });
  }
}
