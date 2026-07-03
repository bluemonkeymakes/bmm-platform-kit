import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Container } from "~/components/ui/layout";
import { Heading, Body } from "~/components/ui/typography";

interface ErrorPageProps {
  status?: number;
  title: string;
  description: string;
}

export function ErrorPage({
  status = 404,
  title,
  description,
}: ErrorPageProps) {
  return (
    <Container size="wide" className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Heading as="p" size="4xl" variant="watermark">{status}</Heading>
      <Heading as="h1" size="2xl" variant="display" className="mt-4">{title}</Heading>
      <Body variant="muted" className="mt-4 max-w-md">{description}</Body>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link to="/">Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Contact Us</Link>
        </Button>
      </div>
    </Container>
  );
}
