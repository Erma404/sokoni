-- The 2026-08-04 migration revoked EXECUTE on has_role() from `public` and
-- `anon` but never re-granted it to `authenticated`. Since PUBLIC is the
-- base role every role inherits from, that revoke also stripped execute
-- rights from `authenticated` — breaking every RLS policy that calls
-- has_role(), including order creation/updates and the buyer/admin SELECT
-- policy on orders (which OR's into has_role() for non-owners).
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
