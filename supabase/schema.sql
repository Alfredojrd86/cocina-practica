-- Esquema de base de datos — ¿Qué comemos?
-- Ejecutar en Supabase → SQL Editor. Idempotente (usa IF NOT EXISTS donde aplica).

-- ============ Favoritos (sincronizados por usuario) ============
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  pasos jsonb not null,
  approach text,
  meal text,
  created_at timestamptz default now(),
  unique (user_id, titulo)
);

alter table favorites enable row level security;
drop policy if exists "select propios" on favorites;
drop policy if exists "insert propios" on favorites;
drop policy if exists "update propios" on favorites;
drop policy if exists "delete propios" on favorites;
create policy "select propios" on favorites for select using (auth.uid() = user_id);
create policy "insert propios" on favorites for insert with check (auth.uid() = user_id);
create policy "update propios" on favorites for update using (auth.uid() = user_id);
create policy "delete propios" on favorites for delete using (auth.uid() = user_id);

-- ============ Despensa (un registro JSON por usuario) ============
create table if not exists pantry (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

alter table pantry enable row level security;
drop policy if exists "pantry select propio" on pantry;
drop policy if exists "pantry insert propio" on pantry;
drop policy if exists "pantry update propio" on pantry;
create policy "pantry select propio" on pantry for select using (auth.uid() = user_id);
create policy "pantry insert propio" on pantry for insert with check (auth.uid() = user_id);
create policy "pantry update propio" on pantry for update using (auth.uid() = user_id);

-- ============ Enfoques propios (creados por el usuario) ============
-- Cada enfoque propio hereda recetas/reglas de un 'base' (metabolismo|animal|balanceado)
-- y tiene su propia lista de alimentos sugeridos.
create table if not exists enfoques (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null,
  emoji text,
  base text not null default 'balanceado',
  sugeridos jsonb not null default '[]',
  created_at timestamptz default now()
);
alter table enfoques enable row level security;
drop policy if exists "enfoques select propio" on enfoques;
drop policy if exists "enfoques insert propio" on enfoques;
drop policy if exists "enfoques delete propio" on enfoques;
create policy "enfoques select propio" on enfoques for select using (auth.uid() = user_id);
create policy "enfoques insert propio" on enfoques for insert with check (auth.uid() = user_id);
create policy "enfoques delete propio" on enfoques for delete using (auth.uid() = user_id);

-- ============ Uso diario de IA (rate limit) ============
-- Solo la escribe el servidor con service_role (que omite RLS). RLS activo sin políticas
-- = los usuarios no la leen directamente.
create table if not exists ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default current_date,
  count int not null default 0,
  primary key (user_id, day)
);
alter table ai_usage enable row level security;

-- Incrementa de forma atómica el uso diario y devuelve si se permite.
create or replace function increment_ai_usage(p_user uuid, p_max int)
returns table(allowed boolean, used int, max_n int)
language plpgsql security definer as $$
declare cur int;
begin
  insert into ai_usage(user_id, day, count) values (p_user, current_date, 0)
    on conflict (user_id, day) do nothing;
  select count into cur from ai_usage
    where user_id = p_user and day = current_date for update;
  if cur >= p_max then
    return query select false, cur, p_max;
  else
    update ai_usage set count = count + 1
      where user_id = p_user and day = current_date;
    return query select true, cur + 1, p_max;
  end if;
end;$$;
