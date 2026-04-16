# Phase 1 Deployment Guide
## Brown Sugar Bakery Birthday Club — Landing Page

**Goal:** Get the Birthday Club signup live on the Shopify storefront and start collecting members tonight.

**Time required:** ~15-20 minutes inside the Shopify admin.

**Recommended deployment: Theme Section (Online Store 2.0)**

Your theme uses the OS 2.0 sections architecture. The recommended way to deploy the Birthday Club is as a **section** that the merchandiser can drop onto any page (home page, dedicated landing page, cart page) via the theme customizer — and configure the heading, copy, and benefits without touching code.

**Files you need:**

- `shopify/sections/section-birthday-club.liquid` — the section file (with schema)
- `shopify/assets/section-birthday-club.css` — the companion stylesheet
- `shopify/assets/birthday-club-logo.png` — logo (optional — only used if you reference it from the customizer)

> **Alternative:** A standalone page template at `shopify/templates/page.birthday-club.liquid` is also available if you want a fixed full-page layout instead of a configurable section. Skip to the *Alternative deployment* section at the bottom of this guide.

---

## Before you start — checklist

- [ ] You have **Shopify admin access** with permission to edit theme code
- [ ] The Supabase project at `htuthqzhqqskcjijnyxu.supabase.co` is still active (it should be — same project the prototype uses)
- [ ] You can log in to Supabase to view incoming signups: https://supabase.com/dashboard

If any of those is "no," stop and resolve before proceeding.

---

## Step 1 — Verify Supabase tables exist

The landing page writes to two tables that the prototype already uses: `members` and `family_members`.

1. Go to https://supabase.com/dashboard
2. Select your Birthday Club project (`htuthqzhqqskcjijnyxu`)
3. Left sidebar → **Table Editor**
4. Confirm both `members` and `family_members` tables are present
5. Check `members` columns include at minimum:
   - `id`, `first_name`, `last_name`, `email`, `birthday`, `created_at`
   - **Optional but recommended:** add a `utm` column of type `jsonb` (the form will populate it for social-driven signups). To add it: click the `members` table → **+** column → name `utm`, type `jsonb`, allow nullable. If you skip this, UTM data will be silently dropped, but the form will still work.

> If the tables don't exist (e.g., new Supabase project), run the SQL in `docs/architecture.md` Appendix C to create them before continuing.

---

## Step 2 — Upload the logo to Shopify

1. Shopify admin → **Settings** (bottom left) → **Files**
2. Click **Upload files**
3. Select `shopify/assets/birthday-club-logo.png` from this project
4. After upload, the file is available with the filename `birthday-club-logo.png`. The Liquid template references it via `{{ 'birthday-club-logo.png' | file_url }}` — no further action needed.

---

## Step 3 — (Optional) Upload a social share image

For nice-looking previews when the page is shared on Facebook/Instagram/Twitter:

1. Create or pick an image at **1200 × 630 pixels** (cake photo, branded image, etc.)
2. Save it as `birthday-club-social.jpg`
3. Upload to **Settings** → **Files** the same way as the logo

If you skip this step, social shares will show a generic preview without an image.

---

## Step 4 — Upload the section files to your theme

1. Shopify admin → **Online Store** → **Themes**
2. On your live theme (or a duplicate to test safely), click **... → Edit code**
3. In the left file tree, expand the **Sections** folder
4. Click **Add a new section**
   - Name: `section-birthday-club`
   - File type: `liquid`
5. Shopify creates `sections/section-birthday-club.liquid` with placeholder content
6. **Replace the entire file's contents** with the contents of `shopify/sections/section-birthday-club.liquid` from this project
7. Click **Save**
8. In the left file tree, expand the **Assets** folder
9. Click **Add a new asset**
10. Upload `shopify/assets/section-birthday-club.css` from this project
11. Click **Save**

> **Note about the schema:** The section is `enabled_on` these page types: home (`index`), `page`, `product`, `collection`, `cart`, `blog`, `article`, `search`, `404`. If you want to restrict it further, edit the `enabled_on.templates` array at the bottom of the section file.

---

## Step 5 — Add the section to a page via the theme customizer

You have two common options:

### Option A — Dedicated landing page at `/pages/birthday-club` (recommended for social campaigns)

1. Shopify admin → **Online Store** → **Pages** → **Add page**
2. Title: `Birthday Club`
3. Content: leave empty
4. Visibility: Visible
5. Confirm URL handle is `birthday-club`
6. Save
7. Now go to **Online Store** → **Themes** → **Customize**
8. In the page selector at the top, navigate to **Pages → Birthday Club**
9. Click **Add section** → in the dialog find **Birthday Club** under the **Promotional** category
10. Drag it into the desired position (typically right after the page title or replacing it)
11. Click into the section to edit settings: subheading, title, description, benefits, button text, etc.
12. Click **Save** (top right)
13. The page is live at `brownsugarbakery.com/pages/birthday-club`

### Option B — Embed on the home page

1. **Online Store** → **Themes** → **Customize**
2. Navigate to **Home page**
3. **Add section** → **Birthday Club**
4. Position wherever it best fits (after hero, before footer, etc.)
5. Configure settings, save

---

## Step 6 — Test it end to end

1. Open `https://brownsugarbakery.com/pages/birthday-club` in a browser (use an incognito window so no auto-fill confuses things)
2. Confirm the hero, benefits, "How it works", and signup form all render
3. Submit a real test signup with your own info (or a `+test` email like `you+bdaytest@yourdomain.com` so it's flagged but real)
4. After submitting, you should see the success state ("Welcome to the Club!")
5. Within a few seconds, log into Supabase → Table Editor → `members` and confirm the new row appears
6. If you added a family member during the test, also check `family_members` for the new rows
7. **Delete your test row(s)** from Supabase before going live to keep data clean

### Mobile test

Phase 1 will get a lot of mobile traffic from social. Test on at least one real phone:

1. Open the page on an iPhone or Android browser
2. Confirm the form is easy to fill on a small screen
3. Date picker should open the native iOS/Android date wheel
4. Submit a test signup from mobile
5. Confirm row appears in Supabase

---

## Step 7 — Hook up your social media

The page is ready to receive traffic. Recommended links:

| Channel | Suggested URL |
|---|---|
| Instagram bio link | `brownsugarbakery.com/pages/birthday-club?utm_source=instagram&utm_medium=bio` |
| Instagram story sticker | `brownsugarbakery.com/pages/birthday-club?utm_source=instagram&utm_medium=story` |
| Facebook post | `brownsugarbakery.com/pages/birthday-club?utm_source=facebook&utm_medium=post` |
| TikTok bio | `brownsugarbakery.com/pages/birthday-club?utm_source=tiktok&utm_medium=bio` |
| Email blast | `brownsugarbakery.com/pages/birthday-club?utm_source=email&utm_medium=newsletter` |
| In-store QR code | `brownsugarbakery.com/pages/birthday-club?utm_source=instore&utm_medium=qr` |
| Paid ads (Meta) | `brownsugarbakery.com/pages/birthday-club?utm_source=facebook&utm_medium=cpc&utm_campaign=birthdayclub_launch` |

UTM parameters are captured automatically and stored in the `members.utm` column (if you added the column in Step 1). You can later report on which channel drove which signups with a simple Supabase query.

---

## Step 8 — Daily monitoring (manual, until Phase 2)

Until the AI agent goes live in Phase 2, **someone needs to manually check signups daily** to:

1. Confirm new signups are flowing in (sanity check)
2. Look for any spammy or suspicious entries
3. Eventually export or push the list into a marketing tool for sends

Recommended daily routine (5 minutes):

- Open Supabase Table Editor → `members` table → sort by `created_at` descending
- Skim new rows for anything obviously fake
- Once weekly, export to CSV (Supabase → Table → `...` → Export) for backup

---

## Troubleshooting

### Form submits but no row appears in Supabase

- Open the page → right-click → Inspect → **Console** tab
- Look for red error messages
- Most likely causes:
  - Supabase URL or anon key was modified in the Liquid file (verify against `app.js` lines 2-3)
  - Supabase project paused or RLS (Row Level Security) is blocking inserts
  - Email is a duplicate of an existing member (look for "already in the Birthday Club" error message in the form)

### "Could not connect" error

- Supabase script (the CDN tag) failed to load
- Check the page's Network tab for blocked requests
- Ad blockers or strict browser extensions may block `cdn.jsdelivr.net` or `supabase.co`

### Logo not showing

- The `<img>` will silently hide itself (`onerror` handler)
- Confirm the file is uploaded with the exact filename `birthday-club-logo.png` in Settings → Files
- If you used a different filename, edit the Liquid template line 235 to match

### Page renders but looks unstyled

- The `<style>` block is inline in the Liquid template — check it didn't get truncated when you pasted
- Some themes inject their own CSS that may conflict; the template scopes everything under `.bdc` to minimize this, but if you see issues, open the page → Inspect → check for overridden styles

---

## What is NOT included in Phase 1 (deferred to Phase 2)

- AI agent that sends birthday emails automatically — for now, the data just collects
- Member-only widget on other pages of the storefront
- Storefront popup (the floating "Join the Club" button) on every page — landing page only for now
- Customer-account integration / "My Birthday Club" account page
- Discount codes generated automatically — for now, you'd issue them manually if needed
- Email templates beyond the existing `send-welcome-email` edge function

---

## Phase 1 launch checklist

Use this when you're ready to flip the switch:

- [ ] Logo uploaded to Shopify Files
- [ ] (Optional) Social share image uploaded (1200×630)
- [ ] `sections/section-birthday-club.liquid` created in theme with full contents
- [ ] `assets/section-birthday-club.css` uploaded to theme assets
- [ ] Shopify Page created with handle `birthday-club`
- [ ] Section added to the page via theme customizer; settings configured; saved
- [ ] Page loads at `/pages/birthday-club`
- [ ] Test signup completed; row visible in Supabase
- [ ] Mobile test passed
- [ ] Test rows deleted from `members` and `family_members`
- [ ] First social post / link-in-bio updated to point to the page
- [ ] Daily Supabase check on the calendar for someone

When all of those are checked, Phase 1 is live.

---

## Alternative deployment — Standalone page template

If you'd prefer a fixed full-page layout instead of the configurable section (e.g., you don't want merchandisers editing copy via the theme customizer), there's also a self-contained page template at `shopify/templates/page.birthday-club.liquid`. To deploy:

1. Shopify admin → **Online Store** → **Themes** → **... → Edit code**
2. **Templates** → **Add a new template** → type `page`, name `birthday-club`, file type `liquid`
3. Replace contents with `shopify/templates/page.birthday-club.liquid` from this project
4. Save
5. **Online Store** → **Pages** → **Add page** → Title "Birthday Club" → in the right sidebar set **Theme template** to `page.birthday-club` → Save

This bypasses the theme customizer entirely. Less flexible, but zero chance of someone breaking the layout from the customizer UI.

---

*See `docs/architecture.md` for the full Phase 2 plan and overall system design.*
