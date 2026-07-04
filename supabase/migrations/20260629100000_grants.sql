-- Table-level grants required for Supabase roles (RLS alone is not enough)

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ingredients TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recipes TO service_role;
GRANT SELECT ON public.ingredients TO authenticated;
GRANT SELECT ON public.recipes TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.household_members TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pantry_items TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meal_plans TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_ingredient_prices TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorites TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plan_generations TO authenticated, service_role;
