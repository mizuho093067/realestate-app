import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient.js";

const AuthContext = createContext(null);

// ログイン状態（セッション）をアプリ全体に配るコンポーネント
function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  // 保存済みセッションの読み込みが終わるまでは true
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ブラウザに保存されているセッションを読み込む（再読み込み後もログインを保つ）
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // ログイン・ログアウト・トークン更新のたびにセッションを更新する
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const value = { session, user: session?.user ?? null, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ログイン状態を取り出すフック
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
