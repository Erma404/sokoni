-- Storage bucket for checkpoint documents (phyto certs, bills of lading,
-- QC photos, etc.), uploaded from the back office and organized by tracking
-- code: tracking-documents/{tracking_code}/{filename}. Public bucket so the
-- resulting URL works directly on the public tracking page, same as
-- tracking_events itself is public-read.
insert into storage.buckets (id, name, public)
values ('tracking-documents', 'tracking-documents', true)
on conflict (id) do nothing;

create policy "admin uploads tracking documents" on storage.objects for insert to authenticated
  with check (bucket_id = 'tracking-documents' and public.has_role(auth.uid(), 'admin'));

create policy "admin deletes tracking documents" on storage.objects for delete to authenticated
  using (bucket_id = 'tracking-documents' and public.has_role(auth.uid(), 'admin'));
