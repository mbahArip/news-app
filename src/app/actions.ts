"use server";

import newsAPI from "~/lib/news";
import { NewsAPILanguage, NewsAPIResponse, NewsAPISearchIn, NewsAPISortBy } from "~/types";

export async function GetEverything(opts?: {
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
  return await newsAPI.getEverything(opts);
}
