import type { PageBlock, Article, TeamMember, Testimonial } from "~/types/content";
import { BlockHero } from "./BlockHero";
import { BlockHeroSimple } from "./BlockHeroSimple";
import { BlockCTA } from "./BlockCTA";
import { BlockContent } from "./BlockContent";
import { BlockFeatures } from "./BlockFeatures";
import { BlockTestimonials } from "./BlockTestimonials";
import { BlockFAQ } from "./BlockFAQ";
import { BlockStats } from "./BlockStats";
import { BlockImageText } from "./BlockImageText";
import { BlockTeam } from "./BlockTeam";
import { BlockAbout } from "./BlockAbout";
import { BlockContact } from "./BlockContact";
import { BlockNewsletter } from "./BlockNewsletter";
import { BlockArticles } from "./BlockArticles";
import { BlockGallery } from "./BlockGallery";

const blockComponents: Record<string, React.ComponentType<{ block: PageBlock; context?: BlockContext }>> = {
  block_hero: BlockHero,
  block_hero_simple: BlockHeroSimple,
  block_cta: BlockCTA,
  block_content: BlockContent,
  block_features: BlockFeatures,
  block_testimonials: BlockTestimonials,
  block_faq: BlockFAQ,
  block_stats: BlockStats,
  block_image_text: BlockImageText,
  block_team: BlockTeam,
  block_about: BlockAbout,
  block_contact: BlockContact,
  block_newsletter: BlockNewsletter,
  block_articles: BlockArticles,
  block_gallery: BlockGallery,
};

export interface BlockContext {
  articles?: Article[];
  team?: TeamMember[];
  testimonials?: Testimonial[];
}

interface BlockRendererProps {
  blocks: PageBlock[];
  articles?: Article[];
  team?: TeamMember[];
  testimonials?: Testimonial[];
}

export function BlockRenderer({ blocks, articles, team, testimonials }: BlockRendererProps) {
  const context: BlockContext = { articles, team, testimonials };

  return (
    <>
      {blocks.map((block) => {
        const Component = blockComponents[block.collection];
        if (!Component) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`Unknown block type: ${block.collection}`);
          }
          return null;
        }
        return <Component key={block.id} block={block} context={context} />;
      })}
    </>
  );
}

export function getAvailableBlockTypes(): string[] {
  return Object.keys(blockComponents);
}
