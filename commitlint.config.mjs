// Commit-message gate. Conventional Commits format + a 72-char subject cap,
// enforced by the lefthook `commit-msg` hook. Matches the BMM house config
// (mono-bluemonkeymakes.com, bmm-design-system) and the /repo-setup baseline.
export default {
  extends: ["@commitlint/config-conventional"],
  rules: { "header-max-length": [2, "always", 72] },
};
