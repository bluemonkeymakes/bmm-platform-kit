import type { MetaFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getPage, getTeam } from "~/lib/directus.server";
import { withFallback } from "~/content/mode.server";
import { BlockRenderer } from "~/components/blocks/BlockRenderer";
import { defaultAboutBlocks, defaultTeamMembers } from "~/data/defaults";

export const meta: MetaFunction = () => [
  { title: "About | Starter Kit" },
  { name: "description", content: "Learn more about our team and mission." },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const [page, team] = await Promise.all([getPage("about"), getTeam()]);

  return {
    blocks: withFallback("about blocks", page?.blocks, defaultAboutBlocks),
    team: withFallback("about team", team, defaultTeamMembers),
  };
}

export default function About() {
  const { blocks, team } = useLoaderData<typeof loader>();

  return <BlockRenderer blocks={blocks} team={team} />;
}
