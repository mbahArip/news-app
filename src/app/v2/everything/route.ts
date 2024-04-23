import { NextRequest, NextResponse } from "next/server";
import mockData from "~/data/everything.mock.json";
import { NewsAPIResponse, isNewsAPISortBy } from "~/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;
type Query = "q" | "pageSize" | "page" | "searchIn" | "sources" | "from" | "to" | "sortBy";

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
    const searchIn = searchParams.searchIn ? searchParams.searchIn.split(",") : ["title", "description", "content"];
    const start = pageSize * (page - 1);
    const end = pageSize * page;
    const sortBy = searchParams.sortBy || "relevancy";

    if (searchParams.sources) {
      const sources = searchParams.sources.split(",");
      const filtered = data.articles.filter((article) =>
        sources.some((source) => article.source.id === source || article.source.name === source)
      );
      data.articles = filtered;
    }
    if (searchParams.q && searchParams.q !== "*") {
      data.articles = data.articles.filter((article) => {
        return searchIn.some((key) => {
          return (article[key as keyof typeof article] as string)?.toLowerCase().includes(searchParams.q.toLowerCase());
        });
      });
    }
    if (searchParams.from && searchParams.to) {
      const from = new Date(searchParams.from);
      const to = new Date(searchParams.to);
      data.articles = data.articles.filter((article) => {
        const publishedAt = new Date(article.publishedAt);
        return publishedAt >= from && publishedAt <= to;
      });
    }
    if (sortBy) {
      if (!isNewsAPISortBy(sortBy)) {
        throw {
          name: "InvalidSortBy",
          message: "Invalid sortBy value",
        };
      }
      data.articles = data.articles.sort((a, b) => {
        if (sortBy === "relevancy") {
          return 0;
        }
        if (sortBy === "popularity") {
          return 1;
        }
        if (sortBy === "publishedAt") {
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        }
        return 0;
      });
    }

    data.articles = data.articles.filter((article) => article);
    const totalItems = data.articles.length;

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
