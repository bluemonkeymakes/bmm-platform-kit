import type {
  PageBlock,
  Article,
  TeamMember,
  Testimonial,
  BlockHeroData,
  BlockHeroSimpleData,
  BlockCtaData,
  BlockFeaturesData,
  BlockTestimonialsData,
  BlockFaqData,
  BlockStatsData,
  BlockImageTextData,
  BlockTeamData,
  BlockNewsletterData,
  BlockArticlesData,
} from "~/types/content";

// =============================================================================
// Default seed data — used when Directus is not connected.
// Once CMS is live, all of this is managed via the Directus admin UI.
// Every block item carries a `satisfies` check against its schema-derived
// type, so drift between these fallbacks and app/content/schema.ts fails
// `tsc` instead of surfacing at runtime.
// =============================================================================

export const defaultHomeBlocks: PageBlock[] = [
  {
    id: "home-hero",
    sort: 1,
    collection: "block_hero",
    item: {
      label: "Starter Kit",
      title: "Ship faster with a production-ready foundation",
      subtitle:
        "React Router 7, NestJS, Directus CMS, and Twenty CRM — wired up with security, observability, and deployment configs out of the box.",
      cta_text: "Get Started",
      cta_link: "/contact",
      secondary_cta_text: "Learn More",
      secondary_cta_link: "/about",
      alignment: "left",
    } satisfies BlockHeroData,
  },
  {
    id: "home-features",
    sort: 2,
    collection: "block_features",
    item: {
      title: "Everything you need",
      subtitle: "A complete foundation so you can focus on what makes your project unique.",
      columns: 3,
      features: [
        {
          icon: "🧱",
          title: "15 Content Blocks",
          description:
            "Hero, CTA, Features, FAQ, Stats, Gallery, Team, Testimonials, and more — all managed from the Directus admin panel.",
        },
        {
          icon: "🔒",
          title: "Security First",
          description:
            "CSRF tokens, honeypot fields, Cloudflare Turnstile, CORS, validation pipes, API key guards, and CSP headers.",
        },
        {
          icon: "🚀",
          title: "Deploy Anywhere",
          description:
            "Docker Compose for Coolify, DigitalOcean, Hetzner, or any VPS. Production-ready from day one.",
        },
        {
          icon: "📊",
          title: "CRM Built In",
          description:
            "Twenty CRM captures every lead from your contact form. No spreadsheets, no manual entry.",
        },
        {
          icon: "📝",
          title: "CMS-Managed Pages",
          description:
            "Non-technical editors build pages by stacking blocks in Directus. No code deploys needed.",
        },
        {
          icon: "🎨",
          title: "Dark Mode & Theming",
          description:
            "CSS custom properties for the entire color system. Swap the palette in one file to rebrand.",
        },
      ],
    } satisfies BlockFeaturesData,
  },
  {
    id: "home-stats",
    sort: 3,
    collection: "block_stats",
    item: {
      title: "Built for production",
      stats: [
        { value: "15", label: "Content Blocks", description: "Ready to use" },
        { value: "93", label: "Files", description: "Full stack" },
        { value: "3", label: "Layers of Security", description: "On every form" },
        { value: "0", label: "Vendor Lock-in", description: "Self-hosted" },
      ],
    } satisfies BlockStatsData,
  },
  {
    id: "home-testimonials",
    sort: 4,
    collection: "block_testimonials",
    item: {
      title: "What people are saying",
      subtitle: "Replace these with real testimonials from your CMS.",
    } satisfies BlockTestimonialsData,
  },
  {
    id: "home-articles",
    sort: 5,
    collection: "block_articles",
    item: {
      title: "Latest Articles",
      limit: 3,
    } satisfies BlockArticlesData,
  },
  {
    id: "home-faq",
    sort: 6,
    collection: "block_faq",
    item: {
      title: "Frequently Asked Questions",
      subtitle: "Common questions about the starter kit.",
      items: [
        {
          question: "How do I connect Directus?",
          answer:
            "Run `docker compose up` to start all services, then run `npm run seed` to create the collections. Open http://localhost:8055 to manage content.",
        },
        {
          question: "Can I deploy this to Coolify?",
          answer:
            "Yes. Each service has its own Dockerfile and the docker-compose.production.yml is Coolify-ready. Push to a Git repo and point Coolify at it.",
        },
        {
          question: "How do I add a new content block?",
          answer:
            "Create a block_* collection in Directus, add a matching component in components/blocks/, register it in BlockRenderer.tsx, and add the TypeScript interface in types/content.ts.",
        },
        {
          question: "Is Twenty CRM required?",
          answer:
            "No. If TWENTY_API_KEY is not set, the CRM module gracefully skips all operations. You can remove it entirely or add it later.",
        },
      ],
    } satisfies BlockFaqData,
  },
  {
    id: "home-cta",
    sort: 7,
    collection: "block_cta",
    item: {
      title: "Ready to build something?",
      description: "Clone the repo, run docker compose up, and start shipping.",
      cta_text: "Get in Touch",
      cta_link: "/contact",
      variant: "accent",
    } satisfies BlockCtaData,
  },
  {
    id: "home-newsletter",
    sort: 8,
    collection: "block_newsletter",
    item: {
      title: "Stay in the loop",
      description: "Get updates on new features and releases. No spam.",
      placeholder: "you@example.com",
      button_text: "Subscribe",
    } satisfies BlockNewsletterData,
  },
];

export const defaultAboutBlocks: PageBlock[] = [
  {
    id: "about-hero",
    sort: 1,
    collection: "block_hero_simple",
    item: {
      label: "About",
      title: "We build tools that help businesses grow",
      subtitle:
        "A small team obsessed with shipping quality software — fast, secure, and without unnecessary complexity.",
    } satisfies BlockHeroSimpleData,
  },
  {
    id: "about-content",
    sort: 2,
    collection: "block_image_text",
    item: {
      title: "Our Story",
      content:
        "<p>We started this project because we were tired of rebuilding the same foundation for every client. CMS, CRM, authentication, deployment — the same wiring, every time.</p><p>This starter kit is the distillation of that experience. Every pattern has been battle-tested across real production projects. Every security measure exists because we learned the hard way.</p><p>We believe the best tools are the ones that get out of your way and let you focus on what makes your project unique.</p>",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      image_position: "right",
      cta_text: "Get in Touch",
      cta_link: "/contact",
    } satisfies BlockImageTextData,
  },
  {
    id: "about-team",
    sort: 3,
    collection: "block_team",
    item: {
      title: "Meet the Team",
      subtitle: "The people behind the project. Manage team members in Directus.",
    } satisfies BlockTeamData,
  },
  {
    id: "about-cta",
    sort: 4,
    collection: "block_cta",
    item: {
      title: "Want to work together?",
      description: "We'd love to hear about your project.",
      cta_text: "Contact Us",
      cta_link: "/contact",
      variant: "accent",
    } satisfies BlockCtaData,
  },
];

export const defaultArticles: Article[] = [
  {
    id: "1",
    status: "published",
    date_published: "2026-03-20T00:00:00Z",
    title: "Getting Started with the Starter Kit",
    slug: "getting-started",
    excerpt:
      "A walkthrough of the project structure, how to connect Directus, and deploy your first build.",
    content:
      "<h2>Welcome</h2><p>This article walks you through the initial setup of the starter kit. You'll learn how to start the development environment, connect to Directus, seed your database, and deploy to production.</p><h2>Prerequisites</h2><ul><li>Node.js 20+</li><li>Docker &amp; Docker Compose</li><li>A code editor</li></ul><h2>Quick Start</h2><p>Clone the repo, copy <code>.env.example</code> to <code>.env</code>, and run <code>docker compose up</code>. That's it — you'll have Directus, Twenty CRM, PostgreSQL, and Redis running locally.</p><h2>Next Steps</h2><p>Run <code>npm run seed</code> to create the CMS collections, then open <code>http://localhost:8055</code> to start managing content.</p>",
    category: "Tutorial",
    tags: ["setup", "docker", "directus"],
    author: "Starter Kit Team",
    read_time: 5,
  },
  {
    id: "2",
    status: "published",
    date_published: "2026-03-18T00:00:00Z",
    title: "Building Custom Content Blocks",
    slug: "custom-blocks",
    excerpt:
      "Learn how to create new block types — from Directus collection to rendered React component.",
    content:
      "<h2>The Block System</h2><p>Every page in this starter is composed of content blocks. Each block is a Directus collection with a matching React component. The <code>BlockRenderer</code> maps collection names to components automatically.</p><h2>Step 1: Create the Collection</h2><p>In Directus, create a new collection named <code>block_pricing</code> (or whatever fits). Add your fields — title, plans, features, etc.</p><h2>Step 2: Build the Component</h2><p>Create <code>BlockPricing.tsx</code> in the blocks directory. Accept a <code>PageBlock</code> prop and cast the item to your data shape.</p><h2>Step 3: Register</h2><p>Add the mapping in <code>BlockRenderer.tsx</code>. That's it — the block is now available for any CMS page.</p>",
    category: "Guide",
    tags: ["blocks", "directus", "components"],
    author: "Starter Kit Team",
    read_time: 8,
  },
  {
    id: "3",
    status: "published",
    date_published: "2026-03-15T00:00:00Z",
    title: "Deploying to Coolify on DigitalOcean",
    slug: "deploy-coolify",
    excerpt:
      "Step-by-step guide to deploying the full stack — web, API, CMS, and CRM — to a single VPS via Coolify.",
    content:
      "<h2>Why Coolify?</h2><p>Coolify is a self-hosted Heroku alternative that runs on any VPS. It handles Docker builds, SSL certificates, and environment variables — no vendor lock-in.</p><h2>Setup</h2><p>Point Coolify at your Git repo. Create separate services for the web app, API, Directus, and Twenty CRM using their respective Dockerfiles and compose files.</p><h2>Environment Variables</h2><p>Copy all values from <code>.env.example</code> into Coolify's environment settings for each service. Make sure to use internal Docker hostnames (e.g., <code>http://directus:8055</code>) for service-to-service communication.</p>",
    category: "DevOps",
    tags: ["coolify", "deployment", "docker"],
    author: "Starter Kit Team",
    read_time: 6,
  },
];

export const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    status: "published",
    sort: 1,
    name: "Alex Johnson",
    role: "Founder & Lead Engineer",
    bio: "Full-stack engineer with a focus on developer experience and production reliability. Believes the best code is the code you don't have to write.",
    social_links: [{ platform: "github", url: "#" }, { platform: "linkedin", url: "#" }],
  },
  {
    id: "2",
    status: "published",
    sort: 2,
    name: "Sam Rivera",
    role: "Design & Frontend",
    bio: "Designs systems, not just screens. Obsessed with component consistency, accessible defaults, and making dark mode look good.",
    social_links: [{ platform: "github", url: "#" }],
  },
  {
    id: "3",
    status: "published",
    sort: 3,
    name: "Taylor Chen",
    role: "Backend & DevOps",
    bio: "Keeps the servers running and the deploys boring. Specializes in Docker, observability, and making infrastructure disappear.",
    social_links: [{ platform: "github", url: "#" }, { platform: "linkedin", url: "#" }],
  },
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    status: "published",
    sort: 1,
    quote: "We went from idea to production in two weeks. The starter kit handled everything we didn't want to think about — CMS, auth, deployment — so we could focus on the product.",
    author_name: "Maria Santos",
    author_role: "CTO",
    company: "Acme Digital",
  },
  {
    id: "2",
    status: "published",
    sort: 2,
    quote: "Our marketing team edits content directly in Directus without touching code. That alone saved us from hiring a dedicated webmaster.",
    author_name: "James Wright",
    author_role: "Head of Marketing",
    company: "Greenfield Labs",
  },
  {
    id: "3",
    status: "published",
    sort: 3,
    quote: "The security defaults are what sold us. CSRF, Turnstile, honeypot, rate limiting — all wired up on day one. We've had zero spam since launch.",
    author_name: "Priya Patel",
    author_role: "Engineering Lead",
    company: "Horizon Software",
  },
];
