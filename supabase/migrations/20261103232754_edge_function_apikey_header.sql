-- New-style API keys (sb_secret_...) are not JWTs and belong in the `apikey` header, not
-- `Authorization: Bearer`. caic-data-cron now authorizes the `apikey` header itself (verify_jwt off).
--
-- Rollout: deploy caic-data-cron first, apply this migration, then replace the Vault
-- `service_role_key` value with a secret key. On hosted projects the function only accepts
-- secret keys, so the CAIC job returns 401 until Vault holds one.

create or replace function private.invoke_edge_function(function_name text, body jsonb default '{}'::jsonb)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  base_url text;
  api_key text;
begin
  select decrypted_secret into base_url from vault.decrypted_secrets where name = 'project_url';
  select decrypted_secret into api_key from vault.decrypted_secrets where name = 'service_role_key';

  if base_url is null or api_key is null then
    raise exception 'Vault secrets "project_url" and "service_role_key" must be set to invoke edge functions';
  end if;

  return net.http_post(
    url := rtrim(base_url, '/') || '/functions/v1/' || function_name,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', api_key
    ),
    body := coalesce(body, '{}'::jsonb),
    -- caic-data-cron fetches all mountains before responding; the 5s default reports false timeouts.
    timeout_milliseconds := 60000
  );
end;
$$;

revoke all on function private.invoke_edge_function(text, jsonb) from public, anon, authenticated;
