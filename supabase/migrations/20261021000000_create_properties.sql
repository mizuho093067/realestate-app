-- =====================================================================
-- 物件テーブル（properties）の作成
-- Supabase ダッシュボードの SQL Editor に貼り付けて実行する
-- =====================================================================

create table public.properties (
  id          uuid primary key default gen_random_uuid(),
  -- 登録したユーザー。省略時はログイン中のユーザーの ID が自動で入る
  -- ユーザーが削除されたら、そのユーザーの物件も一緒に削除する
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(trim(name)) between 1 and 100),    -- 物件名
  rent        integer not null check (rent >= 0),                                  -- 家賃（円 / 月）
  area        text not null check (char_length(trim(area)) between 1 and 100),    -- エリア名
  layout      text not null check (char_length(trim(layout)) between 1 and 20),   -- 間取り（例: 1LDK）
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.properties is '不動産物件（ユーザーごとに管理）';

-- 「自分の物件」を探す検索を速くするための索引
create index properties_user_id_idx on public.properties (user_id);

-- ---------------------------------------------------------------------
-- 更新日時（updated_at）を自動で更新するトリガー
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger properties_set_updated_at
  before update on public.properties
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 行レベルセキュリティ（RLS）
-- 自分が登録した物件だけを表示・登録・編集・削除できるようにする
-- ---------------------------------------------------------------------
alter table public.properties enable row level security;

-- ログインユーザーにだけ操作を許可する（未ログインの anon には何も許可しない）
grant select, insert, update, delete on public.properties to authenticated;
revoke all on public.properties from anon;

-- 表示: 自分の物件だけ
create policy "自分の物件を表示できる"
  on public.properties for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 登録: 自分の ID でしか登録できない（他人の ID を指定した登録は拒否）
create policy "自分の物件を登録できる"
  on public.properties for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- 編集: 自分の物件だけ。持ち主を他人に書き換えることもできない
create policy "自分の物件を編集できる"
  on public.properties for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 削除: 自分の物件だけ
create policy "自分の物件を削除できる"
  on public.properties for delete
  to authenticated
  using ((select auth.uid()) = user_id);
