# NutriFlow

A mobile-first, premium prototype of a **personal AI nutrition assistant**. NutriFlow
automatically designs a weekly meal plan optimized for health, convenience and local
availability, then builds a zero-waste shopping list for your whole household.

> This is an MVP **prototype**. It runs entirely on mock JSON data — there is no backend
> and no AI implementation yet. The "Generate Weekly Plan" action is an intentional
> placeholder.

## Tech stack

- [SvelteKit 2](https://svelte.dev/docs/kit) + [Svelte 5](https://svelte.dev/docs/svelte) (runes)
- TypeScript
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
    data/                     # mock data: ingredients, recipes, mealPlan, household, ...
    stores/app.svelte.ts      # global reactive app state (runes)
    types.ts                  # shared TypeScript types
    meta.ts                   # option lists & meal-type metadata
```

## Key features in the prototype

- **Onboarding** — 8-step wizard collecting personal info, activity, goals, diet,
  allergies, cuisines, kitchen setup, location and pantry staples.
- **Household** — primary user plus members (partner, child, …) that can be enabled or
  disabled per week. Shopping quantities scale to active members (children count as a
  fraction of an adult portion) to avoid food waste.
- **Dashboard** — today's meals, nutrition score ring, weekly progress, hydration tracker
  and a live shopping-list preview.
- **Weekly plan** — 7-day calendar with breakfast / lunch / dinner / snack and meal
  replacement.
- **Recipe screen** — nutrition facts, ingredients, instructions, health benefits,
  substitutions, meal-prep tips and save-as-favorite.
- **Shopping list** — grouped by category, pantry-aware, with per-item prices and a weekly
  total against your budget.
- **Pantry** — searchable add/remove/adjust of staple ingredients.
- **Profile** — editable preferences, household management, dark mode, notifications and
  disabled "coming soon" features (AI Coach, Blood Test, Wearables, etc.).

## Mock data

All data lives in `src/lib/data/`: 50+ ingredients, 10 fully-detailed recipes, a 7-day
meal plan, an example household, derived shopping list and nutrition values.
