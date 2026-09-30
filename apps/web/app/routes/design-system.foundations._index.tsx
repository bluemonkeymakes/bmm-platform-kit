import type { MetaFunction } from "react-router";
import { LayerIndex } from "~/components/ds/LayerIndex";

export const handle = { title: "Foundations" };

export const meta: MetaFunction = () => [
  { title: "Foundations | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function FoundationsIndex() {
  return <LayerIndex layer="foundations" />;
}
