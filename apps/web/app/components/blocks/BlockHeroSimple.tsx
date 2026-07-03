import type { PageBlock, BlockHeroSimpleData } from "~/types/content";
import { PageHero } from "~/components/common/PageHero";

export function BlockHeroSimple({ block }: { block: PageBlock }) {
  const data = block.item as unknown as BlockHeroSimpleData;

  return <PageHero label={data.label} title={data.title} subtitle={data.subtitle} />;
}
