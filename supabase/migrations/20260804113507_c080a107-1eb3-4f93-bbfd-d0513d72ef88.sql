
grant insert, update, delete on public.orders to authenticated;
grant insert, update, delete on public.tracking_events to authenticated;

create policy "admin manages orders" on public.orders for insert to authenticated
  with check (public.has_role(auth.uid(),'admin'));
create policy "admin updates orders" on public.orders for update to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin deletes orders" on public.orders for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));

create policy "admin adds events" on public.tracking_events for insert to authenticated
  with check (public.has_role(auth.uid(),'admin'));
create policy "admin updates events" on public.tracking_events for update to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin deletes events" on public.tracking_events for delete to authenticated
  using (public.has_role(auth.uid(),'admin'));
