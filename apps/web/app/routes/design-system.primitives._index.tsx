import type { MetaFunction } from "react-router";
import { LayerIndex } from "~/components/ds/LayerIndex";

export const handle = { title: "Primitives" };

export const meta: MetaFunction = () => [
  { title: "Primitives | Design System | Starter Kit" },
  { name: "robots", content: "noindex" },
];

export default function PrimitivesIndex() {
  return <LayerIndex layer="primitives" />;
}
