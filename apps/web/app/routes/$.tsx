import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  throw new Response("Not Found", { status: 404 });
}

export default function CatchAll() {
  return null;
}
