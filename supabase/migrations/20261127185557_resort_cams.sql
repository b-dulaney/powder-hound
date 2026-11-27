-- Snow stake cams. powder-hound-go captures a frame from each cam listed in the scraper configs
-- (supabase/storage/scraping-config/*.json, `cams`) on a schedule, uploads it to the public
-- resort-cams bucket and records it here. The resort page shows the recent frames.
--
--   resort_cams          one row per configured cam, kept in step with the configs by
--                        sync_resort_cams(). Cams removed from a config are deactivated, never
--                        deleted, so their stored frames stay accounted for. Public read.
--   resort_cam_images    one row per stored frame; frames identical to the previous one are
--                        skipped. Public read. Kept 7 days: powder-hound-go deletes older objects
--                        and then their rows (Storage objects can only be removed through the
--                        Storage API, not SQL).
--   resort_cam_status    last capture outcome per cam, for health checks. service_role only.
--                        Not in scraping_status: the job health check counts every successful
--                        row there as a resort scrape.
--
-- Capture job heartbeats use record_job_run('cam-capture'); a later migration sets its max_age
-- once the capture task is deployed, so nothing alerts before then.

-- ---------------------------------------------------------------------------------------------
-- Cams
-- ---------------------------------------------------------------------------------------------
create table public.resort_cams (
  id bigint generated always as identity primary key,
  mountain_id smallint not null references public.mountains (mountain_id) on delete cascade,
  key text not null
    constraint resort_cams_key_check check (key ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(key) <= 40),
  kind text not null
    constraint resort_cams_kind_check check (kind in ('snow-stake')),
  label text not null
    constraint resort_cams_label_check check (length(label) between 1 and 40),
  page_url text not null
    constraint resort_cams_page_url_check check (page_url like 'https://%'),
  cleared_at time,
  unofficial boolean not null default false,
  -- Position in the config's cams array.
  sort_order smallint not null default 0,
  active boolean not null default true,
  updated_at timestamptz not null default now(),
  -- Also the index for the mountain_id foreign key and the page's per-resort lookup.
  constraint resort_cams_mountain_key_key unique (mountain_id, key)
);

comment on table public.resort_cams is
  'Cams from the scraper configs, synced by powder-hound-go via sync_resort_cams(). Public read.';
comment on column public.resort_cams.key is
  'Stable id from the config, unique per resort; used in storage paths.';
comment on column public.resort_cams.cleared_at is
  'Local time (America/Denver) the resort usually clears the stake; null when not stated.';
comment on column public.resort_cams.active is
  'False once the cam is removed from its config; its frames expire normally.';

-- ---------------------------------------------------------------------------------------------
-- Frames
-- ---------------------------------------------------------------------------------------------
create table public.resort_cam_images (
  id bigint generated always as identity primary key,
  -- restrict: deleting a cam row would orphan its Storage objects. Cams are deactivated instead.
  cam_id bigint not null references public.resort_cams (id) on delete restrict,
  captured_at timestamptz not null,
  -- The source's own timestamp (e.g. Last-Modified), when it gives one.
  source_updated_at timestamptz,
  path text not null
    constraint resort_cam_images_path_key unique,
  thumb_path text not null,
  width smallint not null constraint resort_cam_images_width_check check (width > 0),
  height smallint not null constraint resort_cam_images_height_check check (height > 0),
  sha256 text not null
    constraint resort_cam_images_sha256_check check (sha256 ~ '^[0-9a-f]{64}$')
);

comment on table public.resort_cam_images is
  'Stored cam frames (paths in the resort-cams bucket), written by powder-hound-go. Public read; kept 7 days.';

-- The page's "recent frames for this cam" query, the latest-frame lookup for skipping unchanged
-- frames, and the cam_id foreign key.
create index resort_cam_images_cam_captured_idx
  on public.resort_cam_images (cam_id, captured_at desc);

-- The retention sweep across all cams.
create index resort_cam_images_captured_idx
  on public.resort_cam_images (captured_at);

-- ---------------------------------------------------------------------------------------------
-- Capture health
-- ---------------------------------------------------------------------------------------------
create table public.resort_cam_status (
  cam_id bigint primary key references public.resort_cams (id) on delete cascade,
  last_success_at timestamptz,
  last_error_at timestamptz,
  last_error text
);

comment on table public.resort_cam_status is
  'Last capture outcome per cam, written via record_cam_capture() (service_role only).';

-- Records one capture attempt: p_error null for success (stored or skipped as unchanged), the
-- error message for a failure.
create function public.record_cam_capture(p_cam_id bigint, p_error text default null)
returns void
language sql
security invoker
set search_path = ''
as $$
  insert into public.resort_cam_status as s (cam_id, last_success_at, last_error_at, last_error)
  values (
    p_cam_id,
    case when p_error is null then now() end,
    case when p_error is not null then now() end,
    p_error
  )
  on conflict (cam_id) do update set
    last_success_at = coalesce(excluded.last_success_at, s.last_success_at),
    last_error_at = coalesce(excluded.last_error_at, s.last_error_at),
    last_error = coalesce(excluded.last_error, s.last_error);
$$;

-- ---------------------------------------------------------------------------------------------
-- Sync from the configs
-- ---------------------------------------------------------------------------------------------
-- Makes one resort's cams match p_cams, its config's `cams` array as is (camelCase keys:
-- key, kind, label, pageURL, clearedAt, unofficial; other keys are ignored). Upserts each cam,
-- deactivates the resort's cams that are no longer listed, and returns the resort's active cams.
-- Per resort, so a config that fails to load never deactivates another resort's cams.
create function public.sync_resort_cams(p_mountain_id smallint, p_cams jsonb)
returns setof public.resort_cams
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_cams is null or jsonb_typeof(p_cams) <> 'array' then
    raise exception 'sync_resort_cams: p_cams must be a JSON array, got %', coalesce(jsonb_typeof(p_cams), 'null');
  end if;

  update public.resort_cams c
  set active = false, updated_at = now()
  where c.mountain_id = p_mountain_id
    and c.active
    and not exists (
      select 1 from jsonb_array_elements(p_cams) e where e ->> 'key' = c.key
    );

  insert into public.resort_cams as c
    (mountain_id, key, kind, label, page_url, cleared_at, unofficial, sort_order, active)
  select
    p_mountain_id,
    e ->> 'key',
    e ->> 'kind',
    e ->> 'label',
    e ->> 'pageURL',
    (e ->> 'clearedAt')::time,
    coalesce((e ->> 'unofficial')::boolean, false),
    (t.ord - 1)::smallint,
    true
  from jsonb_array_elements(p_cams) with ordinality as t (e, ord)
  on conflict (mountain_id, key) do update set
    kind = excluded.kind,
    label = excluded.label,
    page_url = excluded.page_url,
    cleared_at = excluded.cleared_at,
    unofficial = excluded.unofficial,
    sort_order = excluded.sort_order,
    active = true,
    updated_at = now()
  -- Only touch rows that changed, so updated_at means "config last changed".
  where (c.kind, c.label, c.page_url, c.cleared_at, c.unofficial, c.sort_order, c.active)
    is distinct from
    (excluded.kind, excluded.label, excluded.page_url, excluded.cleared_at, excluded.unofficial, excluded.sort_order, true);

  return query
    select * from public.resort_cams c
    where c.mountain_id = p_mountain_id and c.active
    order by c.sort_order;
end;
$$;

-- ---------------------------------------------------------------------------------------------
-- Access: public read for cams and frames; everything else service_role only.
-- ---------------------------------------------------------------------------------------------
alter table public.resort_cams enable row level security;
alter table public.resort_cam_images enable row level security;
alter table public.resort_cam_status enable row level security;

create policy "Cams are public" on public.resort_cams
  for select to anon, authenticated using (true);
create policy "Cam images are public" on public.resort_cam_images
  for select to anon, authenticated using (true);

-- Supabase's default privileges grant everything to these roles; start from nothing.
revoke all on public.resort_cams, public.resort_cam_images, public.resort_cam_status
  from anon, authenticated, service_role;
grant select on public.resort_cams, public.resort_cam_images to anon, authenticated;
grant select, insert, update on public.resort_cams to service_role;
grant select, insert, delete on public.resort_cam_images to service_role;
grant select, insert, update, delete on public.resort_cam_status to service_role;

revoke all on function public.record_cam_capture(bigint, text) from public, anon, authenticated;
grant execute on function public.record_cam_capture(bigint, text) to service_role;
revoke all on function public.sync_resort_cams(smallint, jsonb) from public, anon, authenticated;
grant execute on function public.sync_resort_cams(smallint, jsonb) to service_role;

-- ---------------------------------------------------------------------------------------------
-- Storage
-- ---------------------------------------------------------------------------------------------
-- Public bucket: frames are copies of public resort webcams, served by public URL. No policies
-- on storage.objects, so only the service role can write, and nobody can list the bucket.
-- Paths: <resort slug>/<cam key>/<YYYY-MM-DD>/<HHMM>-<sha8>.jpg plus a -thumb.jpg alongside.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resort-cams', 'resort-cams', true, 5242880, array['image/jpeg', 'image/webp'])
on conflict (id) do nothing;
