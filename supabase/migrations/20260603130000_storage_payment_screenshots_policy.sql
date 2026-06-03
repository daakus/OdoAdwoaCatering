-- Allow anyone (guest or logged-in) to upload payment screenshots
-- Admins can read all; owners can read their own
create policy "payment_screenshots_upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'payment-screenshots');

create policy "payment_screenshots_read_admin"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'payment-screenshots'
    and public.current_role_slug() in ('admin', 'super_admin')
  );
