import type { MetaFunction } from "react-router";
import { Container } from "~/components/common/Container";
import { Section } from "~/components/common/Section";
import { H1, H2, H3, H4, H5, H6, SectionLabel, Lead, Text, Small, InlineCode, Prose } from "~/components/common/Typography";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Tooltip } from "~/components/ui/tooltip";
import { Spinner } from "~/components/ui/spinner";
import { FadeIn, StaggerContainer, StaggerItem } from "~/components/common/MotionWrapper";
import { useState } from "react";
import { Info } from "lucide-react";

export const meta: MetaFunction = () => [
  { title: "Style Guide | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function StyleGuide() {
  return (
    <>
      <section className="border-b bg-muted/30 py-16 md:py-24">
        <Container size="narrow" className="text-center">
          <FadeIn>
            <SectionLabel>Development</SectionLabel>
            <H1 className="mt-2">Style Guide</H1>
            <Lead className="mt-4">Component library, type hierarchy, and design tokens.</Lead>
          </FadeIn>
        </Container>
      </section>

      {/* ================================================================
          TYPE HIERARCHY
          ================================================================ */}
      <Section>
        <Container>
          <H2 className="mb-4">Type Hierarchy</H2>
          <Text className="mb-8">
            Headings use <InlineCode>Geist</InlineCode> (serif, variable).
            Body uses <InlineCode>Source Sans 3</InlineCode> (sans, variable).
            Code uses <InlineCode>JetBrains Mono</InlineCode> (mono, variable).
          </Text>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Display scale */}
            <div className="space-y-8">
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Display / Headings &mdash; font-display (Geist)
                </p>
                <Separator className="mb-6" />
                <div className="space-y-6">
                  <div>
                    <H1>Heading 1</H1>
                    <Small className="mt-1">H1 &mdash; 4xl/5xl/6xl &middot; semibold &middot; tracking-tight</Small>
                  </div>
                  <div>
                    <H2>Heading 2</H2>
                    <Small className="mt-1">H2 &mdash; 3xl/4xl &middot; semibold &middot; tracking-tight</Small>
                  </div>
                  <div>
                    <H3>Heading 3</H3>
                    <Small className="mt-1">H3 &mdash; 2xl &middot; semibold &middot; tracking-tight</Small>
                  </div>
                  <div>
                    <H4>Heading 4</H4>
                    <Small className="mt-1">H4 &mdash; xl &middot; semibold &middot; tracking-tight</Small>
                  </div>
                  <div>
                    <H5>Heading 5</H5>
                    <Small className="mt-1">H5 &mdash; lg &middot; semibold</Small>
                  </div>
                  <div>
                    <H6>Heading 6</H6>
                    <Small className="mt-1">H6 &mdash; base &middot; semibold</Small>
                  </div>
                </div>
              </div>
            </div>

            {/* Body scale */}
            <div className="space-y-8">
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Body / UI &mdash; font-sans (sans-serif)
                </p>
                <Separator className="mb-6" />
                <div className="space-y-6">
                  <div>
                    <SectionLabel>Section Label</SectionLabel>
                    <Small className="mt-1">SectionLabel &mdash; sm &middot; semibold &middot; uppercase &middot; tracking-widest</Small>
                  </div>
                  <div>
                    <Lead>Lead text for introductions and hero subtitles. Larger, lighter weight.</Lead>
                    <Small className="mt-1">Lead &mdash; lg/xl &middot; muted-foreground</Small>
                  </div>
                  <div>
                    <Text>Body text for general content, descriptions, and card copy. The workhorse of the type system.</Text>
                    <Small className="mt-1">Text &mdash; base &middot; muted-foreground &middot; leading-relaxed</Small>
                  </div>
                  <div>
                    <Small>Small text for captions, timestamps, and metadata.</Small>
                    <Small className="mt-1">Small &mdash; sm &middot; muted-foreground</Small>
                  </div>
                  <div>
                    <p>
                      Inline code: <InlineCode>npm run dev</InlineCode>
                    </p>
                    <Small className="mt-1">InlineCode &mdash; mono &middot; sm &middot; bg-muted &middot; rounded</Small>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Prose &mdash; rich content (typography plugin)
                </p>
                <Separator className="mb-6" />
                <Prose>
                  <p>
                    Prose wraps CMS content with proper spacing, link styles, list formatting, and heading
                    hierarchy via <code>@tailwindcss/typography</code>. Headings inside prose inherit the serif display font.
                  </p>
                  <ul>
                    <li>Unordered list item</li>
                    <li>Another list item with <a href="#">a link</a></li>
                  </ul>
                  <blockquote>
                    Blockquotes render with a left border and italic style.
                  </blockquote>
                </Prose>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Separator />

      {/* ================================================================
          FONT PAIRING DEMO
          ================================================================ */}
      <Section className="bg-muted/30">
        <Container size="narrow">
          <div className="text-center mb-12">
            <SectionLabel>Font Pairing</SectionLabel>
            <H2 className="mt-2">Serif meets sans-serif</H2>
            <Lead className="mt-4">
              The contrast between a refined serif for headings and a clean sans for body
              creates visual hierarchy without heavy weights or large sizes.
            </Lead>
          </div>

          <div className="rounded-lg border bg-card p-8 md:p-12 space-y-6">
            <H3>The quick brown fox jumps over the lazy dog</H3>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
            <Text>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.
            </Text>
            <div className="pt-2">
              <Button>Call to Action</Button>
            </div>
          </div>
        </Container>
      </Section>

      <Separator />

      {/* ================================================================
          BUTTONS
          ================================================================ */}
      <Section>
        <Container>
          <H2 className="mb-8">Buttons</H2>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="cta">CTA</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </Container>
      </Section>

      <Separator />

      {/* ================================================================
          BADGES
          ================================================================ */}
      <Section>
        <Container>
          <H2 className="mb-8">Badges</H2>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </Container>
      </Section>

      <Separator />

      {/* ================================================================
          CARDS
          ================================================================ */}
      <Section>
        <Container>
          <H2 className="mb-8">Cards</H2>
          <div className="grid gap-6 md:grid-cols-3">
            {["One", "Two", "Three"].map((n) => (
              <Card key={n}>
                <CardHeader>
                  <CardTitle className="font-display">{`Card ${n}`}</CardTitle>
                  <CardDescription>A brief description of this card.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Text>Card content goes here with supporting details.</Text>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Action</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Separator />

      {/* ================================================================
          FORMS
          ================================================================ */}
      <Section>
        <Container size="narrow">
          <H2 className="mb-8">Form Elements</H2>
          <div className="space-y-6">
            <div>
              <Label htmlFor="demo-input">Text Input</Label>
              <Input id="demo-input" placeholder="Type something..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="demo-email">Email Input</Label>
              <Input id="demo-email" type="email" placeholder="you@example.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="demo-textarea">Textarea</Label>
              <Textarea id="demo-textarea" placeholder="Write your message..." className="mt-1" />
            </div>
          </div>
        </Container>
      </Section>

      <Separator />

      {/* ================================================================
          MOTION
          ================================================================ */}
      <Section>
        <Container>
          <H2 className="mb-8">Motion / Animation</H2>
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {["FadeIn Up", "Stagger Item 2", "Stagger Item 3"].map((label) => (
              <StaggerItem key={label}>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Text>{label}</Text>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      <Separator />

      {/* ================================================================
          COLORS
          ================================================================ */}
      <Section>
        <Container>
          <H2 className="mb-8">Color Tokens</H2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: "Background", cls: "bg-background border" },
              { name: "Foreground", cls: "bg-foreground" },
              { name: "Primary", cls: "bg-primary" },
              { name: "Secondary", cls: "bg-secondary border" },
              { name: "Muted", cls: "bg-muted border" },
              { name: "Accent", cls: "bg-accent border" },
              { name: "Destructive", cls: "bg-destructive" },
              { name: "Card", cls: "bg-card border" },
            ].map((c) => (
              <div key={c.name} className="text-center">
                <div className={`h-16 rounded-lg ${c.cls}`} />
                <p className="mt-2 text-sm">{c.name}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Separator />

      {/* ================================================================
          MICRO-INTERACTIONS
          ================================================================ */}
      <Section>
        <Container>
          <H2 className="mb-4">Micro-Interactions</H2>
          <Text className="mb-8">
            Every clickable element has all states defined: default, hover, active/press, focus-visible, disabled, and loading.
          </Text>

          {/* Button states */}
          <H3 className="mb-6">Button States</H3>
          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <div className="space-y-4">
              <Small>Hover, active press (scale 0.98), focus ring, disabled, loading:</Small>
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
                <ButtonLoadingDemo />
              </div>
            </div>
            <div className="space-y-4">
              <Small>All variants have consistent active:scale-[0.98] press feedback:</Small>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="cta">CTA</Button>
              </div>
            </div>
          </div>

          {/* Tooltips */}
          <H3 className="mb-6">Tooltips</H3>
          <div className="space-y-4 mb-12">
            <Small>Icon-only buttons always get tooltips. Labeled buttons never do.</Small>
            <div className="flex flex-wrap gap-4 items-center">
              <Tooltip content="More information">
                <button className="rounded-md p-2 transition-all duration-200 hover:bg-accent active:scale-[0.95] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring" aria-label="More information">
                  <Info className="h-5 w-5" />
                </button>
              </Tooltip>
              <Tooltip content="This tooltip explains the icon" side="bottom">
                <button className="rounded-md border p-2 transition-all duration-200 hover:bg-accent active:scale-[0.95] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring" aria-label="Help">
                  <span className="text-sm">?</span>
                </button>
              </Tooltip>
              <Small className="text-muted-foreground">Hover the icons above</Small>
            </div>
          </div>

          {/* Card interactions */}
          <H3 className="mb-6">Card Lift &amp; Press</H3>
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {["Hover to lift", "Click to press", "Try both"].map((label) => (
              <Card key={label} className="cursor-pointer hover:border-foreground/20 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] active:shadow-xs">
                <CardContent className="pt-6 text-center">
                  <Text>{label}</Text>
                  <Small>translate-y + shadow on hover, scale on press</Small>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Input focus */}
          <H3 className="mb-6">Input Focus Transitions</H3>
          <div className="max-w-md space-y-4 mb-12">
            <Small>Border transitions to ring on focus. Error state via aria-invalid:</Small>
            <Input placeholder="Click to see focus transition" />
            <Input placeholder="Error state" aria-invalid="true" />
          </div>

          {/* Spinner */}
          <H3 className="mb-6">Loading Spinners</H3>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <Spinner size="sm" />
              <Small className="mt-2">sm</Small>
            </div>
            <div className="text-center">
              <Spinner />
              <Small className="mt-2">default</Small>
            </div>
            <div className="text-center">
              <Spinner size="lg" />
              <Small className="mt-2">lg</Small>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function ButtonLoadingDemo() {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <Button loading={loading} onClick={handleClick}>
      {loading ? "Sending..." : "Click to load"}
    </Button>
  );
}
