import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Container } from "./Container";
import { H1, Text } from "./Typography";

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
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl font-normal text-muted-foreground/20">{status}</p>
      <H1 className="mt-4">{title}</H1>
      <Text className="mt-4 max-w-md">{description}</Text>
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
