import { Link } from "react-router";
import { Container } from "~/components/ui/layout";
import { Body, Label } from "~/components/ui/typography";
import { Wordmark } from "~/components/common/Wordmark";

const footerLinks = [
  {
    title: "Pages",
    links: [
      { label: "About", href: "/about" },
      { label: "Articles", href: "/articles" },
      { label: "Contact", href: "/contact" },
      { label: "Design System", href: "/style-guide" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-neutral-50">
      <Container size="wide" className="py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Wordmark size="sm" />
            <Body size="sm" variant="muted" className="mt-2">
              Built with React Router, NestJS, Directus &amp; Twenty CRM.
            </Body>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <Label as="h3" size="md">{col.title}</Label>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="rounded-sm text-sm text-neutral-500 hover:text-neutral-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <Body size="sm" variant="muted">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </Body>
        </div>
      </Container>
    </footer>
  );
}
