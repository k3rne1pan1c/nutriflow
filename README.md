# NutriFlow

An **AI Weekly Nutrition Planner** — not a recipe app, calorie tracker, or food log. NutriFlow
removes the mental effort of deciding what to eat by generating an optimized week for your whole
household, then building a zero-waste shopping list.

> **Supabase is required.** All user data and the recipe catalog load from the database.
> `src/lib/data/` is seed-only (used by `pnpm run seed`). There is no offline demo mode.

## Backend setup (Supabase + AI)

1. Create a [Supabase](https://supabase.com) project.
2. Run both SQL migrations in [`supabase/migrations/`](supabase/migrations/) in the SQL editor.
3. Copy [`.env.example`](.env.example) to `.env` and fill in keys.
4. Seed the recipe catalog: `pnpm run seed`
5. In Supabase **Authentication → URL configuration**, add redirect URLs:
   - `http://localhost:5173/auth/callback`
   - `https://nutriflow-two-silk.vercel.app/auth/callback`
6. Add the same env vars in Vercel project settings.

**Cost tips:** Keep `AI_MOCK=true` during daily dev (zero API cost). Set `AI_MOCK=false` only when testing real Gemini calls. Default model is `gemini-flash-latest` (override with `GEMINI_MODEL`). Get a free API key at [Google AI Studio](https://aistudio.google.com/apikey).

**Dev login:** Set `DEV_AUTH=true` in `.env` for instant email sign-in (no magic link). In Supabase **Authentication → Providers → Email**, turn off **Confirm email** so new dev accounts work immediately. Sessions persist in cookies across restarts.

## Tech stack

- [SvelteKit 2](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev/docs/svelte) (runes)
- TypeScript
- [Supabase](https://supabase.com) (auth, Postgres, RLS)
- [Gemini Flash](https://ai.google.dev) invents **original recipes** per meal (not catalog picks) via `@google/genai`
- [TailwindCSS v4](https://tailwindcss.com) (CSS-first config in `src/app.css`)
- shadcn-style UI primitives (hand-built in `src/lib/components/ui`)
- [`@lucide/svelte`](https://lucide.dev) icons
- [`mode-watcher`](https://mode-watcher.svecosystem.com) for dark mode

## Getting started

```bash
pnpm install
pnpm run dev      # start the dev server at http://localhost:5173
pnpm run build    # production build
pnpm run check    # type-check with svelte-check
```

## Project structure

```
src/
  app.css                     # design tokens, light/dark themes
  routes/
    +page.svelte              # Welcome / landing
    onboarding/+page.svelte   # multi-step onboarding wizard
    (app)/                    # main app shell with bottom navigation
      +layout.svelte
      dashboard/              # Home: today's meals, score, hydration, shopping preview
      meals/                  # weekly 7-day plan
      meals/[id]/             # recipe detail
      shopping/               # grouped shopping list with prices
      pantry/                 # searchable pantry staples
      profile/                # preferences, household, settings, future features
  lib/
    components/               # MealCard, RecipeCard, WeeklyCalendar, HouseholdCard, ...
    components/ui/            # Button, Card, Badge, Input, Slider, Switch, Dialog, ...
    data/                     # seed-only: ingredients.ts, recipes.ts (pnpm run seed)
    stores/app.svelte.ts      # global state + Supabase sync
    types.ts                  # shared TypeScript types
    meta.ts                   # option lists & meal-type metadata
```

## Key features

- **Generate My Week** — one button for 7 days of breakfast, lunch, dinner and snacks
- **Onboarding** — collects profile data needed for accurate meal planning
- **Household** — plan and scale meals for all members; include or exclude members per week
- **Dashboard** — weekly nutrition overview (protein, fiber, micronutrients), shared ingredients
- **Weekly plan** — meal cards with AI selection reasons and safe meal replacement
- **Shopping list** — household-scaled quantities, pantry deduction, categories, estimated cost
- **AI planning** — Gemini ranks recipes from the catalog (ingredient reuse, budget, health goals)
- **Recipe screen** — nutrition facts, scaled ingredients, instructions, health benefits
- **Pantry** — searchable add/remove/adjust of staple ingredients
- **Profile** — editable preferences, household management, dark mode, notifications

## Data model

- **Catalog** (shared): `ingredients`, `recipes` tables — seeded via `pnpm run seed`
- **Per user**: `profiles`, `household_members`, `pantry_items`, `meal_plans`, `favorites`, `user_ingredient_prices`
