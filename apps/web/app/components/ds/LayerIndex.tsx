import { NavCards } from "~/components/ds/NavCards";
import { PageIntro } from "~/components/ds/PageIntro";
import { LAYERS, type Layer, nav } from "~/lib/design-system-nav";

/** The index page of one /design-system layer: its intro, then every page in it. */
export function LayerIndex({ layer }: { layer: Layer }) {
  const meta = LAYERS.find((l) => l.layer === layer);
  // A layer's own index can be a nav item; don't list the page you are on.
  const sections = nav
    .filter((s) => s.layer === layer)
    .map((s) => ({ ...s, items: s.items.filter((i) => i.to !== meta?.to) }))
    .filter((s) => s.items.length > 0);
  return (
    <div className="px-4 sm:px-8 py-10 space-y-12">
      <PageIntro title={meta?.title ?? layer} blurb={meta?.blurb} />
      <NavCards sections={sections} />
    </div>
  );
}
