-- Allow authenticated users to save AI-generated recipes (id prefix ai-)

GRANT INSERT, UPDATE ON public.recipes TO authenticated;

CREATE POLICY "recipes_insert_ai" ON public.recipes
	FOR INSERT TO authenticated
	WITH CHECK (id LIKE 'ai-%');

CREATE POLICY "recipes_update_ai" ON public.recipes
	FOR UPDATE TO authenticated
	USING (id LIKE 'ai-%')
	WITH CHECK (id LIKE 'ai-%');
