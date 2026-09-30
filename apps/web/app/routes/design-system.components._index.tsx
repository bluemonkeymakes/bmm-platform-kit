import type { MetaFunction } from "react-router";
import { LayerIndex } from "~/components/ds/LayerIndex";

export const handle = { title: "Components" };

export const meta: MetaFunction = () => [
  { title: "Components | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function ComponentsIndex() {
  return <LayerIndex layer="components" />;
}
