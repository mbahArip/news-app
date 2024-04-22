import everythingMock from "~/data/everything.mock.json";
import sourcesMock from "~/data/sources.mock.json";
import topMock from "~/data/top.mock.json";
import { NewsAPICategory, NewsAPICountry, NewsAPIResponse } from "~/types";

class NewsAPI {
  private apiKey: string;
  private version: string;
  private mock: boolean = true;

  constructor(apiKey: string, version: string = "v2") {
    this.apiKey = apiKey;
    this.version = version;

    if (!this.apiKey) {
      throw new Error("API key is required");
    }
  }

  async getTopHeadlines(opts?: {
    country?: NewsAPICountry;
    category?: NewsAPICategory;
    sources?: string[];
    query?: string;
    pageSize?: number;
    page?: number;
  }): Promise<NewsAPIResponse<"articles">> {
    const { country, category, query, sources, pageSize, page } = opts || {};
    const endpoint = new URL(`/${this.version}/top-headlines`, "https://newsapi.org");
    if (country && sources && category) {
      throw new Error("Parameter sources tidak bisa digunakan bersama dengan country dan category");
    }
    if (country) endpoint.searchParams.set("country", country);
    if (category) endpoint.searchParams.set("category", category);
    if (query) endpoint.searchParams.set("q", encodeURIComponent(query));
    if (sources) endpoint.searchParams.set("sources", sources.join(","));
    if (pageSize) endpoint.searchParams.set("pageSize", pageSize.toString());
    if (page) endpoint.searchParams.set("page", page.toString());

    if (this.mock) {
      let data = topMock as NewsAPIResponse<"articles">;
      if (data.status === "error") return data;

      data.articles = data.articles.sort(() => Math.random() - 0.5);

      let currentSize = pageSize || 10;
      let currentPage = page || 1;

      if (query && query !== "*")
        data.articles = data.articles.filter((article) => article.title.toLowerCase().includes(query.toLowerCase()));
      data.articles = data.articles.slice((currentPage - 1) * currentSize, currentPage * currentSize);

      return data;
    }

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      next: {
        revalidate: 3600,
      },
    }).then((res) => res.json() as Promise<NewsAPIResponse<"articles">>);

    return response;
  }

  async getEverything(opts?: {
    query?: string;
    searchIn?: ("title" | "description" | "content")[];
    sources?: string[];
    language?: string;
    range?: {
      from: Date;
      to: Date;
    };
    sortBy?: "relevancy" | "popularity" | "publishedAt";
    pageSize?: number;
    page?: number;
  }): Promise<NewsAPIResponse<"articles">> {
    const { query, sources, searchIn, language, range, sortBy, pageSize, page } = opts || {};
    const endpoint = new URL(`/${this.version}/everything`, "https://newsapi.org");
    if (sources) endpoint.searchParams.set("sources", sources.join(","));
    if (language) endpoint.searchParams.set("language", language);
    if (query) endpoint.searchParams.set("q", encodeURIComponent(query));
    if (searchIn) {
      endpoint.searchParams.set("searchIn", searchIn.join(","));
    }
    if (range) {
      if (range.from) endpoint.searchParams.set("from", range.from.toISOString());
      if (range.to) endpoint.searchParams.set("to", range.to.toISOString());
    }
    if (sortBy) endpoint.searchParams.set("sortBy", sortBy);
    if (pageSize) endpoint.searchParams.set("pageSize", pageSize.toString());
    if (page) endpoint.searchParams.set("page", page.toString());

    if (this.mock) {
      let data = everythingMock as NewsAPIResponse<"articles">;
      if (data.status === "error") return data;
      if (!query) return { status: "error", code: "NoQuery", message: "Query is required" };

      data.articles = data.articles.sort(() => Math.random() - 0.5);

      let currentSize = pageSize || 10;
      let currentPage = page || 1;

      if (query && query !== "*")
        data.articles = data.articles.filter((article) => article.title.toLowerCase().includes(query.toLowerCase()));
      data.articles = data.articles.slice((currentPage - 1) * currentSize, currentPage * currentSize);
      if (sortBy) {
        data.articles = data.articles.sort((a, b) => {
          if (sortBy === "relevancy") return 0;
          if (sortBy === "popularity") return 0;
          if (sortBy === "publishedAt") return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
          return 0;
        });
      }
      return data;
    }

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      next: {
        revalidate: 3600,
      },
    }).then((res) => res.json() as Promise<NewsAPIResponse<"articles">>);

    return response;
  }

  async getSources(opts?: {
    category?: NewsAPICategory;
    language?: string;
    country?: NewsAPICountry;
  }): Promise<NewsAPIResponse<"sources">> {
    const { category, language, country } = opts || {};
    const endpoint = new URL(`/${this.version}/top-headlines/sources`, "https://newsapi.org");
    if (country) endpoint.searchParams.set("country", country);
    if (category) endpoint.searchParams.set("category", category);
    if (language) endpoint.searchParams.set("language", language);

    if (this.mock) {
      let data = sourcesMock as NewsAPIResponse<"sources">;
      if (data.status === "error") return data;

      return data;
    }

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      next: {
        revalidate: 3600,
      },
    }).then((res) => res.json() as Promise<NewsAPIResponse<"sources">>);

    return response;
  }
}

const newsAPI = new NewsAPI(process.env.NEWS_API_KEY);
export default newsAPI;
