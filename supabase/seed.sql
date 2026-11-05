-- Development seed. Runs on `supabase db reset` / `supabase start`, and once when a Supabase
-- branch is created. Must stay safe on hosted branches (see the Vault block below).
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

-- Reference data: resort_conditions columns maintained by hand (totals and links), exported from
-- production 2026-11-05 (Monarch's total_lifts corrected to the 9 its site lists). Scraped values and status are left to the scraper and the monitor.
-- Fills gaps only, so it can also be re-run on an existing branch:
--   supabase db query --linked --project-ref <ref> -f supabase/seed.sql
insert into public.resort_conditions (mountain_id, display_name, total_lifts, total_runs, snow_stake_url, lifts_url, trails_url) values
  (1, 'Steamboat', 23, 184, 'https://www.youtube.com/watch?v=MrWQ6Qyehrg', 'https://www.steamboat.com/the-mountain/mountain-report#lift-and-trail-status', 'https://www.steamboat.com/the-mountain/mountain-report#lift-and-trail-status'),
  (2, 'Aspen Snowmass', 20, 98, null, 'https://www.aspensnowmass.com/four-mountains/snowmass/lift-status', 'https://www.aspensnowmass.com/four-mountains/snowmass/snow-and-grooming-report'),
  (3, 'Winter Park', 24, 171, 'https://www.youtube.com/watch?v=_wOIgFEMypY', 'https://www.winterparkresort.com/the-mountain/mountain-report#lift-and-trail-status', 'https://www.winterparkresort.com/the-mountain/mountain-report#lift-and-trail-status'),
  (4, 'Copper Mountain', 23, 159, null, 'https://www.coppercolorado.com/the-mountain/trail-lift-info/winter-trail-report', 'https://www.coppercolorado.com/the-mountain/trail-lift-info/winter-trail-report'),
  (5, 'A-Basin', 9, 144, null, 'https://www.arapahoebasin.com/snow-report/#terrainAndLiftStatus', 'https://www.arapahoebasin.com/snow-report/#terrainAndLiftStatus'),
  (6, 'Eldora', 10, 62, null, 'https://www.eldora.com/the-mountain/lift-trail-report/snow-grooming-alpine', 'https://www.eldora.com/the-mountain/lift-trail-report/snow-grooming-alpine'),
  (7, 'Sunlight Mountain', 3, 77, null, 'https://sunlightmtn.com/the-mountain/snow-weather-report', 'https://sunlightmtn.com/the-mountain/snow-weather-report'),
  (8, 'Monarch', 9, 67, null, 'https://skimonarch.com/conditions/', 'https://skimonarch.com/conditions/'),
  (9, 'Loveland', 10, 94, null, 'https://skiloveland.com/trail-lift-report/', 'https://skiloveland.com/trail-lift-report/'),
  (10, 'Beaver Creek', 26, 176, null, 'https://www.beavercreek.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx', 'https://www.beavercreek.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx'),
  (11, 'Breckenridge', 35, 192, null, 'https://www.breckenridge.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx', 'https://www.breckenridge.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx'),
  (12, 'Keystone', 21, 143, null, 'https://www.keystoneresort.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx', 'https://www.keystoneresort.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx'),
  (13, 'Vail', 33, 278, null, 'https://www.vail.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx', 'https://www.vail.com/the-mountain/mountain-conditions/terrain-and-lift-status.aspx'),
  (14, 'Aspen Highlands', 5, 118, null, 'https://www.aspensnowmass.com/four-mountains/aspen-highlands/lift-status', 'https://www.aspensnowmass.com/four-mountains/aspen-highlands/snow-and-grooming-report'),
  (15, 'Aspen Mountain', 9, 104, null, 'https://www.aspensnowmass.com/four-mountains/aspen-mountain/lift-status', 'https://www.aspensnowmass.com/four-mountains/aspen-mountain/snow-and-grooming-report'),
  (16, 'Purgatory', 11, 107, 'https://www.youtube.com/watch?v=l8gwM2H_DgU', 'https://www.purgatory.ski/mountain/weather-conditions-webcams/snow-weather/', 'https://www.purgatory.ski/mountain/weather-conditions-webcams/snow-weather/'),
  (18, 'Telluride', 17, 147, null, 'https://tellurideskiresort.com/snow-report/', 'https://tellurideskiresort.com/snow-report/'),
  (19, 'Crested Butte', 15, 165, null, 'https://www.skicb.com/the-mountain/mountain-conditions/lift-and-terrain-status.aspx', 'https://www.skicb.com/the-mountain/mountain-conditions/lift-and-terrain-status.aspx'),
  (27, 'Powderhorn', 5, 57, null, 'https://www.powderhorn.com/explore/conditions/weather-report.html', 'https://www.powderhorn.com/explore/conditions/weather-report.html')
on conflict (mountain_id) do update set
  display_name = coalesce(resort_conditions.display_name, excluded.display_name),
  total_lifts = coalesce(resort_conditions.total_lifts, excluded.total_lifts),
  total_runs = coalesce(resort_conditions.total_runs, excluded.total_runs),
  snow_stake_url = coalesce(resort_conditions.snow_stake_url, excluded.snow_stake_url),
  lifts_url = coalesce(resort_conditions.lifts_url, excluded.lifts_url),
  trails_url = coalesce(resort_conditions.trails_url, excluded.trails_url);

-- Vault secrets used by private.invoke_edge_function, for the LOCAL stack only.
-- Values: the API gateway as seen from the db container, and a service_role JWT signed with the
-- local stack's JWT secret (no key is committed to the repo).
-- Hosted databases (prod and Supabase branches) don't expose app.settings.jwt_secret, so this
-- block is skipped there; set a branch's project_url / service_role_key in its SQL editor.
-- Only created when missing, so existing values are never overwritten.
do $$
begin
  if current_setting('app.settings.jwt_secret', true) is null then
    raise notice 'Not the local stack; skipping local Vault secrets';
    return;
  end if;

  if not exists (select 1 from vault.secrets where name = 'project_url') then
    perform vault.create_secret('http://kong:8000', 'project_url');
  end if;

  if not exists (select 1 from vault.secrets where name = 'service_role_key') then
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
