import { createClient } from "@supabase/supabase-js";

// 接続情報は .env から読み込む（VITE_ で始まる変数だけがブラウザ側で使える）
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    ".env に VITE_SUPABASE_URL と VITE_SUPABASE_PUBLISHABLE_KEY を設定してください（.env.example を参照）"
  );
}

// アプリ全体で共有する Supabase クライアント
export const supabase = createClient(supabaseUrl, supabaseKey);
