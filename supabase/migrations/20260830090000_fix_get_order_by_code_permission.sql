-- get_order_by_code() lost its EXECUTE grant at some point after the
-- 2026-08-04 migration that created it with `grant ... to anon,
-- authenticated` (not reflected in any migration in this repo — likely an
-- out-of-band security lockdown applied directly on the live database).
-- This breaks the public order-tracking page for every visitor, logged in
-- or not: PostgREST returns 42501 "permission denied for function
-- get_order_by_code" instead of the order.
grant execute on function public.get_order_by_code(text) to anon, authenticated;
