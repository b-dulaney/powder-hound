-- The scraper monitor (powder-hound-go) asks Claude to read a resort's page when its terrain
-- data can't settle whether it's open. To avoid paying for the same answer every day, it
-- stores a fingerprint of the page's status-related text after each read and skips the next
-- read while the fingerprint is unchanged (forcing one at least weekly).
create table public.resort_status_reads (
  mountain_id smallint primary key references public.mountains (mountain_id) on delete cascade,
  page_fingerprint text not null,
  read_at timestamptz not null default now()
);

comment on table public.resort_status_reads is
  'Last Claude status read per resort, written by the scraper monitor (service_role only).';

alter table public.resort_status_reads enable row level security;

revoke all on public.resort_status_reads from anon, authenticated;
grant select, insert, update, delete on public.resort_status_reads to service_role;
