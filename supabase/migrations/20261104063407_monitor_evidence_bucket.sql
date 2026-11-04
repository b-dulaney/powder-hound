-- Public bucket for the scraper monitor's evidence screenshots (annotated proof images for
-- config-fix PRs, snow report screenshots for resort-status issues), linked from GitHub.
-- Screenshots of public resort websites only. Public read via the bucket's public URL;
-- no policies, so only the service role can write.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('monitor-evidence', 'monitor-evidence', true, 10485760, array['image/png', 'image/jpeg'])
on conflict (id) do nothing;
