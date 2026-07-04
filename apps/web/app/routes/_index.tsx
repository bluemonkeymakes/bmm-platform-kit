import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getPage, getArticles, getTestimonials } from "~/lib/directus.server";
import { withFallback } from "~/content/mode.server";
import { BlockRenderer } from "~/components/blocks/BlockRenderer";
import {
  defaultHomeBlocks,
  defaultArticles,
  defaultTestimonials,
} from "~/data/defaults";

export const meta: MetaFunction = () => [
  { title: "Home | Starter Kit" },
  { name: "description", content: "A production-ready full-stack starter with CMS and CRM." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const [page, articles, testimonials] = await Promise.all([
    getPage("home"),
    getArticles(3),
    getTestimonials(),
  ]);

  // CMS content when present, static defaults otherwise — per CONTENT_MODE
  return {
    blocks: withFallback("home blocks", page?.blocks, defaultHomeBlocks),
    articles: withFallback("home articles", articles, defaultArticles),
    testimonials: withFallback("home testimonials", testimonials, defaultTestimonials),
  };
}

export default function Index() {
  const { blocks, articles, testimonials } = useLoaderData<typeof loader>();

  return <BlockRenderer blocks={blocks} articles={articles} testimonials={testimonials} />;
}
