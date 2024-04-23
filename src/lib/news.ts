import {
  NewsAPICategory,
  NewsAPICountry,
  NewsAPILanguage,
  NewsAPIResponse,
  NewsAPISearchIn,
  NewsAPISortBy,
} from "~/types";

class NewsAPI {
  private baseUrl = "https://newsapi.org";
  private apiKey: string;
  private version: string;
  private mock: boolean = true;

  constructor(apiKey: string, version: string = "v2") {
    this.apiKey = apiKey;
    this.version = version;
    if (this.mock) {
      this.baseUrl = "http://localhost:3000";
    } else {
      if (!this.apiKey) {
        throw new Error("API key is required");
      }
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
    const endpoint = new URL(`/${this.version}/top-headlines`, this.baseUrl);
    if (country && sources && category) {
      throw new Error("Parameter sources tidak bisa digunakan bersama dengan country dan category");
    }
    if (country) endpoint.searchParams.set("country", country);
    if (category) endpoint.searchParams.set("category", category);
    if (query) endpoint.searchParams.set("q", encodeURIComponent(query));
    if (sources) endpoint.searchParams.set("sources", sources.join(","));
    if (pageSize) endpoint.searchParams.set("pageSize", pageSize.toString());
    if (page) endpoint.searchParams.set("page", page.toString());

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      ...(this.mock && { next: { revalidate: 3600 } }),
    }).then((res) => res.json() as Promise<NewsAPIResponse<"articles">>);

    return response;
  }

  async getEverything(opts?: {
    query?: string;
    searchIn?: NewsAPISearchIn[];
    sources?: string[];
    language?: NewsAPILanguage;
    range?: {
      from: Date;
      to: Date;
    };
    sortBy?: NewsAPISortBy;
    pageSize?: number;
    page?: number;
  }): Promise<NewsAPIResponse<"articles">> {
    const { query, sources, searchIn, language, range, sortBy, pageSize, page } = opts || {};
    const endpoint = new URL(`/${this.version}/everything`, this.baseUrl);
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

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      ...(this.mock && { next: { revalidate: 3600 } }),
    }).then((res) => res.json() as Promise<NewsAPIResponse<"articles">>);

    return response;
  }

  async getSources(opts?: {
    category?: NewsAPICategory;
    language?: NewsAPILanguage;
    country?: NewsAPICountry;
  }): Promise<NewsAPIResponse<"sources">> {
    const { category, language, country } = opts || {};
    const endpoint = new URL(`/${this.version}/top-headlines/sources`, this.baseUrl);
    if (country) endpoint.searchParams.set("country", country);
    if (category) endpoint.searchParams.set("category", category);
    if (language) endpoint.searchParams.set("language", language);

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      ...(this.mock && { next: { revalidate: 3600 } }),
    }).then((res) => res.json() as Promise<NewsAPIResponse<"sources">>);

    return response;
  }
}

const newsAPI = new NewsAPI(process.env.NEWS_API_KEY);
export default newsAPI;
