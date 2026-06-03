-- Odo Adwoa Catering Services — core ordering schema
-- Adds: orders, order_items, event_bookings tables

-- ── Orders ────────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  subtotal_ghs     numeric(10,2) not null default 0,
  total_ghs        numeric(10,2) not null default 0,
  payment_method   text not null default 'mtn_momo',
  payment_reference text not null,
  screenshot_path  text,
  whatsapp_sent    boolean not null default false,
  notes            text,
  status           text not null default 'pending'
                     check (status in ('pending','confirmed','preparing','ready','delivered','cancelled')),
  created_at       timestamptz not null default now()
);

-- ── Order Items ───────────────────────────────────────────────────────────────
create table if not exists public.order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  item_id         text not null,
  item_name       text not null,
  item_price_ghs  numeric(10,2) not null,
  quantity        int not null check (quantity > 0),
  line_total_ghs  numeric(10,2) not null,
  created_at      timestamptz not null default now()
);

-- ── Event Bookings ────────────────────────────────────────────────────────────
create table if not exists public.event_bookings (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid references auth.users(id) on delete set null,
  customer_name        text not null,
  customer_phone       text not null,
  customer_email       text,
  event_type           text not null
                         check (event_type in ('Wedding','Funeral','Party','Corporate','Other')),
  event_date           date not null,
  event_time           text not null,
  venue                text not null,
  guest_count          int not null check (guest_count > 0),
  selected_packages    jsonb not null default '[]',
  deposit_amount_ghs   numeric(10,2) not null default 0,
  payment_method       text not null default 'mtn_momo',
  payment_reference    text not null,
  screenshot_path      text,
  whatsapp_sent        boolean not null default false,
  notes                text,
  status               text not null default 'enquiry'
                         check (status in ('enquiry','confirmed','in_progress','completed','cancelled')),
  created_at           timestamptz not null default now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
create index if not exists orders_user_id_idx       on public.orders(user_id);
create index if not exists orders_status_idx        on public.orders(status);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists event_bookings_user_idx  on public.event_bookings(user_id);
create index if not exists event_bookings_date_idx  on public.event_bookings(event_date);

-- ── RLS ───────────────────────────────────────────────────────────────────────
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;
alter table public.event_bookings  enable row level security;

create policy "orders_insert" on public.orders
  for insert with check (true);

create policy "orders_select_owner" on public.orders
  for select using (
    user_id = auth.uid()
    or public.current_role_slug() in ('admin','super_admin')
  );

create policy "orders_update_admin" on public.orders
  for update using (
    public.current_role_slug() in ('admin','super_admin')
  );

create policy "order_items_insert" on public.order_items
  for insert with check (true);

create policy "order_items_select" on public.order_items
  for select using (
    order_id in (
      select id from public.orders where user_id = auth.uid()
    )
    or public.current_role_slug() in ('admin','super_admin')
  );

create policy "event_bookings_insert" on public.event_bookings
  for insert with check (true);

create policy "event_bookings_select_owner" on public.event_bookings
  for select using (
    user_id = auth.uid()
    or public.current_role_slug() in ('admin','super_admin')
  );

create policy "event_bookings_update_admin" on public.event_bookings
  for update using (
    public.current_role_slug() in ('admin','super_admin')
  );

-- ── Storage bucket ────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('payment-screenshots', 'payment-screenshots', false)
  on conflict (id) do nothing;
