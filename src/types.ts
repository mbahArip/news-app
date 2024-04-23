declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEWS_API_KEY: string;
    }
  }
}

const newsApiCountry = [
  "us",
  "gb",
  "id",
  "ca",
  "jp",
  "kr",
  "fr",
  "in",
  "de",
  "au",
  "br",
  "ru",
  "it",
  "nl",
  "es",
  "se",
  "no",
  "pl",
  "be",
  "cn",
  "hk",
  "tw",
  "sg",
  "th",
  "za",
] as const;
export type NewsAPICountry = (typeof newsApiCountry)[number];
export const isNewsAPICountry = (value: string): value is NewsAPICountry =>
  newsApiCountry.includes(value as NewsAPICountry);

const newsApiCategory = ["business", "entertainment", "general", "health", "science", "sports", "technology"] as const;
export type NewsAPICategory = (typeof newsApiCategory)[number];
export const isNewsAPICategory = (value: string): value is NewsAPICategory =>
  newsApiCategory.includes(value as NewsAPICategory);

const newsApiLanguage = ["ar", "de", "en", "es", "fr", "he", "it", "nl", "no", "pt", "ru", "se", "ud", "zh"] as const;
export type NewsAPILanguage = (typeof newsApiLanguage)[number];
export const isNewsAPILanguage = (value: string): value is NewsAPILanguage =>
  newsApiLanguage.includes(value as NewsAPILanguage);

const newsApiSearchIn = ["title", "description", "content"] as const;
export type NewsAPISearchIn = (typeof newsApiSearchIn)[number];
export const isNewsAPISearchIn = (value: string): value is NewsAPISearchIn =>
  newsApiSearchIn.includes(value as NewsAPISearchIn);

const newsApiSortBy = ["relevancy", "popularity", "publishedAt"] as const;
export type NewsAPISortBy = (typeof newsApiSortBy)[number];
export const isNewsAPISortBy = (value: string): value is NewsAPISortBy =>
  newsApiSortBy.includes(value as NewsAPISortBy);

export type NewsAPIArticle = {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
};
export type NewsAPISource = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: NewsAPICategory;
  language: NewsAPICountry;
  country: NewsAPICountry;
};
type NewsAPISuccessArticles = {
  status: "ok";
  totalResults: number;
  articles: NewsAPIArticle[];
};
type NewsAPISuccessSources = {
  status: "ok";
  sources: NewsAPISource[];
};
type NewsAPIError = {
  status: "error";
  code: string;
  message: string;
};
export type NewsAPIResponse<T = "articles" | "sources"> =
  | (T extends "articles" ? NewsAPISuccessArticles : NewsAPISuccessSources)
  | NewsAPIError;

export type Status = "loading" | "idle" | "error" | "success";
