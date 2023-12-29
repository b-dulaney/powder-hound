alter table "public"."mountains" enable row level security;

create policy "Enable insert for service role only"
on "public"."caic_data"
as permissive
for insert
to service_role
with check (true);


create policy "Enable update for service role only"
on "public"."caic_data"
as permissive
for update
to service_role
using (true)
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."mountains"
as permissive
for insert
to service_role
with check (true);


create policy "Enable read access for all users"
on "public"."mountains"
as permissive
for select
to public
using (true);



