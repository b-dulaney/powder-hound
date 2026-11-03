-- Local development seed. Runs on `supabase db reset` / `supabase start` (and on new preview branches).
-- Contains reference data only; no user data.

-- Reference data: mountains (resorts + backcountry zones), exported from production 2026-11-03.
insert into public.mountains (mountain_id, display_name, lat, lon, region, caic_code, model_elevation, location_type, slug, pass, state) values
  (1, 'Steamboat', 40.4572, -106.804, 'Steamboat', 'STEAMBOAT', 9593, 'resort', 'steamboat', 'Ikon', 'CO'),
  (2, 'Aspen Snowmass', 39.2084, -106.949, 'Aspen', 'SNOWMASS', 10967, 'resort', 'aspen-snowmass', 'Ikon', 'CO'),
  (3, 'Winter Park', 39.8841, -105.763, 'Front Range', 'WINTERPARK', 10029, 'resort', 'winter-park', 'Ikon', 'CO'),
  (4, 'Copper Mountain', 39.5022, -106.15, 'Summit County', 'COPPERMTN', 10724, 'resort', 'copper-mountain', 'Ikon', 'CO'),
  (5, 'A-Basin', 39.6425, -105.872, 'Summit County', 'FWAB', 11928, 'resort', 'a-basin', 'Ikon', 'CO'),
  (6, 'Eldora', 39.9372, -105.583, 'Front Range', 'ELDORA', 9189, 'resort', 'eldora', 'Ikon', 'CO'),
  (7, 'Sunlight Mountain', 39.4275, -107.382, 'Aspen', 'SUNLIGHT', 9799, 'resort', 'sunlight-mountain', 'Independent', 'CO'),
  (8, 'Monarch', 38.497, -106.325, 'Sawatch', 'MONARCHPAS', 11177, 'resort', 'monarch', 'Independent', 'CO'),
  (9, 'Loveland', 39.6757, -105.912, 'Front Range', 'LOVELAND', 11912, 'resort', 'loveland', 'Independent', 'CO'),
  (10, 'Beaver Creek', 39.5673, -106.508, 'Eagle County', 'BC_TOP', 10862, 'resort', 'beaver-creek', 'Epic', 'CO'),
  (11, 'Breckenridge', 39.4727, -106.103, 'Summit County', 'BRECKENRDG', 11587, 'resort', 'breckenridge', 'Epic', 'CO'),
  (12, 'Keystone', 39.5792, -105.943, 'Summit County', 'KEYSTONE', 10869, 'resort', 'keystone', 'Epic', 'CO'),
  (13, 'Vail', 39.5988, -106.376, 'Eagle County', 'VAILSKI', 10190, 'resort', 'vail', 'Epic', 'CO'),
  (14, 'Aspen Highlands', 39.12, -106.88, 'Aspen', 'AHIGHLANDS', 10662, 'resort', 'aspen-highlands', 'Ikon', 'CO'),
  (15, 'Aspen Mountain', 39.15, -106.817, 'Aspen', 'ASPENMTSA', 10088, 'resort', 'aspen-mountain', 'Ikon', 'CO'),
  (16, 'Purgatory', 37.6184, -107.834, 'South San Juans', 'PURGATORY', 9622, 'resort', 'purgatory', 'Independent', 'CO'),
  (17, 'Silverton Mountain', 37.8683, -107.665, 'North San Juans', 'SILVERTON', 11443, 'backcountry', 'silverton-mountain', null, 'CO'),
  (18, 'Telluride', 37.9131, -107.822, 'North San Juans', 'TELLURIDE', 10646, 'resort', 'telluride', 'Epic', 'CO'),
  (19, 'Crested Butte', 38.8833, -106.943, 'Gunnison', 'CRESTEDBTE', 10275, 'resort', 'crested-butte', 'Epic', 'CO'),
  (20, 'Bear Lake - RMNP', 40.3132, -105.648, 'Front Range', 'BEARLAKE', 10206, 'backcountry', 'bear-lake', null, 'CO'),
  (21, 'Berthoud Pass', 39.7985, -105.777, 'Front Range', 'BERTHPASS', 11358, 'backcountry', 'berthoud-pass', null, 'CO'),
  (22, 'Cameron Pass', 40.5101, -105.891, 'Front Range', 'CAMERONPCO', 10705, 'backcountry', 'cameron-pass', null, 'CO'),
  (23, 'Vail Pass', 39.531, -106.217, 'Eagle County', 'VAIL_PASS', 10934, 'backcountry', 'vail-pass', null, 'CO'),
  (24, 'Loveland Pass', 39.6637, -105.879, 'Front Range', 'LVLNDPASS', 11741, 'backcountry', 'loveland-pass', null, 'CO'),
  (25, 'Cottonwood Pass', 38.828, -106.409, 'Sawatch', 'COTNWDPASS', 11449, 'backcountry', 'cottonwood-pass', null, 'CO'),
  (26, 'Fremont Pass', 39.3678, -106.188, 'Sawatch', 'FREMONTPAS', 11804, 'backcountry', 'fremont-pass', null, 'CO'),
  (27, 'Powderhorn', 39.0647, -108.155, 'Grand Mesa', 'POWDERHORN', 9084, 'resort', 'powderhorn', null, 'CO'),
  (28, 'Red Mountain Pass', 37.899, -107.711, 'North San Juans', 'RMP', 11781, 'backcountry', 'red-mountain-pass', null, 'CO'),
  (29, 'Wolf Creek Pass', 37.4827, -106.802, 'South San Juans', 'WOLFCKPASS', 10724, 'backcountry', 'wolf-creek-pass', null, 'CO'),
  (31, 'Lizard Head Pass', 37.8111, -107.908, 'North San Juans', 'LIZHEADPAS', 10846, 'backcountry', 'lizard-head-pass', null, 'CO'),
  (32, 'Farwell Mountain', 40.8324, -106.853, 'Steamboat', 'FARWELL', 9333, 'backcountry', 'farwell-mountain', null, 'CO')
on conflict (mountain_id) do nothing;

-- Vault secrets used by private.invoke_edge_function. Only created when missing, so hosted
-- environments that already have real values are never overwritten.
-- Local values: the API gateway as seen from the db container, and a service_role JWT signed
-- with the local stack's JWT secret (no key is committed to the repo).
do $$
begin
  if not exists (select 1 from vault.secrets where name = 'project_url') then
    perform vault.create_secret('http://kong:8000', 'project_url');
  end if;

  if not exists (select 1 from vault.secrets where name = 'service_role_key')
     and current_setting('app.settings.jwt_secret', true) is not null then
    perform vault.create_secret(
      -- Compact JSON literal so the token is byte-identical to the local stack's SERVICE_ROLE_KEY.
      extensions.sign(
        '{"iss":"supabase-demo","role":"service_role","exp":1983812996}'::json,
        current_setting('app.settings.jwt_secret')
      ),
      'service_role_key'
    );
  end if;
end;
$$;
