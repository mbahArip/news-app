import { NextRequest, NextResponse } from "next/server";
import mockData from "~/data/sources.mock.json";
import { NewsAPIResponse, isNewsAPICategory, isNewsAPICountry, isNewsAPILanguage } from "~/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;
type Query = "country" | "category" | "language";

export async function GET(request: NextRequest) {
  const sp = new URL(request.url).searchParams;
  const searchParams = Object.fromEntries(sp.entries()) as Record<Query, string>;
  try {
    let data = { ...mockData } as NewsAPIResponse<"sources">;
    if (data.status === "error") {
      throw {
        name: data.code,
        message: data.message,
      };
    }

    if (searchParams.country) {
      if (!isNewsAPICountry(searchParams.country))
        throw {
          name: "InvalidCountry",
          message: "Invalid country code",
        };
      data.sources = data.sources.filter((source) => source.country === searchParams.country);
    }
    if (searchParams.category) {
      if (!isNewsAPICategory(searchParams.category))
        throw {
          name: "InvalidCategory",
          message: "Invalid category",
        };
      data.sources = data.sources.filter((source) => source.category === searchParams.category);
    }
    if (searchParams.language) {
      if (!isNewsAPILanguage(searchParams.language))
        throw {
          name: "InvalidLanguage",
          message: "Invalid language code",
        };
      data.sources = data.sources.filter((source) => source.language === searchParams.language);
    }

    const payload: NewsAPIResponse<"sources"> = {
      status: "ok",
      sources: data.sources,
    } satisfies NewsAPIResponse<"sources">;

    return NextResponse.json(payload);
  } catch (error) {
    const e = error as Error;
    const payload: NewsAPIResponse<"sources"> = {
      status: "error",
      code: e.name,
      message: e.message,
    };

    return NextResponse.json(payload, {
      status: 500,
    });
  }
}
