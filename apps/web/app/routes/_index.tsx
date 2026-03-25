import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getPage, getArticles, getTestimonials } from "~/lib/directus.server";
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

  // Use CMS blocks if available, otherwise fall back to defaults
  const blocks = page?.blocks?.length ? page.blocks : defaultHomeBlocks;

  return {
    blocks,
    articles: articles.length ? articles : defaultArticles,
    testimonials: testimonials.length ? testimonials : defaultTestimonials,
  };
}

export default function Index() {
  const { blocks, articles, testimonials } = useLoaderData<typeof loader>();

  return <BlockRenderer blocks={blocks} articles={articles} testimonials={testimonials} />;
}
