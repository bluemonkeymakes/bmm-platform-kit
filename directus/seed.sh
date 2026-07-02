#!/usr/bin/env bash
# ==============================================================================
# Directus Seed Script — creates collections, fields, and public permissions
# Run after Directus is up: bash directus/seed.sh
# Requires: DIRECTUS_URL, DIRECTUS_ADMIN_EMAIL, DIRECTUS_ADMIN_PASSWORD
# ==============================================================================
set -euo pipefail

DIRECTUS_URL="${DIRECTUS_URL:-http://localhost:8055}"
ADMIN_EMAIL="${DIRECTUS_ADMIN_EMAIL:-admin@example.com}"
ADMIN_PASSWORD="${DIRECTUS_ADMIN_PASSWORD:-admin}"

echo "--- Authenticating with Directus at $DIRECTUS_URL ---"
TOKEN=$(curl -sf "$DIRECTUS_URL/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['access_token'])")

if [ -z "$TOKEN" ]; then
  echo "ERROR: Failed to authenticate. Is Directus running?"
  exit 1
fi

AUTH="Authorization: Bearer $TOKEN"

create_collection() {
  local name="$1"
  local note="$2"
  echo "  Creating collection: $name"
  curl -sf "$DIRECTUS_URL/collections" \
    -H "$AUTH" -H 'Content-Type: application/json' \
    -d "{\"collection\":\"$name\",\"meta\":{\"note\":\"$note\",\"icon\":\"article\"},\"schema\":{},\"fields\":[{\"field\":\"id\",\"type\":\"integer\",\"meta\":{\"hidden\":true,\"interface\":\"input\",\"readonly\":true},\"schema\":{\"is_primary_key\":true,\"has_auto_increment\":true}},{\"field\":\"status\",\"type\":\"string\",\"meta\":{\"width\":\"half\",\"options\":{\"choices\":[{\"text\":\"Published\",\"value\":\"published\"},{\"text\":\"Draft\",\"value\":\"draft\"},{\"text\":\"Archived\",\"value\":\"archived\"}]},\"interface\":\"select-dropdown\"},\"schema\":{\"default_value\":\"draft\"}},{\"field\":\"sort\",\"type\":\"integer\",\"meta\":{\"interface\":\"input\",\"hidden\":true},\"schema\":{}}]}" \
    > /dev/null 2>&1 || echo "    (already exists)"
}

create_field() {
  local collection="$1"
  local field="$2"
  local type="$3"
  local interface="$4"
  local extra="${5:-}"
  echo "    + field: $field ($type)"
  curl -sf "$DIRECTUS_URL/fields/$collection" \
    -H "$AUTH" -H 'Content-Type: application/json' \
    -d "{\"field\":\"$field\",\"type\":\"$type\",\"meta\":{\"interface\":\"$interface\"$extra},\"schema\":{}}" \
    > /dev/null 2>&1 || true
}

# ==============================================================================
# COLLECTIONS
# ==============================================================================
echo ""
echo "--- Creating Collections ---"

# Pages
create_collection "pages" "CMS-managed pages with content blocks"
create_field "pages" "title" "string" "input"
create_field "pages" "slug" "string" "input"
create_field "pages" "meta_title" "string" "input"
create_field "pages" "meta_description" "text" "input-multiline"
create_field "pages" "meta_image" "uuid" "file-image"

# Articles
create_collection "articles" "Blog articles"
create_field "articles" "title" "string" "input"
create_field "articles" "slug" "string" "input"
create_field "articles" "excerpt" "text" "input-multiline"
create_field "articles" "content" "text" "input-rich-text-html"
create_field "articles" "featured_image" "uuid" "file-image"
create_field "articles" "author" "string" "input"
create_field "articles" "category" "string" "input"
create_field "articles" "tags" "json" "tags"
create_field "articles" "date_published" "timestamp" "datetime"
create_field "articles" "read_time" "integer" "input"

# Team
create_collection "team" "Team members"
create_field "team" "name" "string" "input"
create_field "team" "role" "string" "input"
create_field "team" "bio" "text" "input-multiline"
create_field "team" "photo" "uuid" "file-image"
create_field "team" "social_links" "json" "list"

# Testimonials
create_collection "testimonials" "Client testimonials"
create_field "testimonials" "quote" "text" "input-multiline"
create_field "testimonials" "author_name" "string" "input"
create_field "testimonials" "author_role" "string" "input"
create_field "testimonials" "author_photo" "uuid" "file-image"
create_field "testimonials" "company" "string" "input"
create_field "testimonials" "rating" "integer" "input"

# Block collections (one per block type)
for block in block_hero block_hero_simple block_cta block_content block_features block_testimonials block_faq block_stats block_image_text block_team block_about block_contact block_newsletter block_articles block_gallery; do
  create_collection "$block" "Content block: $block"
  create_field "$block" "title" "string" "input"
done

# Extra fields per block type
create_field "block_hero" "subtitle" "text" "input-multiline"
create_field "block_hero" "description" "text" "input-multiline"
create_field "block_hero" "label" "string" "input"
create_field "block_hero" "image" "uuid" "file-image"
create_field "block_hero" "cta_text" "string" "input"
create_field "block_hero" "cta_link" "string" "input"
create_field "block_hero" "secondary_cta_text" "string" "input"
create_field "block_hero" "secondary_cta_link" "string" "input"
create_field "block_hero" "alignment" "string" "select-dropdown" ",\"options\":{\"choices\":[{\"text\":\"Left\",\"value\":\"left\"},{\"text\":\"Center\",\"value\":\"center\"},{\"text\":\"Right\",\"value\":\"right\"}]}"

create_field "block_cta" "description" "text" "input-multiline"
create_field "block_cta" "cta_text" "string" "input"
create_field "block_cta" "cta_link" "string" "input"
create_field "block_cta" "variant" "string" "select-dropdown" ",\"options\":{\"choices\":[{\"text\":\"Default\",\"value\":\"default\"},{\"text\":\"Accent\",\"value\":\"accent\"}]}"

create_field "block_content" "content" "text" "input-rich-text-html"
create_field "block_content" "image" "uuid" "file-image"
create_field "block_content" "image_position" "string" "select-dropdown" ",\"options\":{\"choices\":[{\"text\":\"Left\",\"value\":\"left\"},{\"text\":\"Right\",\"value\":\"right\"}]}"

create_field "block_features" "subtitle" "text" "input-multiline"
create_field "block_features" "columns" "integer" "input"
create_field "block_features" "features" "json" "list"

create_field "block_faq" "subtitle" "text" "input-multiline"
create_field "block_faq" "items" "json" "list"

create_field "block_stats" "stats" "json" "list"

create_field "block_image_text" "content" "text" "input-rich-text-html"
create_field "block_image_text" "image" "uuid" "file-image"
create_field "block_image_text" "image_position" "string" "select-dropdown" ",\"options\":{\"choices\":[{\"text\":\"Left\",\"value\":\"left\"},{\"text\":\"Right\",\"value\":\"right\"}]}"
create_field "block_image_text" "cta_text" "string" "input"
create_field "block_image_text" "cta_link" "string" "input"

create_field "block_about" "content" "text" "input-rich-text-html"
create_field "block_about" "image" "uuid" "file-image"
create_field "block_about" "cta_text" "string" "input"
create_field "block_about" "cta_link" "string" "input"

create_field "block_gallery" "images" "json" "list"
create_field "block_gallery" "columns" "integer" "input"

create_field "block_newsletter" "description" "text" "input-multiline"
create_field "block_newsletter" "placeholder" "string" "input"
create_field "block_newsletter" "button_text" "string" "input"

create_field "block_contact" "description" "text" "input-multiline"

create_field "block_articles" "limit" "integer" "input"

# ==============================================================================
# PUBLIC PERMISSIONS (read access on content collections)
# ==============================================================================
echo ""
echo "--- Setting Public Permissions ---"

PUBLIC_COLLECTIONS="pages articles team testimonials block_hero block_hero_simple block_cta block_content block_features block_testimonials block_faq block_stats block_image_text block_team block_about block_contact block_newsletter block_articles block_gallery"

# Directus 11 attaches permissions to policies, not roles ("role": null no
# longer creates public access). Resolve the built-in Public policy id.
PUBLIC_POLICY=$(curl -sf "$DIRECTUS_URL/policies?fields=id,name" -H "$AUTH" \
  | python3 -c 'import sys,json; print(next(p["id"] for p in json.load(sys.stdin)["data"] if p["name"] == "$t:public_label"))')

for col in $PUBLIC_COLLECTIONS; do
  echo "  Public read: $col"
  curl -sf "$DIRECTUS_URL/permissions" \
    -H "$AUTH" -H 'Content-Type: application/json' \
    -d "{\"policy\":\"$PUBLIC_POLICY\",\"collection\":\"$col\",\"action\":\"read\",\"fields\":[\"*\"]}" \
    > /dev/null || echo "  WARNING: failed to set public read on $col"
done

echo ""
echo "--- Seed Complete ---"
echo "Log in to Directus at $DIRECTUS_URL and start adding content!"
