import type { PageBlock, BlockTeamData } from "~/types/content";
import type { BlockContext } from "./BlockRenderer";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H2, H4, Lead, Small, Text } from "~/components/common/Typography";
import { StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";
import { Card, CardContent } from "~/components/ui/card";
import { getAssetUrl } from "~/lib/directus.server";

export function BlockTeam({ block, context }: { block: PageBlock; context?: BlockContext }) {
  const data = block.item as unknown as BlockTeamData;
  const team = context?.team || [];

  if (team.length === 0) return null;

  return (
    <Section>
      <Container>
        {(data.title || data.subtitle) && (
          <div className="mb-12 text-center">
            {data.title && <H2>{data.title}</H2>}
            {data.subtitle && <Lead className="mt-4">{data.subtitle}</Lead>}
          </div>
        )}

        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <StaggerItem key={member.id}>
              <Card className="text-center h-full">
                <CardContent className="pt-8 pb-6">
                  {member.photo ? (
                    <img
                      src={typeof member.photo === "string" && member.photo.startsWith("http") ? member.photo : `/assets/${member.photo}`}
                      alt={member.name}
                      className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl text-primary">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}
                  <H4>{member.name}</H4>
                  <Small>{member.role}</Small>
                  {member.bio && <Text className="mt-3 text-sm">{member.bio}</Text>}
                  {member.social_links && member.social_links.length > 0 && (
                    <div className="mt-4 flex justify-center gap-3">
                      {member.social_links.map((link) => (
                        <a
                          key={link.platform}
                          href={link.url}
                          className="text-xs text-muted-foreground hover:text-foreground capitalize transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.platform}
                        </a>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </Section>
  );
}
