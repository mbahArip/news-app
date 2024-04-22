declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEWS_API_KEY: string;
    }
  }
}

export type NewsAPICountry =
  | "us"
  | "gb"
  | "id"
  | "ca"
  | "jp"
  | "kr"
  | "fr"
  | "in"
  | "de"
  | "au"
  | "br"
  | "ru"
  | "it"
  | "nl"
  | "es"
  | "se"
  | "no"
  | "pl"
  | "be"
  | "cn"
  | "hk"
  | "tw"
  | "sg"
  | "th"
  | "za";

export type NewsAPICategory = "business" | "entertainment" | "general" | "health" | "science" | "sports" | "technology";

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
