import { supabase } from "./supabaseClient.js";

// 画面で使う列だけを取得する
const COLUMNS = "id, name, rent, area, layout, created_at";

// Supabase（PostgREST）のエラーを日本語メッセージの Error に変換する
function toError(error, action) {
  // テーブルがまだ作られていない場合
  if (error.code === "PGRST205" || error.code === "42P01") {
    return new Error(
      "物件テーブルがありません。supabase/migrations/ の SQL を Supabase の SQL Editor で実行してください。"
    );
  }
  // 入力値がテーブルの制約（文字数・家賃が0以上など）に合わない場合
  if (error.code === "23514") {
    return new Error(`${action}できませんでした。入力内容を確認してください。`);
  }
  // RLS で拒否された場合
  if (error.code === "42501") {
    return new Error(`${action}する権限がありません。ログインし直してください。`);
  }
  return new Error(`${action}に失敗しました: ${error.message}`);
}

// 自分の物件一覧を取得する（RLS により自分の物件だけが返る）。新しい順
export async function fetchProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select(COLUMNS)
    .order("created_at", { ascending: false });

  if (error) throw toError(error, "物件の読み込み");
  return data;
}

// 物件を登録する。user_id はデータベース側でログイン中のユーザーが自動で入る
export async function createProperty(values) {
  const { data, error } = await supabase
    .from("properties")
    .insert(values)
    .select(COLUMNS)
    .single();

  if (error) throw toError(error, "物件の登録");
  return data;
}

// 物件を更新する
export async function updateProperty(id, values) {
  const { data, error } = await supabase
    .from("properties")
    .update(values)
    .eq("id", id)
    .select(COLUMNS)
    .single();

  if (error) throw toError(error, "物件の更新");
  return data;
}

// 物件を削除する
export async function deleteProperty(id) {
  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) throw toError(error, "物件の削除");
}
