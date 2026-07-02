/* ───────────────────────────────────────────────────────────────────────────
   BRAND · Avatar palette — SWAP SURFACE
   Default avatars are generated with boring-avatars (https://boringavatars.com).
   These are the brand colors + variant the generator uses. Hex lives here, in
   the brand layer, on purpose: it's a per-project look, not a system token, and
   this folder is exempt from the token-lint. Swap freely in a fork.
   ─────────────────────────────────────────────────────────────────────────── */
export const avatarColors = ["#1E3A5F", "#3E6E8E", "#E2A33C", "#CBD8E6", "#7A9CB8"];

/** boring-avatars variant: beam | marble | pixel | sunset | ring | bauhaus | geometric | abstract */
export const avatarVariant = "beam" as const;
