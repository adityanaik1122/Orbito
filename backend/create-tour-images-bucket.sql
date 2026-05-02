-- Create storage bucket for tour images
select storage.create_bucket('tour-images', public := true);

-- Allow authenticated users (admins) to upload and update images
create policy "tour images upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'tour-images');

create policy "tour images update"
on storage.objects for update
to authenticated
using (bucket_id = 'tour-images');

create policy "tour images read"
on storage.objects for select
to public
using (bucket_id = 'tour-images');
